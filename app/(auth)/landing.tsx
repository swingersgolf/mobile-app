import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import TextButton from "@/components/TextButton";
import BannerLogoWhite from "@/assets/branding/BannerLogoWhite.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/Colors";

const Landing = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.landing}>
      <BannerLogoWhite width={300} height={75} />
      <View style={styles.buttonsContainer}>
        <TextButton
          text="Sign In"
          onPress={() => router.push("/login")}
          backgroundColor={colors.white}
          textColor={colors.lightGreen}
        />
        <TextButton
          text="Create Account"
          onPress={() => router.push("/register")}
          outline
          backgroundColor={colors.white}
          textColor={colors.white}
        />
      </View>
    </SafeAreaView>
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
    backgroundColor: colors.lightGreen,
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
