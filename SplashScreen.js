import { useFonts } from "expo-font";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const [fontsLoaded] = useFonts({
    "4454-font": require("./assets/fonts/4454-font.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("./assets/images/splash.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.text}>Generation Making</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.20)",
  },
  text: {
    color: "#fff",
    fontSize: 36,
    fontFamily: "4454-font",
    textAlign: "center",
    letterSpacing: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
});
