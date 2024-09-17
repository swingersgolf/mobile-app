import { Pressable, Keyboard } from "react-native";
import { Stack, router } from "expo-router";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons"; // Import vector icons

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
          headerTitle: () => (
            <Icon id="icon" testID="icon" height={30} width={30} />
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            // Adding the gear icon to the top right
            headerRight: () => (
              <Pressable
                onPress={() => {
                  // Handle gear icon press, e.g., navigate to settings
                  router.push("/settings");
                }}
              >
                <Feather
                  name="settings" // Gear icon name from MaterialIcons
                  size={24}
                  color={colors.neutral.dark}
                />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen name="edit" options={{ presentation: "modal" }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="reset" options={{ presentation: "modal" }} />
      </Stack>
    </Pressable>
  );
};

export default AccountLayout;
