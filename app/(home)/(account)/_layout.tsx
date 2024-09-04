import React from "react";
import { Pressable, Keyboard } from "react-native";
import { router, Stack } from "expo-router";
import { colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons"; // Import Ant Design icons

const AccountLayout = () => {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: colors.neutral.dark,
          contentStyle: {
            backgroundColor: colors.background.primary,
            padding: 20,
          },
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Account",
            headerRight: () => (
              <Pressable
                onPress={() => router.push("settings")} // Add your settings handler here
                style={{ marginRight: 15 }} // Adjust the margin as needed
              >
                <AntDesign
                  name="setting"
                  size={24}
                  color={colors.neutral.dark}
                />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen name="edit" options={{ headerTitle: "Edit profile" }} />
        <Stack.Screen name="settings" options={{ headerTitle: "Settings" }} />
      </Stack>
    </Pressable>
  );
};

export default AccountLayout;
