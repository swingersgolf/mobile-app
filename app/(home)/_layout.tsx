import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/constants/Colors";
import Spinner from "@/components/Spinner";
import { Feather } from "@expo/vector-icons";
import Icon from "@/assets/branding/Icon.svg";

const HomeLayout = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/landing" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.default,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }: { color: string }) => (
            <Feather name="home" size={24} color={color} />
          ),
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: colors.neutral.dark,
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTitle: () => (
            <Icon id="icon" testID="icon" height={30} width={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: "Account",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }: { color: string }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default HomeLayout;
