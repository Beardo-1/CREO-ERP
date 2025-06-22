import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, CheckCircle, AlertCircle, Info, DollarSign, Users, Home, Handshake, Calendar } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'deal';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ComponentType<any>;
  actionUrl?: string;
}

export function NotificationSystem() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load real notifications from system events
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [properties, deals, contacts] = await Promise.all([
          unifiedDataService.getProperties(),
          unifiedDataService.getDeals(),
          unifiedDataService.getContacts()
        ]);

        const systemNotifications: Notification[] = [];

        // Recent property additions
        const recentProperties = properties
          .filter(p => {
            const listingDate = new Date(p.listingDate);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return listingDate > dayAgo;
          })
          .slice(0, 3);

        recentProperties.forEach(property => {
          systemNotifications.push({
            id: `property-${property.id}`,
            type: 'success',
            title: 'New Property Listed',
            message: `${property.title} - $${property.price.toLocaleString()}`,
            timestamp: new Date(property.listingDate),
            read: false,
            icon: Home,
            actionUrl: `/properties/${property.id}`
          });
        });

        // Recent deals
        const recentDeals = deals
          .filter(d => {
            const createdDate = new Date(d.createdAt);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return createdDate > dayAgo;
          })
          .slice(0, 3);

        recentDeals.forEach(deal => {
          const dealProperty = properties.find(p => p.id === deal.propertyId);
          systemNotifications.push({
            id: `deal-${deal.id}`,
            type: deal.stage === 'Closed' ? 'deal' : 'info',
            title: deal.stage === 'Closed' ? 'Deal Closed' : 'New Deal Created',
            message: `${dealProperty?.title || 'Property'} - $${deal.value.toLocaleString()}`,
            timestamp: new Date(deal.createdAt),
            read: false,
            icon: deal.stage === 'Closed' ? DollarSign : Handshake,
            actionUrl: `/deals/${deal.id}`
          });
        });

        // Recent contacts
        const recentContacts = contacts
          .filter(c => {
            const createdDate = new Date(c.createdAt);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return createdDate > dayAgo;
          })
          .slice(0, 2);

        recentContacts.forEach(contact => {
          systemNotifications.push({
            id: `contact-${contact.id}`,
            type: 'info',
            title: 'New Contact Added',
            message: `${contact.firstName} ${contact.lastName} - ${contact.type}`,
            timestamp: new Date(contact.createdAt),
            read: false,
            icon: Users,
            actionUrl: `/contacts/${contact.id}`
          });
        });

        // Follow-up reminders for old contacts
        const needFollowUp = contacts.filter(c => {
          const lastContact = new Date(c.lastContact);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return lastContact < weekAgo && c.status === 'Contacted';
        }).slice(0, 2);

        needFollowUp.forEach(contact => {
          systemNotifications.push({
            id: `followup-${contact.id}`,
            type: 'warning',
            title: 'Follow-up Required',
            message: `${contact.firstName} ${contact.lastName} needs follow-up`,
            timestamp: new Date(contact.lastContact),
            read: false,
            icon: AlertCircle,
            actionUrl: `/contacts/${contact.id}`
          });
        });

        // Sort by timestamp (newest first)
        systemNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Add system status notifications if no other notifications
        if (systemNotifications.length === 0) {
          systemNotifications.push({
            id: 'system-ready',
            type: 'success',
            title: 'System Ready',
            message: 'Your CRM system is running smoothly',
            timestamp: new Date(),
            read: false,
            icon: CheckCircle
          });
        }

        setNotifications(systemNotifications.slice(0, 10)); // Keep only 10 most recent
      } catch (error) {
        console.error('Error loading notifications:', error);
        // Add error notification
        setNotifications([{
          id: 'error-loading',
          type: 'warning',
          title: 'System Notice',
          message: 'Unable to load recent activity notifications',
          timestamp: new Date(),
          read: false,
          icon: AlertCircle
        }]);
      }
    };

    loadNotifications();

    // Listen for data changes to generate new notifications
    const handlePropertyChange = (data: any) => {
      if (data && data.length > 0) {
        const latestProperty = data[data.length - 1];
        const newNotification: Notification = {
          id: `new-property-${latestProperty.id}`,
          type: 'success',
          title: 'New Property Added',
          message: `${latestProperty.title} has been listed`,
          timestamp: new Date(),
          read: false,
          icon: Home
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        setToastNotifications(prev => [...prev, newNotification]);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
          setToastNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 5000);
      }
    };

    const handleDealChange = (data: any) => {
      if (data && data.length > 0) {
        const latestDeal = data[data.length - 1];
        const newNotification: Notification = {
          id: `new-deal-${latestDeal.id}`,
          type: 'deal',
          title: 'New Deal Created',
          message: `Deal for $${latestDeal.value.toLocaleString()} created`,
          timestamp: new Date(),
          read: false,
          icon: Handshake
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        setToastNotifications(prev => [...prev, newNotification]);
        
        setTimeout(() => {
          setToastNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 5000);
      }
    };

    const handleContactChange = (data: any) => {
      if (data && data.length > 0) {
        const latestContact = data[data.length - 1];
        const newNotification: Notification = {
          id: `new-contact-${latestContact.id}`,
          type: 'info',
          title: 'New Contact Added',
          message: `${latestContact.firstName} ${latestContact.lastName} added`,
          timestamp: new Date(),
          read: false,
          icon: Users
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        setToastNotifications(prev => [...prev, newNotification]);
        
        setTimeout(() => {
          setToastNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 5000);
      }
    };

    // Subscribe to data changes
    unifiedDataService.subscribe('propertiesChanged', handlePropertyChange);
    unifiedDataService.subscribe('dealsChanged', handleDealChange);
    unifiedDataService.subscribe('contactsChanged', handleContactChange);

    // Refresh notifications every 5 minutes
    const interval = setInterval(loadNotifications, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      unifiedDataService.unsubscribe('propertiesChanged', handlePropertyChange);
      unifiedDataService.unsubscribe('dealsChanged', handleDealChange);
      unifiedDataService.unsubscribe('contactsChanged', handleContactChange);
    };
  }, []);

  // Calculate dropdown position
  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 400;
      const dropdownHeight = 500;
      
      let top = rect.bottom + 8;
      let right = window.innerWidth - rect.right;
      
      // Adjust if dropdown would go off screen
      if (rect.right + dropdownWidth > window.innerWidth) {
        right = 16;
      }
      
      if (rect.bottom + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 8;
      }
      
      setDropdownPosition({ top, right });
    }
  };

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
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return t(appContent.deals.justNow);
    if (minutes < 60) return `${minutes}${t(appContent.deals.minutesAgo)}`;
    if (hours < 24) return `${hours}${t(appContent.deals.hoursAgo)}`;
    return `${days}${t(appContent.deals.daysAgo)}`;
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
            className="fixed bg-white rounded-2xl shadow-2xl border border-gray-200 z-[99999] w-96 max-h-[500px] overflow-hidden"
            style={{ 
              top: `${dropdownPosition.top}px`, 
              right: `${dropdownPosition.right}px` 
            }}
            ref={dropdownRef}
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t(appContent.deals.notifications)}</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-orange-100 hover:text-white transition-colors"
                    >
                      {t(appContent.deals.markAllRead)}
                    </button>
                  )}
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t(appContent.deals.noNotifications)}</p>
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
    </>
  );
} 