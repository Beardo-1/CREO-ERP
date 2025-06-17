import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  // Handle window resize to recalculate dropdown position
  useEffect(() => {
    const handleResize = () => {
      if (showDropdown) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showDropdown]);

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

  // Calculate dropdown position based on button position
  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = window.innerWidth < 640 ? 320 : window.innerWidth < 768 ? 352 : 384;
    
    // Calculate position
    const top = buttonRect.bottom + 8; // 8px gap below button
    
    // For mobile, center the dropdown with some margin
    if (window.innerWidth < 640) {
      const left = Math.max(16, Math.min(buttonRect.left, window.innerWidth - dropdownWidth - 16));
      setDropdownPosition({ top, right: window.innerWidth - left - dropdownWidth });
    } else {
      // For desktop, align with button's right edge
      const right = window.innerWidth - buttonRect.right;
      const adjustedRight = Math.max(16, Math.min(right, window.innerWidth - dropdownWidth - 16));
      setDropdownPosition({ top, right: adjustedRight });
    }
  };



  return (
    <>
      {/* Notification Bell */}
      <div className="relative z-50">
        <button
          ref={buttonRef}
          onClick={() => {
            if (!showDropdown) {
              calculateDropdownPosition();
            }
            setShowDropdown(!showDropdown);
          }}
          className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown - Rendered as Portal */}
        {showDropdown && createPortal(
          <div 
            ref={dropdownRef} 
            className="notification-dropdown"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`
            }}
          >
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
          </div>,
          document.body
        )}
      </div>

      {/* Toast Notifications - Horizontal Layout */}
      {toastNotifications.length > 0 && createPortal(
        <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 z-[99999] flex flex-wrap gap-2 justify-end max-w-full">
          {toastNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex-shrink-0 w-64 sm:w-72 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-l-4 ${getNotificationColor(notification.type)} transform transition-all duration-300 animate-slide-in-right hover:shadow-2xl relative overflow-hidden`}
            >
              <div className="p-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification)}
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <button
                      onClick={() => removeToast(notification.id)}
                      className="p-1 rounded-md inline-flex text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Auto-dismiss progress bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-toast-progress"></div>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && createPortal(
        <div
          className="fixed inset-0 z-[99998]"
          onClick={() => setShowDropdown(false)}
        ></div>,
        document.body
      )}
    </>
  );
} 