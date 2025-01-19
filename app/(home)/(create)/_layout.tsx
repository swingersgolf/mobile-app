import { router, Stack } from "expo-router";
import { colors } from "@/constants/Colors";
import { Pressable, Keyboard, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CreateLayout = () => {
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
            <TouchableOpacity onPress={() => router.replace("/(round)")}>
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
            presentation: "fullScreenModal",
          }}
        />
      </Stack>
    </Pressable>
  );
};

export default CreateLayout;
