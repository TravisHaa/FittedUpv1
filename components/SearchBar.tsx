import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  placeholder: string;
  onPress?: () => void; //optional and is a function
}

const SearchBar = ({ placeholder, onPress }: Props) => {
  return (
    <View
      style={styles.container}
      className="flex-row items-center bg-white rounded-full px-5 py-4 border-black border-b-10"
    >
      <Ionicons name="search-outline" />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value=""
        onChangeText={() => {}}
        className="flex-1 ml-3 text-black"
        placeholderTextColor="#000000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    opacity: 0.6, // This sets the opacity to 30%
  },
});

export default SearchBar;
