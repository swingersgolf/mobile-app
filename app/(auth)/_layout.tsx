import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import BackArrow from "@/components/BackArrow";
import Icon from "@/assets/branding/Icon.svg";
import React from "react";

const UnauthorizedLayout = () => {
  return (
    <View id="auth-screen" style={styles.authScreen}>
      <View id="navbar" style={styles.navbar}>
        <BackArrow style={styles.backButton} />
        <View style={styles.iconContainer}>
          <Icon height={50} width={50} />
        </View>
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
  navbar: {
    position: "absolute",
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 0,
  },
  backButton: {
    position: "absolute",
    left: 16,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
