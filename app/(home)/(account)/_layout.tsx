import { TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons"; // Import vector icons
import Icon from "@/components/Icon";

const AccountLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: colors.neutral.dark,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTitle: () => <Icon height={30} width={30} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
          // Adding the gear icon to the top right
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // Handle gear icon press, e.g., navigate to settings
                router.push("/settings");
              }}
            >
              <MaterialIcons
                name="settings" // Gear icon name from MaterialIcons
                size={28}
                color={colors.neutral.dark}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="edit-profile" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="edit-preferences"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="settings" />
      <Stack.Screen name="reset" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default AccountLayout;
