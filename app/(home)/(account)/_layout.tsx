import { Pressable, Keyboard } from "react-native";
import { Stack } from "expo-router";
import { colors } from "@/constants/Colors";
import Icon from "@/assets/branding/Icon.svg";

const AccountLayout = () => {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: colors.neutral.dark,
          headerTitle: () => (
            <Icon id="icon" testID="icon" height={30} width={30} />
          ),
          contentStyle: {
            backgroundColor: colors.background.primary,
            padding: 20,
          },
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="edit" />
      </Stack>
    </Pressable>
  );
};

export default AccountLayout;
