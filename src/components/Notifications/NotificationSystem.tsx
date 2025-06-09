import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, DollarSign, Users, Home, Handshake } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'deal';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ComponentType<any>;
}

const notificationTemplates = [
  {
    type: 'success' as const,
    title: 'New Lead Converted',
    message: 'Sarah Johnson has been converted to a client!',
    icon: Users
  },
  {
    type: 'deal' as const,
    title: 'Deal Closed',
    message: 'Congratulations! 123 Oak Street deal closed for $485,000',
    icon: DollarSign
  },
  {
    type: 'info' as const,
    title: 'Property Viewed',
    message: '456 Pine Avenue has been viewed 15 times today',
    icon: Home
  },
  {
    type: 'warning' as const,
    title: 'Follow-up Required',
    message: 'Michael Chen needs follow-up - last contact 5 days ago',
    icon: AlertCircle
  },
  {
    type: 'success' as const,
    title: 'New Property Listed',
    message: '789 Maple Drive has been successfully listed',
    icon: Home
  },
  {
    type: 'deal' as const,
    title: 'Offer Received',
    message: 'New offer received for $320,000 on downtown condo',
    icon: Handshake
  }
];

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);

  // Generate random notifications
  useEffect(() => {
    const generateNotification = () => {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...template,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      setToastNotifications(prev => [...prev, newNotification]);

      // Remove toast after 5 seconds
      setTimeout(() => {
        setToastNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    };

    // Generate initial notifications
    const initialNotifications = Array.from({ length: 3 }, (_, i) => {
      const template = notificationTemplates[i];
      return {
        id: `initial-${i}`,
        ...template,
        timestamp: new Date(Date.now() - i * 1000 * 60 * 30), // 30 minutes apart
        read: i > 0
      };
    });
    setNotifications(initialNotifications);

    // Generate new notifications every 10-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance
        generateNotification();
      }
    }, Math.random() * 20000 + 10000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeToast = (id: string) => {
    setToastNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) {
      const Icon = notification.icon;
      return <Icon className="w-5 h-5" />;
    }

    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'deal':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      case 'deal':
        return 'border-l-emerald-500 bg-emerald-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium text-gray-900 ${
                          !notification.read ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toastNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`max-w-sm w-full bg-white shadow-lg rounded-2xl border-l-4 ${getNotificationColor(notification.type)} transform transition-all duration-300 animate-slide-in-right`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification)}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => removeToast(notification.id)}
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </>
  );
} 