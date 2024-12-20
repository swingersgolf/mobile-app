import { Stack } from "expo-router";

const MessagesLayout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        headerTitle: "Messages",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Messages",
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerTitle: "Chat",
        }}
      />
    </Stack>
  );
};

export default MessagesLayout;
