import { router, Stack } from "expo-router";
import { colors } from "@/constants/Colors";
import { Pressable, Keyboard, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCreateRound } from "@/contexts/CreateRoundContext";

const CreateLayout = () => {
  const { resetForm } = useCreateRound();
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
          headerBackButtonMenuEnabled: true,
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTitleStyle: {
            color: colors.neutral.dark,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                resetForm();
                if (router.canDismiss()) router.dismissAll();
                router.replace("/(round)");
              }}
            >
              <MaterialIcons
                name="close"
                size={28}
                color={colors.neutral.dark}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "New Round",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="preferences"
          options={{
            headerTitle: "New Round",
            presentation: "card",
          }}
        />
      </Stack>
    </Pressable>
  );
};

export default CreateLayout;
