import React from "react";
import { Pressable, Keyboard } from "react-native";
import AuthHeader from "@/components/AuthHeader";
import { colors } from "@/constants/Colors";
import { Stack } from "expo-router";

const UnauthorizedLayout = () => {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: {
            padding: 20,
            backgroundColor: colors.background.primary,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          },
          header: () => AuthHeader(),
        }}
      >
        <Stack.Screen
          name="landing"
          options={{ headerShown: false, contentStyle: { padding: 0 } }}
        />
        <Stack.Screen name="login" options={{}} />
        <Stack.Screen name="register" options={{}} />
      </Stack>
    </Pressable>
  );
};

export default UnauthorizedLayout;
