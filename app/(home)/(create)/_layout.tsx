import { Stack } from "expo-router";
import { colors } from "@/constants/Colors";
import { Pressable, Keyboard } from "react-native";

const CreateLayout = () => {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
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
            headerTitle: "New Round",
          }}
        />
      </Stack>
    </Pressable>
  );
};

export default CreateLayout;
