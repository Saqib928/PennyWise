import {
  Check,
  X,
  UserPlus,
  Receipt,
  Bell,
  Clock,
  CheckCheck
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { notificationService } from "../services/notification.service";

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    removeNotification
  } = useNotifications();

  const handleAction = async (id: string, action: "accept" | "reject") => {
    try {
      if (action === "accept") {
        await notificationService.acceptInvite(id);
      } else {
        await notificationService.rejectInvite(id);
      }

      await notificationService.markRead(id);
      removeNotification(id);
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "invite": return <UserPlus size={18} className="text-blue-600" />;
      case "expense": return <Receipt size={18} className="text-purple-600" />;
      case "settle": return <CheckCheck size={18} className="text-green-600" />;
      default: return <Bell size={18} className="text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "invite": return "bg-blue-50";
      case "expense": return "bg-purple-50";
      case "settle": return "bg-green-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h1>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-indigo-600 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="mx-auto text-gray-300 w-8 h-8" />
            <p className="text-gray-500 mt-2">No notifications</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-5 rounded-xl border flex justify-between items-center ${n.isRead ? "opacity-70" : "border-indigo-200"}`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${n.avatarColor}`}>
                  {n.sender?.[0]}
                </div>

                <div>
                  <p className="text-sm">
                    <b>{n.sender}</b> {n.message}
                  </p>

                  {n.amount && (
                    <p className="text-xs font-semibold">₹ {n.amount}</p>
                  )}

                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Clock size={12} />
                    {n.time}
                  </div>
                </div>
              </div>

              {n.type === "invite" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(n.id, "reject")}
                    className="p-2 border rounded-full text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>

                  <button
                    onClick={() => handleAction(n.id, "accept")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAction(n.id, "accept")}
                  className="p-2 text-gray-400 hover:text-indigo-600"
                >
                  <Check size={18} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
