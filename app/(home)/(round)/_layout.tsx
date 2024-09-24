import { Stack } from "expo-router";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";

const RoundLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: colors.neutral.dark,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTitle: () => (
          <Icon id="icon" testID="icon" height={30} width={30} />
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="round-details" />
    </Stack>
  );
};

export default RoundLayout;
