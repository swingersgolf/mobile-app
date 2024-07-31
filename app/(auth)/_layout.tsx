import { Slot, useRouter } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackArrow from "@/components/BackArrow";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import React from "react";
import WhiteIcon from "@/assets/branding/WhiteIcon.svg";
import { SafeAreaView } from "react-native-safe-area-context";

const UnauthorizedLayout = () => {
  const router = useRouter();
  return (
    <SafeAreaView id="auth-screen" style={styles.authScreen}>
      <BackArrow style={styles.backArrow} onPress={() => router.replace("/")} />
      <WhiteIcon style={styles.icon} height={100} width={100} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.contentContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Slot />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UnauthorizedLayout;

const styles = StyleSheet.create({
  authScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGreen,
  },
  contentContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    backgroundColor: "white",
  },
  backArrow: {
    position: "absolute",
    top: 75,
    left: 25,
  },
  icon: {
    position: "absolute",
    top: 100,
  },
});
