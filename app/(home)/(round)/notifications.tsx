import { useNotification } from "@/contexts/NotificationContext";
import { Subscription } from "expo-notifications";
import { useState, useRef, useEffect } from "react";
import { View, Text } from "react-native";

const Notifications = () => {
  const { expoPushToken, sendPushNotification } = useNotification();
  const [notification, setNotification] = useState<Notification>();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    sendPushNotification(expoPushToken);
  }, [expoPushToken, sendPushNotification]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Notifications</Text>
    </View>
  );
};

export default Notifications;
