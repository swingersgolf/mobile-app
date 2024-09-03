import { Pressable, Keyboard } from "react-native";
import { Stack } from "expo-router";

const AccountLayout = () => {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="edit" options={{ title: "Edit Account" }} />
      </Stack>
    </Pressable>
  );
};

export default AccountLayout;
