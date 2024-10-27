import { useNotification } from "@/contexts/NotificationContext";
import { View, Text } from "react-native";

const Notifications = () => {
  const { expoPushToken } = useNotification();
  return (
    <View style={{ flex: 1 }}>
      <Text>Notifications</Text>
      <Text>Expo Push Token: {expoPushToken}</Text>
    </View>
  );
};

export default Notifications;
