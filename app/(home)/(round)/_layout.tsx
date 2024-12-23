import { router, Stack } from "expo-router";
import BannerLogo from "@/assets/branding/BannerLogo.svg";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 15,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  router.push("notifications");
                }}
              >
                <MaterialIcons
                  name="notifications-none"
                  size={30}
                  color={colors.neutral.dark}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push("messages");
                }}
              >
                <MaterialCommunityIcons
                  name="chat-outline"
                  size={30}
                  color={colors.neutral.dark}
                />
              </TouchableOpacity>
            </View>
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
      <Stack.Screen name="public-account" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="messages-chat" />
    </Stack>
  );
};

export default RoundLayout;
