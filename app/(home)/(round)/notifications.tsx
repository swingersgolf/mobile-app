import { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ListRenderItem,
  Animated,
  StyleSheet,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { Notification } from "@/types/notificationTypes";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@/constants/Colors";
import GlobalStyles from "@/styles/GlobalStyles";
import { RoundStyles } from "@/styles/roundStyles";
import { getTimeElapsed } from "@/utils/date";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { set } from "react-hook-form";

type Section = {
  title: string;
  data: Notification[];
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchUserNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/notification/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
    }
  }, [apiUrl, token]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await axios.patch(
          `${apiUrl}/v1/notification/${notificationId}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.error(
          `Error marking notification ${notificationId} as read:`,
          error,
        );
      }
    },
    [apiUrl, token],
  );

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await axios.delete(`${apiUrl}/v1/notification/${notificationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.id !== notificationId,
          ),
        );
      } catch (error) {
        console.error(`Error deleting notification ${notificationId}:`, error);
      }
    },
    [apiUrl, token],
  );

  const notificationsArray = useMemo(
    () =>
      Array.from(notifications.values()).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [notifications],
  );

  const groupNotificationsByDate = (): Section[] => {
    const now = new Date();
    const today: Notification[] = [];
    const last7Days: Notification[] = [];
    const last30Days: Notification[] = [];
    const older: Notification[] = [];

    notificationsArray.forEach((notification) => {
      const createdAt = new Date(notification.created_at);
      const diffDays = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) {
        today.push(notification);
      } else if (diffDays <= 7) {
        last7Days.push(notification);
      } else if (diffDays <= 30) {
        last30Days.push(notification);
      } else {
        older.push(notification);
      }
    });

    return [
      { title: "Today", data: today },
      { title: "Last 7 Days", data: last7Days },
      { title: "Last 30 Days", data: last30Days },
      { title: "Older", data: older },
    ].filter((section) => section.data.length > 0);
  };

  const groupedNotifications = useMemo(groupNotificationsByDate, [
    notificationsArray,
  ]);

  const handleReadNotification = (notification: Notification) => {
    if (!notification.read_at) markAsRead(notification.id);
    router.push({
      pathname: notification.data.data.route,
      params: notification.data.data.params,
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserNotifications();
    }, [fetchUserNotifications]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserNotifications();
    setRefreshing(false);
  };

  // Swipeable delete button functionality
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation,
    notification: Notification,
  ) => {
    // Animate the delete button sliding in from the right
    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.swipedRow}>
        <Animated.View
          style={[
            styles.deleteButton,
            { transform: [{ translateX }], opacity }, // Applying translation and opacity for smooth transition
          ]}
        >
          <TouchableOpacity onPress={() => deleteNotification(notification.id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderNotification: ListRenderItem<Notification> = ({ item }) => {
    const createdAt = new Date(item.created_at);
    const isUnread = !item.read_at;
    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <TouchableOpacity
          onPress={() => handleReadNotification(item)}
          style={RoundStyles.notificationItemContainer}
        >
          {isUnread && (
            <View style={{ position: "absolute", left: 5 }}>
              <View style={RoundStyles.unreadDot} />
            </View>
          )}
          <Text>
            <Text style={{ fontWeight: "500" }}>{item.data.title}&nbsp;</Text>
            {item.data.body}&nbsp;
            <Text style={{ color: colors.neutral.medium }}>
              {getTimeElapsed(createdAt)}
            </Text>
          </Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: Section;
  }) => (
    <View style={RoundStyles.notificationHeaderContainer}>
      <Text style={GlobalStyles.h3}>{title}</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]}
          />
        }
        data={groupedNotifications}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => (
          <FlatList
            data={item.data}
            keyExtractor={(notification) => notification.id}
            renderItem={renderNotification}
            ListHeaderComponent={renderSectionHeader({ section: item })}
          />
        )}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  swipedRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end", // Align delete button to the right
    paddingRight: 10, // Padding to give space from the edge
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    justifyContent: "center",
    height: "100%",
    width: 100,
    alignItems: "center",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    padding: 10,
  },
});

export default Notifications;
