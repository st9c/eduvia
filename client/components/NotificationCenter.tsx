import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info, BookOpen, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: "assignment" | "grade" | "message" | "announcement";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock notifications - in real app, fetch from API
    setNotifications([
      {
        id: 1,
        type: "grade",
        title: "Assignment Graded",
        message: "Your Data Structure Implementation has been graded: 95/100",
        timestamp: "2 hours ago",
        read: false,
      },
      {
        id: 2,
        type: "assignment",
        title: "New Assignment",
        message: "Algorithm Design Project is due in 3 days",
        timestamp: "5 hours ago",
        read: false,
      },
      {
        id: 3,
        type: "message",
        title: "New Message",
        message: "Dr. Sarah Johnson sent you a message",
        timestamp: "1 day ago",
        read: true,
      },
      {
        id: 4,
        type: "announcement",
        title: "Class Announcement",
        message: "Office hours rescheduled to Friday 2-4 PM",
        timestamp: "2 days ago",
        read: true,
      },
    ]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "grade":
        return <CheckCircle size={20} className="text-green-500" />;
      case "assignment":
        return <BookOpen size={20} className="text-blue-500" />;
      case "message":
        return <MessageSquare size={20} className="text-purple-500" />;
      case "announcement":
        return <Info size={20} className="text-amber-500" />;
      default:
        return <Bell size={20} className="text-primary" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Bell size={20} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 max-h-[600px] bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted">
              <div>
                <h3 className="font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-semibold ${
                            !notification.read ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-border bg-muted">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    toast.info("View all notifications page coming soon!");
                  }}
                  className="w-full text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}