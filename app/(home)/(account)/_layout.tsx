import { Pressable, Keyboard } from "react-native";
import { Stack } from "expo-router";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";

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
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => (
              <Icon id="icon" testID="icon" height={30} width={30} />
            ),
          }}
        />
        <Stack.Screen
          name="edit"
          options={{ presentation: "modal", headerTitle: "Edit profile" }}
        />
      </Stack>
    </Pressable>
  );
};

export default AccountLayout;
