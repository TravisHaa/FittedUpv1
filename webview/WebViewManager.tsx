import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { getInjectedScript } from './scripts/injection';
import { JavaScriptInjectionEngine } from './engine/JavaScriptInjectionEngine';
import type { ListingData, PlatformId, ProgressUpdate } from '../types/types';
import { DepopAdapter } from './platforms/DepopAdapter';

type Props = {
  platform: PlatformId;
  listingData: ListingData | null;
  url?: string;
  onSuccess?: (resultUrl?: string) => void;
  onError?: (message: string) => void;
  onProgress?: (p: ProgressUpdate) => void;
};

export function WebViewManager({ platform, listingData, url, onSuccess, onError, onProgress }: Props) {
  const webViewRef = useRef(null as any);
  const engine = useMemo(function() { return new JavaScriptInjectionEngine(webViewRef); }, []);
  const [loading, setLoading] = useState(true);

  const adapter = useMemo(() => {
    switch (platform) {
      case 'depop':
      default:
        return new DepopAdapter();
    }
  }, [platform]);

  const sourceUrl = url || adapter.baseUrl;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'SCRIPT_LOADED':
          if (listingData) {
            onProgress?.({ platform, stage: 'filling_form', percent: 15 });
            // Prefer postMessage channel
            engine.post('FILL_FORM', { formData: listingData });
            if (listingData.images?.length) {
              onProgress?.({ platform, stage: 'uploading_images', percent: 35 });
              engine.post('UPLOAD_IMAGES', { images: listingData.images });
            }
          }
          break;
        case 'FORM_FILLED':
          if (!data.success) onError?.(data.error || 'Failed to fill form');
          else onProgress?.({ platform, stage: 'filling_form', percent: 50 });
          break;
        case 'IMAGES_UPLOADED':
          if (!data.success) onError?.(data.error || 'Failed to upload images');
          else onProgress?.({ platform, stage: 'uploading_images', percent: 75 });
          break;
        case 'FORM_SUBMITTED':
          if (!data.success) onError?.(data.error || 'Failed to submit form');
          else {
            onProgress?.({ platform, stage: 'completed', percent: 100 });
            onSuccess?.();
          }
          break;
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (!loading && listingData) {
      // Optionally auto-submit after a delay
      // engine.post('SUBMIT_FORM');
    }
  }, [loading, listingData]);

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={{ position: 'absolute', top: 100, left: 0, right: 0, alignItems: 'center', zIndex: 1000 }}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: sourceUrl }}
        style={{ flex: 1 }}
        injectedJavaScript={getInjectedScript()}
        onMessage={handleMessage}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    </View>
  );
}

export default WebViewManager;

