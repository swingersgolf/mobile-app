import { Slot, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import BackArrow from "@/components/BackArrow";
import Icon from "@/assets/branding/Icon.svg";
import React from "react";

const UnauthorizedLayout = () => {
  const router = useRouter();
  return (
    <View id="auth-screen" style={styles.authScreen}>
      <View style={styles.backArrowContainer}>
        <BackArrow
          style={styles.backButton}
          onPress={() => router.replace("/")}
        />
      </View>
      <View style={styles.iconContainer}>
        <Icon height={100} width={100} />
      </View>
      <View id="content-container" style={styles.contentContainer}>
        <Slot />
      </View>
    </View>
  );
};

export default UnauthorizedLayout;

const styles = StyleSheet.create({
  authScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
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
  backArrowContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  backButton: {
    position: "absolute",
    left: 16,
  },
  iconContainer: {
    position: "absolute",
    top: 100,
  },
});
