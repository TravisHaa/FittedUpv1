import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { JavaScriptInjectionEngine, PlatformId } from '../lib/webview/JavaScriptInjectionEngine';
import { DepopAdapter, EbayAdapter, FacebookAdapter, PlatformAdapter } from '../lib/webview/PlatformAdapter';

type Params = {
  listingData?: string;
  platform?: string;
  url?: string;
};

const resolveAdapter = (platform: PlatformId): PlatformAdapter => {
  switch (platform) {
    case 'ebay':
      return new EbayAdapter();
    case 'facebook':
      return new FacebookAdapter();
    case 'depop':
    default:
      return new DepopAdapter();
  }
};

const PlatformWebViewModern = () => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const params = useLocalSearchParams<Params>();
  const selectedPlatform = (params.platform as PlatformId) || 'depop';
  const customUrl = params.url as string | undefined;
  const parsedListing = useMemo(() => {
    try {
      return params.listingData ? JSON.parse(params.listingData) : null;
    } catch {
      return null;
    }
  }, [params.listingData]);

  const engine = useMemo(() => new JavaScriptInjectionEngine(selectedPlatform, {
    postMessage: (m: string) => webViewRef.current?.postMessage(m) as any,
  }), [selectedPlatform]);

  const adapter = useMemo(() => resolveAdapter(selectedPlatform), [selectedPlatform]);

  const injectedJavaScript = useMemo(() => engine.buildInjectedScript(), [engine]);

  const targetUrl = useMemo(() => customUrl || adapter.sellUrl, [customUrl, adapter.sellUrl]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data || '{}');
      switch (data.type) {
        case 'SCRIPT_LOADED':
          if (parsedListing) {
            const plan = adapter.buildPlan(parsedListing);
            if (targetUrl && !String(targetUrl).includes(locationHostFromUrl(plan.url))) {
              // Allow page to navigate first; in practice WebView handles this
            }
            engine.postMessage({ action: 'DETECT_PLATFORM' });
            engine.postMessage({ action: 'FILL_FIELDS_BULK', fields: plan.fields });
            if (parsedListing.images && parsedListing.images.length) {
              setTimeout(() => engine.postMessage({ action: 'UPLOAD_IMAGES', images: parsedListing.images }), 800);
            }
          }
          break;
        case 'PROGRESS':
          // Optional: show progress UI later
          break;
        case 'FORM_FILLED':
          if (!data.success) Alert.alert('Fill failed', data.error || 'Unknown error');
          break;
        case 'IMAGES_UPLOADED':
          if (!data.success) Alert.alert('Image upload failed', data.error || 'Unknown error');
          break;
        case 'FORM_SUBMITTED':
          if (data.success) Alert.alert('Submitted', 'Listing submitted');
          else Alert.alert('Submit failed', data.error || 'Unknown error');
          break;
        case 'PLATFORM_DETECTED':
          // Could validate platform here
          break;
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
          <Text style={{ color: '#007AFF' }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: '600', textTransform: 'capitalize' }}>{selectedPlatform}</Text>
        <TouchableOpacity onPress={() => webViewRef.current?.goBack()} disabled={!canGoBack} style={{ padding: 8, opacity: canGoBack ? 1 : 0.5 }}>
          <Text style={{ color: canGoBack ? '#007AFF' : '#999' }}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => webViewRef.current?.goForward()} disabled={!canGoForward} style={{ padding: 8, opacity: canGoForward ? 1 : 0.5 }}>
          <Text style={{ color: canGoForward ? '#007AFF' : '#999' }}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={{ padding: 8 }}>
          <Text style={{ color: '#007AFF' }}>↻</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{ position: 'absolute', top: 96, left: 0, right: 0, alignItems: 'center', zIndex: 100 }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 8, color: '#666' }}>Loading…</Text>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: targetUrl }}
        style={{ flex: 1 }}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(ns: WebViewNavigation) => { setCanGoBack(ns.canGoBack); setCanGoForward(ns.canGoForward); }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowsBackForwardNavigationGestures
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      />
    </SafeAreaView>
  );
};

function locationHostFromUrl(url: string): string {
  try { return new URL(url).host; } catch { return ''; }
}

export default PlatformWebViewModern;

