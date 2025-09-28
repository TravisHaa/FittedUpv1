import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import GlassView from "./GlassView";

interface Props {
  placeholder: string;
  onPress?: () => void; //optional and is a function
}

const SearchBar = ({ placeholder, onPress }: Props) => {
  return (
    <GlassView style={styles.wrapper}>
      <View style={styles.row}>
        <Ionicons name="search-outline" size={20} color="#e5e7eb" />
        <TextInput
          onPress={onPress}
          placeholder={placeholder}
          value=""
          onChangeText={() => {}}
          style={styles.input}
          placeholderTextColor="#e5e7eb"
        />
      </View>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 9999,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: '#fff',
  },
});

export default SearchBar;
