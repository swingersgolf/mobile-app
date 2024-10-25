import { Stack } from "expo-router";
import BannerLogo from "@/assets/branding/BannerLogo.svg";
import Icon from "@/assets/branding/Icon.svg";
import { colors } from "@/constants/Colors";

const RoundLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitle: () => "",
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
          headerLeft: () => (
            <BannerLogo id="icon" testID="icon" height={30} width={180} />
          ),
          // headerRight: () => (
          //   <View
          //     style={{
          //       display: "flex",
          //       flexDirection: "row",
          //       alignItems: "center",
          //       columnGap: 20,
          //     }}
          //   >
          //     <MaterialIcons
          //       name="notifications"
          //       size={28}
          //       color={colors.primary.default}
          //     />
          //     <MaterialIcons
          //       name="message"
          //       size={28}
          //       color={colors.primary.default}
          //     />
          //   </View>
          // ),
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerTitle: () => (
            <Icon id="icon" testID="icon" height={30} width={30} />
          ),
        }}
      />
    </Stack>
  );
};

export default RoundLayout;
