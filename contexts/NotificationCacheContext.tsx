import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useCallback,
} from "react";
import { Notification } from "@/types/notificationTypes";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationCacheContextType {
  notificationCache: Map<string, Notification>;
  setNotificationCache: Dispatch<SetStateAction<Map<string, Notification>>>;
  clearCache: () => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshCache: (fetchedNotifications: Notification[]) => void;
  fetchUserNotifications: () => Promise<void>;
}

const NotificationCacheContext = createContext<
  NotificationCacheContextType | undefined
>(undefined);

export const NotificationCacheProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notificationCache, setNotificationCache] = useState<
    Map<string, Notification>
  >(new Map());
  const { token } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const clearCache = useCallback(() => {
    setNotificationCache(new Map());
  }, []);

  const refreshCache = useCallback((fetchedNotifications: Notification[]) => {
    setNotificationCache((prevCache) => {
      const updatedCache = new Map(prevCache);
      fetchedNotifications.forEach((notification) => {
        updatedCache.set(notification.id.toString(), notification);
      });
      return updatedCache;
    });
  }, []);

  const fetchUserNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/notification/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshCache(response.data.data);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
    }
  }, [apiUrl, token, refreshCache]);

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
        setNotificationCache((prevCache) => {
          const updatedCache = new Map(prevCache);
          const notification = updatedCache.get(notificationId);
          if (notification) {
            notification.read_at = new Date();
            updatedCache.set(notificationId, notification);
          }
          return updatedCache;
        });
      } catch (error) {
        console.error(
          `Error marking notification ${notificationId} as read:`,
          error,
        );
      }
    },
    [apiUrl, token],
  );

  const markAsUnread = useCallback(
    async (notificationId: string) => {
      try {
        await axios.patch(
          `${apiUrl}/v1/notification/${notificationId}/unread`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setNotificationCache((prevCache) => {
          const updatedCache = new Map(prevCache);
          const notification = updatedCache.get(notificationId);
          if (notification) {
            notification.read_at = null;
            updatedCache.set(notificationId, notification);
          }
          return updatedCache;
        });
      } catch (error) {
        console.error(
          `Error marking notification ${notificationId} as unread:`,
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
        setNotificationCache((prevCache) => {
          const updatedCache = new Map(prevCache);
          updatedCache.delete(notificationId);
          return updatedCache;
        });
      } catch (error) {
        console.error(`Error deleting notification ${notificationId}:`, error);
      }
    },
    [apiUrl, token],
  );

  return (
    <NotificationCacheContext.Provider
      value={{
        notificationCache,
        setNotificationCache,
        clearCache,
        markAsRead,
        markAsUnread,
        deleteNotification,
        refreshCache,
        fetchUserNotifications,
      }}
    >
      {children}
    </NotificationCacheContext.Provider>
  );
};

export const useNotificationCache = (): NotificationCacheContextType => {
  const context = useContext(NotificationCacheContext);
  if (!context) {
    throw new Error(
      "useNotificationCache must be used within a NotificationCacheProvider",
    );
  }
  return context;
};
