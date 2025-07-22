import { Stack } from "expo-router";
import './globals.css';
import platformWebView from "./platformWebView";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
    name="(tabs)"
    options={{headerShown: false}}
    />
    <Stack.Screen
    name="platformWebView"
    options={{headerShown: true, title: 'Depop'}}
    />
    <Stack.Screen
    name="/item/[id]"
    options={{headerShown: false}}
    />

  </Stack>
}
