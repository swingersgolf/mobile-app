import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import BackArrow from "@/components/BackArrow";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthHeader = () => {
  return (
    <SafeAreaView id="navbar" style={styles.navbar}>
      <BackArrow style={styles.backArrow} />
      <Icon style={styles.icon} height={50} width={50} />
    </SafeAreaView>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  backArrow: {
    position: "absolute",
    left: 20,
  },
  icon: {},
});
