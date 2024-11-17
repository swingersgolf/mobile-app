import { Pressable, Keyboard, TouchableOpacity, Text } from "react-native";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import { router, Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
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
        <Stack.Screen
          name="landing"
          options={{ headerShown: false, contentStyle: undefined }}
        />
        <Stack.Screen name="login" options={{}} />
        <Stack.Screen name="register" options={{}} />
        <Stack.Screen
          name="set-profile"
          options={{
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => router.push("set-preferences")}
                >
                  <Text
                    style={{
                      color: colors.neutral.medium,
                    }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              );
            },
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="set-preferences"
          options={{ presentation: "card" }}
        />
        <Stack.Screen name="verify" options={{ presentation: "card" }} />
        <Stack.Screen name="forgot" options={{ presentation: "modal" }} />
        <Stack.Screen name="reset" options={{ presentation: "modal" }} />
      </Stack>
    </Pressable>
  );
};

export default AuthLayout;
