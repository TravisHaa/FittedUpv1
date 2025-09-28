import { Alert, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export type OpenInAppOptions = {
  url: string;
  headers?: Record<string, string>;
};

export async function openInAppBrowser({ url, headers }: OpenInAppOptions): Promise<void> {
  try {
    const available = await InAppBrowser.isAvailable();
    if (available) {
      await InAppBrowser.open(url, {
        // iOS
        dismissButtonStyle: 'close',
        preferredBarTintColor: '#111827',
        preferredControlTintColor: '#FFFFFF',
        readerMode: false,
        // Android
        showTitle: true,
        toolbarColor: '#111827',
        secondaryToolbarColor: '#6B7280',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
        headers: headers || {},
      } as any);
    } else {
      await Linking.openURL(url);
    }
  } catch (error: any) {
    Alert.alert('Browser Error', error?.message || 'Failed to open browser');
  }
}

