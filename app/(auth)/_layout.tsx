import { Pressable, Keyboard } from "react-native";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { RouteProp } from "@react-navigation/native";

type ScreenParams = {
  landing: undefined;
  login: undefined;
  register: undefined;
};

const UnauthorizedLayout = () => {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Stack
        screenOptions={({
          route,
        }: {
          route: RouteProp<ScreenParams, keyof ScreenParams>;
        }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: colors.neutral.dark,
          headerTitle: () => (
            <Icon id="icon" testID="icon" height={30} width={30} />
          ),
          contentStyle:
            route.name === "landing"
              ? undefined
              : {
                  backgroundColor: colors.background.primary,
                  padding: 20,
                },
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
        })}
      >
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{}} />
        <Stack.Screen name="register" options={{}} />
      </Stack>
    </Pressable>
  );
};

export default UnauthorizedLayout;
