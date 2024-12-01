import { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  SectionListRenderItem,
  SectionListData,
} from "react-native";
import { Notification } from "@/types/notificationTypes";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@/constants/Colors";
import GlobalStyles from "@/styles/GlobalStyles";
import { RoundStyles } from "@/styles/roundStyles";
import { getTimeElapsed } from "@/utils/date";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

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

  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const sections: Section[] = [
      { title: "Today", data: [] },
      { title: "Last 7 Days", data: [] },
      { title: "Last 30 Days", data: [] },
      { title: "Older", data: [] },
    ];

    notifications.forEach((notification) => {
      const createdAt = new Date(notification.created_at);
      const diffDays = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) sections[0].data.push(notification);
      else if (diffDays <= 7) sections[1].data.push(notification);
      else if (diffDays <= 30) sections[2].data.push(notification);
      else sections[3].data.push(notification);
    });

    return sections.filter((section) => section.data.length > 0);
  }, [notifications]);

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

  const renderNotification: SectionListRenderItem<Notification> = ({
    item,
  }) => {
    const createdAt = new Date(item.created_at);
    const isUnread = !item.read_at;
    return (
      <TouchableOpacity
        onPress={() => handleReadNotification(item)}
        style={RoundStyles.notificationItemContainer}
      >
        {isUnread && (
          <View style={{ position: "absolute", left: 5 }}>
            <View style={RoundStyles.unreadDot} />
          </View>
        )}
        <Text style={{ fontWeight: "500", flexGrow: 1 }}>
          {item.data.title}&nbsp;
          {item.data.body}&nbsp;
          <Text style={{ color: colors.neutral.medium }}>
            {getTimeElapsed(createdAt)}
          </Text>
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<Notification>;
  }) => (
    <View style={RoundStyles.notificationHeaderContainer}>
      <Text style={[GlobalStyles.h3, { width: "100%" }]}>{section.title}</Text>
    </View>
  );

  return (
    <SectionList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary.default]}
        />
      }
      style={RoundStyles.notificationList}
      contentContainerStyle={RoundStyles.notificationListContent}
      sections={groupedNotifications}
      keyExtractor={(item) => item.id}
      renderItem={renderNotification}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

export default Notifications;
