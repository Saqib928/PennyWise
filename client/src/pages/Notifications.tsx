import { 
  Check, 
  X, 
  UserPlus, 
  Receipt, 
  Bell, 
  Clock, 
  CheckCheck 
} from "lucide-react";
import { useNotifications, type NotificationItem } from "../context/NotificationContext";

export default function Notifications() {
  // Use data and functions from Context
  const { notifications, unreadCount, markAllAsRead, removeNotification } = useNotifications();

  // --- Handlers ---
  const handleAction = (id: string, action: 'accept' | 'reject') => {
    // In a real app, you would make an API call here.
    console.log(`${action} notification ${id}`);
    
    // For now, we just remove it from the list to update the UI
    removeNotification(id);
  };

  // --- Helper to get icons ---
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case "invite": return <UserPlus size={18} className="text-blue-600" />;
      case "expense": return <Receipt size={18} className="text-purple-600" />;
      case "settle": return <CheckCheck size={18} className="text-green-600" />;
      default: return <Bell size={18} className="text-gray-600" />;
    }
  };

  const getBgColor = (type: NotificationItem['type']) => {
    switch (type) {
      case "invite": return "bg-blue-50";
      case "expense": return "bg-purple-50";
      case "settle": return "bg-green-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up space-y-6">
      
      {/* --- Header --- */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Stay updated with your shared expenses</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* --- List Section --- */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 text-sm">You have no new notifications.</p>
          </div>
        ) : (
          // Notification Cards
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`group bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4 ${n.isRead ? 'border-gray-100 opacity-80' : 'border-indigo-100 bg-indigo-50/10'}`}
            >
              
              {/* Icon & Avatar */}
              <div className="flex items-start gap-4 flex-1">
                <div className="relative">
                    {/* User Avatar */}
                    <div className={`w-12 h-12 rounded-full ${n.avatarColor} text-white flex items-center justify-center font-bold text-lg`}>
                        {n.sender.charAt(0)}
                    </div>
                    {/* Type Badge Icon */}
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${getBgColor(n.type)}`}>
                        {getIcon(n.type)}
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-gray-900 text-sm leading-snug">
                        <span className="font-bold">{n.sender}</span> <span className="text-gray-600">{n.message}</span>
                    </p>
                    {n.amount && (
                        <p className="text-xs font-bold text-gray-800 bg-gray-100 inline-block px-2 py-0.5 rounded-md">
                            ₹ {n.amount}
                        </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Clock size={10} />
                        <span>{n.time}</span>
                    </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pl-16 sm:pl-0">
                {n.type === 'invite' ? (
                    <>
                        <button 
                            onClick={() => handleAction(n.id, 'reject')}
                            className="p-2 rounded-full border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                            title="Decline"
                        >
                            <X size={20} />
                        </button>
                        <button 
                            onClick={() => handleAction(n.id, 'accept')}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                        >
                            <Check size={16} />
                            Accept
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => handleAction(n.id, 'accept')}
                        className="text-gray-400 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded-full transition-colors"
                        title="Mark as done"
                    >
                        <Check size={20} />
                    </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}