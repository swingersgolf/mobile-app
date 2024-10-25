import { useEffect } from "react";
import { View } from "react-native";
import { Redirect, Tabs, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/constants/Colors";
import Spinner from "@/components/Spinner";
import { MaterialIcons } from "@expo/vector-icons";

const HomeLayout = () => {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) {
      // Navigate to the (round) tab if authenticated
      router.replace("/(round)");
    }
  }, [isLoading, token, router]);

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
        tabBarInactiveTintColor: colors.neutral.dark,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="(round)"
        options={{
          title: "Round",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(create)"
        options={{
          title: "Create",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="add-box" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: "Account",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default HomeLayout;
