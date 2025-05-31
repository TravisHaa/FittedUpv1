import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { images } from "@constants/images";
import SearchBar from "../../components/SearchBar";
import { useRouter } from "expo-router";

export default function marketPlace() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      {/* z allows us to put elements in front of bg image */}
      <Image source={images.meshgrad} className="absolute w-full z-0" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <Image
          source={images.translogo}
          className="w-20 h-20 mt-20 mb-0 mx-auto"
        />
        <View className="mt-0 flex-1">
          <SearchBar 
            onPress={() => router.push("/search")}
            placeholder="Search for a clothing item"
          />
          <Text>hello</Text>
        </View>
      </ScrollView>
    </View>
  );
}
