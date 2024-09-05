import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import TextButton from "@/components/TextButton";
import BannerLogoLight from "@/assets/branding/BannerLogoLight.svg";
import { colors } from "@/constants/Colors";

const Landing = () => {
  const router = useRouter();

  return (
    <View style={styles.landing}>
      <BannerLogoLight width={300} height={75} />
      <View style={styles.buttonsContainer}>
        <TextButton
          text="Sign In"
          onPress={() => router.push("/login")}
          backgroundColor={colors.background.primary}
          textColor={colors.primary.default}
        />
        <TextButton
          text="Create Account"
          onPress={() => router.push("/register")}
          outline
          backgroundColor={colors.primary.default}
          textColor={colors.neutral.light}
        />
      </View>
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  landing: {
    flex: 1,
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary.default,
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
