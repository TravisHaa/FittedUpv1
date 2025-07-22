import WebView from "react-native-webview"

const DEPOP_SELL_URL = 'https://www.depop.com/sell'

async function syncDepopCookies (token:string) {
    await CookieManager.set(DEPOP_BASE, {
      name: 'sessionId',
      value: token,
      path: '/',
      version: '1',
      secure: true,
      httpOnly: true,
    })
  }

const platformWebView = () => {
    return <WebView source={{ uri: DEPOP_SELL_URL }} />
}

export default platformWebView