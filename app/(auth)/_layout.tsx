import { Slot, useRouter } from "expo-router";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackArrow from "@/components/BackArrow";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const UnauthorizedLayout = () => {
  const router = useRouter();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView id="auth-screen" style={styles.authScreen}>
        <View id="navbar" style={styles.navbar}>
          <BackArrow
            style={styles.backArrow}
            onPress={() => router.replace("/")}
          />
          <Icon style={styles.icon} height={50} width={50} />
        </View>
        <Slot />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default UnauthorizedLayout;

const styles = StyleSheet.create({
  authScreen: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.white,
    gap: 40,
  },
  navbar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    position: "absolute",
    left: 0,
  },
  icon: {},
});
