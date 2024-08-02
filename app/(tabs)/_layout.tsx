import { Text } from "react-native";
import { Redirect, Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSession } from "@/contexts/AuthContext";
import { colors } from "@/constants/Colors";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group"s layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/landing" />;
  }

  // This layout can be deferred because it"s not the root layout.
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.lightGreen,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: () => null, // Hide the label
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: () => null, // Hide the label
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
