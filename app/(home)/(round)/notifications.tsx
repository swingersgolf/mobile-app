import { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { useNotificationCache } from "@/contexts/NotificationCacheContext";
import { Notification } from "@/types/notificationTypes";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@/constants/Colors";
import GlobalStyles from "@/styles/GlobalStyles";
import { RoundStyles } from "@/styles/roundStyles";
import { getTimeElapsed } from "@/utils/date";

type Section = {
  title: string;
  data: Notification[];
};

const Notifications = () => {
  const { notificationCache, fetchUserNotifications, markAsRead } =
    useNotificationCache();

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserNotifications();
    }, [fetchUserNotifications]),
  );

  const notificationsArray = useMemo(
    () =>
      Array.from(notificationCache.values()).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [notificationCache],
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
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserNotifications();
    setRefreshing(false);
  };

  const renderNotification: ListRenderItem<Notification> = ({ item }) => {
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
        <Text>
          <Text style={{ fontWeight: "500" }}>{item.data.title}&nbsp;</Text>
          {item.data.body}&nbsp;
          <Text style={{ color: colors.neutral.medium }}>
            {getTimeElapsed(createdAt)}
          </Text>
        </Text>
      </TouchableOpacity>
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
    <View style={{ flex: 1 }}>
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
    </View>
  );
};

export default Notifications;
