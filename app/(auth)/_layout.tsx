import AuthHeader from "@/components/AuthHeader";
import { colors } from "@/constants/Colors";
import { Stack } from "expo-router";

const UnauthorizedLayout = () => {
  return (
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
  );
};

export default UnauthorizedLayout;
