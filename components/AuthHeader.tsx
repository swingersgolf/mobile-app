import { StyleSheet } from "react-native";
import BackButton from "@/components/BackButton";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthHeader = () => {
  return (
    <SafeAreaView
      id="auth-header"
      testID="auth-header"
      style={styles.authHeader}
    >
      <BackButton style={styles.backArrow} color={colors.neutral.dark} />
      <Icon
        id="icon"
        testID="icon"
        style={styles.icon}
        height={50}
        width={50}
      />
    </SafeAreaView>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  authHeader: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.primary,
  },
  backArrow: {
    position: "absolute",
    left: 20,
  },
  icon: {},
});
