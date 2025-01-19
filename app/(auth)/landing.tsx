import { View, StyleSheet, Appearance } from "react-native";
import { useRouter } from "expo-router";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import BannerLogo from "@/components/BannerLogo";

const LandingScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.landing}>
      <BannerLogo width={300} height={75} />
      <View style={styles.buttonsContainer}>
        <TextButton
          text="Sign In"
          onPress={() => router.push("/login")}
          backgroundColor={colors.button.primary.background}
          textColor={colors.button.primary.text}
        />
        <TextButton
          text="Create Account"
          onPress={() => router.push("/register")}
          outline
          backgroundColor={colors.button.secondary.background}
          textColor={colors.button.secondary.text}
        />
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  landing: {
    flex: 1,
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      Appearance.getColorScheme() === "dark"
        ? colors.primary.default
        : colors.background.primary,
  },
  buttonsContainer: {
    padding: 20,
    paddingBottom: 40,
    position: "absolute",
    bottom: 0,
    width: "100%",
    gap: 6,
  },
});
