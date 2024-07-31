import { router } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useSession } from "../../contexts/AuthContext";
import React from "react";

const Login = () => {
  const { signIn } = useSession();
  return (
    <View id="login" style={styles.container}>
      <Text
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace("/");
        }}
      >
        Sign In
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
