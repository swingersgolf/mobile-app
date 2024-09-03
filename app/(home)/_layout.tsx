import { Keyboard, Pressable } from "react-native";
import { Redirect, Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/constants/Colors";
import Spinner from "@/components/Spinner";

const HomeLayout = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!token) {
    return <Redirect href="/landing" />;
  }

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary.default,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabel: () => null,
            tabBarIcon: ({ color }: { color: string }) => (
              <AntDesign name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(account)"
          options={{
            title: "Account",
            tabBarLabel: () => null,
            tabBarIcon: ({ color }: { color: string }) => (
              <AntDesign name="user" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </Pressable>
  );
};

export default HomeLayout;
