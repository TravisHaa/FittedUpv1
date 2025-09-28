// Plain string script injected into WebView. It sets up helpers, listens for
// RN messages, and replies via window.ReactNativeWebView.postMessage.

const script = `
  (function() {
    function safePost(obj) {
      try {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(obj));
      } catch (e) {
        // no-op
      }
    }

    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    function detectPlatform() {
      const hostname = window.location.hostname;
      if (hostname.includes('depop.com')) return 'depop';
      if (hostname.includes('ebay.com')) return 'ebay';
      if (hostname.includes('facebook.com')) return 'facebook';
      return 'unknown';
    }

    function query(selector) {
      try { return document.querySelector(selector); } catch (_) { return null; }
    }

    function matchesText(el, texts) {
      if (!el) return false;
      const t = (el.textContent || '').toLowerCase();
      return texts.some(x => t.includes(x));
    }

    function base64ToBlob(base64, mimeType) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType || 'image/jpeg' });
    }

    async function waitForElement(selector, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const existing = query(selector);
        if (existing) { resolve(existing); return; }
        const observer = new MutationObserver(() => {
          const el = query(selector);
          if (el) { observer.disconnect(); resolve(el); }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { observer.disconnect(); reject(new Error('Element not found within timeout')); }, timeout);
      });
    }

    function setValue(el, value) {
      if (!el) return;
      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'select') {
        const options = Array.from(el.options || []);
        const found = options.find(opt => (opt.text || '').toLowerCase().includes(String(value).toLowerCase()));
        if (found) el.value = found.value; else el.value = String(value);
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (tag === 'input' || tag === 'textarea') {
        (el as any).value = String(value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    function fillFormFields(data) {
      try {
        const title = document.querySelector('input[name="title"], input[placeholder*="title" i], textarea[name="title"]');
        const desc = document.querySelector('textarea[name="description"], textarea[placeholder*="description" i], textarea[name="details"]');
        const price = document.querySelector('input[name="price"], input[placeholder*="price" i], input[type="number"]');
        const category = document.querySelector('select[name="category"], input[name="category"], input[placeholder*="category" i]');
        const brand = document.querySelector('input[name="brand"], input[placeholder*="brand" i]');
        const condition = document.querySelector('select[name="condition"], input[name="condition"]');

        if (data.title) setValue(title, data.title);
        if (data.description) setValue(desc, data.description);
        if (data.price) setValue(price, data.price);
        if (data.category) setValue(category, data.category);
        if (data.brand) setValue(brand, data.brand);
        if (data.condition) setValue(condition, data.condition);

        safePost({ type: 'FORM_FILLED', success: true });
      } catch (error) {
        safePost({ type: 'FORM_FILLED', success: false, error: (error && error.message) || 'unknown' });
      }
    }

    function uploadImages(images) {
      try {
        const inputs = document.querySelectorAll('input[type="file"], input[accept*="image"]');
        if (!inputs.length) { safePost({ type: 'IMAGES_UPLOADED', success: false, error: 'No file input found' }); return; }

        const files = (images || []).map((img, idx) => new File([base64ToBlob(img.data, img.mimeType)], 'image-' + (idx + 1) + '.jpg', { type: img.mimeType || 'image/jpeg' }));

        inputs.forEach((input, index) => {
          const dt = new DataTransfer();
          if (files[index]) dt.items.add(files[index]);
          (input as any).files = dt.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });

        safePost({ type: 'IMAGES_UPLOADED', success: true });
      } catch (error) {
        safePost({ type: 'IMAGES_UPLOADED', success: false, error: (error && error.message) || 'unknown' });
      }
    }

    function submitForm() {
      try {
        const candidates = Array.from(document.querySelectorAll('button, input[type="submit"]'));
        const submit = candidates.find(el => matchesText(el, ['submit','post','list','create','publish','save'])) || document.querySelector('button[type="submit"], input[type="submit"]') as HTMLElement | null;
        if (submit) { (submit as any).click(); safePost({ type: 'FORM_SUBMITTED', success: true }); }
        else safePost({ type: 'FORM_SUBMITTED', success: false, error: 'Submit not found' });
      } catch (error) {
        safePost({ type: 'FORM_SUBMITTED', success: false, error: (error && error.message) || 'unknown' });
      }
    }

    window.addEventListener('message', function(event) {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data || !data.action) return;
        switch (data.action) {
          case 'FILL_FORM': fillFormFields(data.formData || {}); break;
          case 'UPLOAD_IMAGES': uploadImages(data.images || []); break;
          case 'SUBMIT_FORM': submitForm(); break;
          case 'WAIT_FOR_ELEMENT':
            waitForElement(data.selector, data.timeout).then(() => safePost({ type: 'ELEMENT_FOUND', selector: data.selector, success: true })).catch((e) => safePost({ type: 'ELEMENT_FOUND', selector: data.selector, success: false, error: e.message }));
            break;
          case 'DETECT_PLATFORM':
            safePost({ type: 'PLATFORM_DETECTED', platform: detectPlatform() });
            break;
        }
      } catch (e) {
        // ignore
      }
    });

    safePost({ type: 'SCRIPT_LOADED' });
    true;
  })();
`;

export function getInjectedScript(): string {
  return script;
}

