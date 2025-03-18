import { Text, View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Italic-VariableFont_wght.ttf"),
    futura: require("../assets/fonts/futur.ttf"),
    "futura-bold": require("../assets/fonts/futurabold.ttf"),
    "future-italic-bold": require("../assets/fonts/futuraitalbold.ttf"),
    raleway: require("../assets/fonts/Raleway-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView>
      <Text style={styles.text}>Welcome to FittedUp</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 20,
    alignItems: "center",
    fontWeight: "bold",
    fontFamily: "Montserrat",
    color: "black",
  },
});
