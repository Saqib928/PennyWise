import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of a notification
export type NotificationItem = {
  id: string;
  type: "invite" | "expense" | "settle";
  title: string;
  message: string;
  time: string;
  sender: string;
  amount?: number;
  avatarColor: string;
  isRead: boolean; // Added isRead property
};

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Mock Initial Data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1", type: "invite", title: "Group Invite", message: "invited you to 'Goa Trip'", sender: "Saqib", time: "2m", avatarColor: "bg-blue-500", isRead: false
    },
    {
      id: "2", type: "expense", title: "New Expense", message: "added 'Dinner'", sender: "Aman", amount: 450, time: "1h", avatarColor: "bg-purple-500", isRead: false
    },
    {
      id: "3", type: "settle", title: "Paid", message: "paid you", sender: "Rahul", amount: 100, time: "1d", avatarColor: "bg-green-500", isRead: false
    }
  ]);

  // Calculate unread count automatically
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom Hook for easy access
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
};