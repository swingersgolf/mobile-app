import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/TextButton";
import BannerLogo from "@/assets/branding/BannerLogo.svg";

const LandingScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BannerLogo width={300} height={75} />
      <View style={styles.buttonsContainer}>
        <Button text="Sign In" onPress={() => router.push("/login")} />
        <Button
          text="Create Account"
          onPress={() => router.push("/register")}
          outline
        />
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    gap: 6,
    paddingHorizontal: 12,
  },
});
