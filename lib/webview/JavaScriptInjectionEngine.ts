/*
  JavaScriptInjectionEngine
  - Builds and injects platform-aware scripts
  - Provides retry with exponential backoff and page-change monitoring
*/

export type PlatformId = 'depop' | 'ebay' | 'facebook' | 'unknown';

export interface InjectionMessage {
  action: string;
  [key: string]: any;
}

export interface InjectionCallbacks {
  postMessage: (message: string) => void;
}

export interface BackoffOptions {
  baseMs?: number;
  maxMs?: number;
  factor?: number;
  jitter?: boolean;
}

export class JavaScriptInjectionEngine {
  private platform: PlatformId;
  private callbacks: InjectionCallbacks;

  constructor(platform: PlatformId, callbacks: InjectionCallbacks) {
    this.platform = platform;
    this.callbacks = callbacks;
  }

  public buildInjectedScript(): string {
    // A single injected script that supports multiple actions and posts progress back
    return `
      (function() {
        function post(type, payload) {
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type, ...payload }));
          } catch (e) {
            // noop
          }
        }

        function toBlob(base64, mimeType) {
          const byteChars = atob(base64);
          const byteNums = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
          const byteArray = new Uint8Array(byteNums);
          return new Blob([byteArray], { type: mimeType || 'image/jpeg' });
        }

        function waitForSelector(selector, timeout = 12000) {
          return new Promise((resolve, reject) => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);

            const obs = new MutationObserver(() => {
              const el = document.querySelector(selector);
              if (el) { obs.disconnect(); resolve(el); }
            });
            obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
            setTimeout(() => { try { obs.disconnect(); } catch(_){}; reject(new Error('Timeout waiting for ' + selector)); }, timeout);
          });
        }

        async function typeHumanLike(input, text) {
          input.focus();
          input.value = '';
          for (let i = 0; i < String(text).length; i++) {
            input.value += String(text)[i];
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(r => setTimeout(r, 15 + Math.random() * 40));
          }
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }

        async function smartFill(selector, value) {
          const el = await waitForSelector(selector);
          const tag = (el.tagName || '').toLowerCase();
          if (tag === 'input' || tag === 'textarea') {
            await typeHumanLike(el, value);
          } else if (tag === 'select') {
            const opts = Array.from(el.options || []);
            const match = opts.find(o => (o.textContent || '').toLowerCase().includes(String(value).toLowerCase()));
            if (match) {
              el.value = match.value;
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }

        async function uploadImages(images) {
          const inputs = document.querySelectorAll('input[type="file"], input[accept*="image"]');
          if (!inputs || inputs.length === 0) throw new Error('No file input found');
          const dt = new DataTransfer();
          images.forEach((img, idx) => {
            const blob = toBlob(img.data, img.mimeType);
            const file = new File([blob], 'image-' + (idx+1) + '.jpg', { type: img.mimeType || 'image/jpeg' });
            dt.items.add(file);
          });
          const target = inputs[0];
          target.files = dt.files;
          target.dispatchEvent(new Event('change', { bubbles: true }));
        }

        function detectPlatform() {
          const host = location.hostname;
          if (host.includes('depop.com')) return 'depop';
          if (host.includes('ebay.com')) return 'ebay';
          if (host.includes('facebook.com')) return 'facebook';
          return 'unknown';
        }

        window.addEventListener('message', async function(ev) {
          try {
            const data = JSON.parse(ev.data || '{}');
            if (!data || !data.action) return;
            switch (data.action) {
              case 'DETECT_PLATFORM':
                post('PLATFORM_DETECTED', { platform: detectPlatform() });
                break;
              case 'FILL_FIELDS_BULK':
                if (!data.fields) break;
                try {
                  let filled = 0;
                  for (const item of data.fields) {
                    await smartFill(item.selector, item.value);
                    filled++;
                    post('PROGRESS', { stage: 'fill', filled, total: data.fields.length });
                  }
                  post('FORM_FILLED', { success: true });
                } catch (e) {
                  post('FORM_FILLED', { success: false, error: e.message });
                }
                break;
              case 'UPLOAD_IMAGES':
                try {
                  await uploadImages(data.images || []);
                  post('IMAGES_UPLOADED', { success: true });
                } catch (e) {
                  post('IMAGES_UPLOADED', { success: false, error: e.message });
                }
                break;
              case 'CLICK_SUBMIT':
                try {
                  const selectors = [
                    'button[type="submit"]',
                    'input[type="submit"]',
                    'button[aria-label*="submit" i]',
                    'button[aria-label*="post" i]'
                  ];
                  let btn = null;
                  for (const s of selectors) { btn = document.querySelector(s); if (btn) break; }
                  if (!btn) {
                    const buttons = Array.from(document.querySelectorAll('button'))
                      .find(b => /submit|post|list|publish|save/i.test(b.textContent || ''));
                    btn = buttons || null;
                  }
                  if (!btn) throw new Error('Submit button not found');
                  btn.click();
                  post('FORM_SUBMITTED', { success: true });
                } catch (e) {
                  post('FORM_SUBMITTED', { success: false, error: e.message });
                }
                break;
            }
          } catch (e) {
            // ignore
          }
        });

        post('SCRIPT_LOADED', { message: 'injected' });
        return true;
      })();
    `;
  }

  public postMessage(message: InjectionMessage): void {
    this.callbacks.postMessage(JSON.stringify(message));
  }

  public async injectWithRetry(send: () => void, retries: number = 3, backoff?: BackoffOptions): Promise<void> {
    const base = backoff?.baseMs ?? 300;
    const factor = backoff?.factor ?? 2;
    const max = backoff?.maxMs ?? 3000;
    const jitter = backoff?.jitter ?? true;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        send();
        return;
      } catch (e) {
        const wait = Math.min(base * Math.pow(factor, attempt), max) * (jitter ? (0.5 + Math.random()) : 1);
        await new Promise(r => setTimeout(r, wait));
      }
    }
    throw new Error('Injection attempts exhausted');
  }
}

