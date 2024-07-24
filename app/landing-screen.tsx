import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import NavButton from "@/components/NavButton";
import BannerLogo from "@/assets/branding/BannerLogo.svg";

const LandingScreen = () => {
  const router = useRouter();

  const handleNavigateToSignIn = () => {
    router.push("/sign-in");
  };

  const handleNavigateToCreateAccount = () => {
    router.push("/create-account");
  };

  return (
    <View style={styles.container}>
      <BannerLogo width={300} height={75} />
      <View style={styles.buttonsContainer}>
        <NavButton text="Sign In" onPress={handleNavigateToSignIn} />
        <NavButton
          text="Create Account"
          onPress={handleNavigateToCreateAccount}
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
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    gap: 6,
    paddingHorizontal: 12,
  },
});
