import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { openInAppBrowser } from "../utils/inAppBrowser";

const PlatformBrowser = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const url = (params.url as string) || "https://www.depop.com/sell";

  useEffect(() => {
    openInAppBrowser({ url }).finally(() => {
      // Close our screen after browser is dismissed
      try { router.back(); } catch (_) {}
    });
  }, [url]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
          <Text style={{ color: "#6366F1", fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>Opening Browser…</Text>
        <View style={{ width: 48 }} />
      </View>
      <View style={{ padding: 16 }}>
        <Text>Launching in-app browser for: {url}</Text>
      </View>
    </SafeAreaView>
  );
};

export default PlatformBrowser;

