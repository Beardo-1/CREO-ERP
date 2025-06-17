import React, { useState, useEffect } from 'react';
import { Clock, User, Building, FileText, DollarSign, Phone, Mail, Calendar, Eye, Handshake } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface Activity {
  id: string;
  type: 'property' | 'contact' | 'deal' | 'call' | 'email' | 'meeting' | 'view' | 'listing';
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  icon: React.ComponentType<any>;
  color: string;
}

const activityTemplates = [
  {
    type: 'property' as const,
    title: 'New Property Added',
    description: 'added a new property listing',
    icon: Building,
    color: 'text-blue-600'
  },
  {
    type: 'contact' as const,
    title: 'New Contact',
    description: 'added a new contact to the system',
    icon: User,
    color: 'text-green-600'
  },
  {
    type: 'deal' as const,
    title: 'Deal Updated',
    description: 'moved a deal to the next stage',
    icon: Handshake,
    color: 'text-purple-600'
  },
  {
    type: 'call' as const,
    title: 'Client Call',
    description: 'completed a call with a client',
    icon: Phone,
    color: 'text-amber-600'
  },
  {
    type: 'email' as const,
    title: 'Email Sent',
    description: 'sent a follow-up email',
    icon: Mail,
    color: 'text-indigo-600'
  },
  {
    type: 'meeting' as const,
    title: 'Meeting Scheduled',
    description: 'scheduled a property showing',
    icon: Calendar,
    color: 'text-pink-600'
  },
  {
    type: 'view' as const,
    title: 'Property Viewed',
    description: 'viewed property details',
    icon: Eye,
    color: 'text-gray-600'
  },
  {
    type: 'listing' as const,
    title: 'Listing Updated',
    description: 'updated property listing information',
    icon: FileText,
    color: 'text-orange-600'
  }
];

const users = ['Emma Wilson', 'John Smith', 'Lisa Rodriguez', 'Michael Chen', 'Sarah Johnson'];

export function LiveActivityFeed() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Generate initial activities
    const initialActivities = Array.from({ length: 5 }, (_, i) => {
      const template = activityTemplates[i % activityTemplates.length];
      return {
        id: `initial-${i}`,
        ...template,
        user: users[i % users.length],
        timestamp: new Date(Date.now() - i * 1000 * 60 * 15) // 15 minutes apart
      };
    });
    setActivities(initialActivities);

    // Generate new activities periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // 60% chance
        const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
        const newActivity: Activity = {
          id: Date.now().toString(),
          ...template,
          user: users[Math.floor(Math.random() * users.length)],
          timestamp: new Date()
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, Math.random() * 15000 + 8000); // 8-23 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t(appContent.stats.liveActivityFeed)}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isNew = index === 0 && formatTime(activity.timestamp) === 'Just now';
          
          return (
            <div
              key={activity.id}
              className={`flex items-start space-x-4 p-3 rounded-xl transition-all duration-300 hover:bg-gray-50 ${
                isNew ? 'bg-gradient-to-r from-amber-50 to-orange-50 animate-pulse' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activity.type === 'property' ? 'bg-blue-100' :
                activity.type === 'contact' ? 'bg-green-100' :
                activity.type === 'deal' ? 'bg-purple-100' :
                activity.type === 'call' ? 'bg-amber-100' :
                activity.type === 'email' ? 'bg-indigo-100' :
                activity.type === 'meeting' ? 'bg-pink-100' :
                activity.type === 'view' ? 'bg-gray-100' :
                'bg-orange-100'
              }`}>
                <Icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  {isNew && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{activity.user}</span> {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(activity.timestamp)}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {getInitials(activity.user)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
} 