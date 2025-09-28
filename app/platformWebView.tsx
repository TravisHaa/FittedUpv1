import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import WebViewManager from "../webview/WebViewManager";

const PlatformWebView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const listingData = params.listingData
    ? JSON.parse(params.listingData as string)
    : null;
  const platform = (params.platform as string) || "depop";
  const customUrl = params.url as string | undefined;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: "#F9FAFB",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 10 }}>
          <Text style={{ color: "#6366F1", fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "bold", textAlign: "center", textTransform: "capitalize" }}>
          {platform}
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <WebViewManager
        platform={platform as any}
        listingData={listingData}
        url={customUrl}
      />
    </SafeAreaView>
  );
};

export default PlatformWebView;
