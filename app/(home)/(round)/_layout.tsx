import { router, Stack } from "expo-router";
import BannerLogo from "@/assets/branding/BannerLogo.svg";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

const RoundLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitle: () => (
          <Icon id="icon" testID="icon" height={30} width={30} />
        ),
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
          headerTitle: "",
          headerLeft: () => (
            <BannerLogo id="icon" testID="icon" height={30} width={180} />
          ),
          headerRight: () => (
            <MaterialIcons
              name="notifications-none"
              size={28}
              color={colors.primary.default}
              onPress={() => {
                router.push("notifications");
              }}
            />
          ),
        }}
      />
      <Stack.Screen name="details" />
      <Stack.Screen name="requests" options={{ presentation: "modal" }} />
      <Stack.Screen name="notifications" />
    </Stack>
  );
};

export default RoundLayout;
