import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNotificationCache } from "@/contexts/NotificationCacheContext"; // Adjust the path as needed
import { Notification } from "@/types/notificationTypes";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@/constants/Colors";

const Notifications = () => {
  const {
    notificationCache,
    fetchUserNotifications,
    markAsRead,
    markAsUnread,
  } = useNotificationCache();

  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  useFocusEffect(
    useCallback(() => {
      fetchUserNotifications();
    }, [fetchUserNotifications]),
  );

  // Convert cache to sorted array by date
  const notificationsArray = Array.from(notificationCache.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleToggleReadStatus = (notification: Notification) => {
    if (notification.readAt) {
      markAsUnread(notification.id);
    } else {
      markAsRead(notification.id);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserNotifications();
    setRefreshing(false);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handleToggleReadStatus(item)}>
      <Text>{item.type}</Text>
      <Text>{JSON.stringify(item.data)}</Text>
      <Text>
        {new Date(item.createdAt).toLocaleDateString()}{" "}
        {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]}
          />
        }
        data={notificationsArray}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
      />
    </View>
  );
};

export default Notifications;
