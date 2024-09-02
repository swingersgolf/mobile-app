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
            backgroundColor: colors.background.primary,
          },
          header: () => AuthHeader(),
        }}
      >
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{}} />
        <Stack.Screen name="register" options={{}} />
      </Stack>
    </Pressable>
  );
};

export default UnauthorizedLayout;
