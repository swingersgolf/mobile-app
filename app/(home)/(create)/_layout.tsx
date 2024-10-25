import { Stack } from "expo-router";
import { colors } from "@/constants/Colors";

const CreateLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerBackButtonMenuEnabled: true,
        headerTintColor: colors.neutral.dark,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "New post",
        }}
      />
    </Stack>
  );
};

export default CreateLayout;
