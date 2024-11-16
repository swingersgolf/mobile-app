import { router, Stack } from "expo-router";
import BannerLogo from "@/assets/branding/BannerLogo.svg";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const RoundLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: "minimal",
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
            <TouchableOpacity
              onPress={() => {
                router.push("notifications");
              }}
            >
              <MaterialIcons
                name="notifications-none"
                size={28}
                color={colors.neutral.dark}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="details" />
      <Stack.Screen
        name="requests"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen name="notifications" />
      <Stack.Screen
        name="edit"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default RoundLayout;
