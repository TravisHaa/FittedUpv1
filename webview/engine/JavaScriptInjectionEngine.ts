// Use any to avoid type resolution issues in CI lint without RN types

export class JavaScriptInjectionEngine {
  private readonly webViewRef: any;

  constructor(webViewRef: any) {
    this.webViewRef = webViewRef;
  }

  public post(action: string, payload: unknown = {}): void {
    const message = JSON.stringify({ action, ...(payload as object) });
    // Prefer postMessage through injected context; fallback to injectJavaScript
    // for platforms requiring explicit evaluation.
    try {
      this.webViewRef.current?.postMessage(message);
    } catch (_) {
      const js = `window.postMessage(${JSON.stringify(message)}, '*'); true;`;
      this.webViewRef.current?.injectJavaScript(js);
    }
  }

  public injectRaw(js: string): void {
    this.webViewRef.current?.injectJavaScript(js);
  }
}

