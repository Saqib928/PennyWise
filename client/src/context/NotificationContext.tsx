import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { notificationService } from "../services/notification.service";
import { mapBackendNotification } from "../utils/notificationMapper";

export type NotificationItem = {
  id: string;
  type: "invite" | "expense" | "settle";
  title: string;
  message: string;
  time: string;
  sender: string;
  amount?: number;
  avatarColor: string;
  isRead: boolean;
};

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const backendData = await notificationService.getAll();
      setNotifications(backendData.map(mapBackendNotification));
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.isRead)
          .map(n => notificationService.markRead(n.id))
      );

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        removeNotification,
        refreshNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationProvider");
  return context;
};
