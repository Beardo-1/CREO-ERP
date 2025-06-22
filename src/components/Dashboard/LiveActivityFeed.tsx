import React, { useState, useEffect } from 'react';
import { Activity, Users, Building, Handshake, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';

interface ActivityItem {
  id: string;
  type: 'property' | 'contact' | 'deal' | 'system';
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  status: 'success' | 'info' | 'warning';
  icon: React.ComponentType<any>;
}

export function LiveActivityFeed() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real activities from data
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const [properties, deals, contacts] = await Promise.all([
          unifiedDataService.getProperties(),
          unifiedDataService.getDeals(),
          unifiedDataService.getContacts()
        ]);

        const realActivities: ActivityItem[] = [];

        // Recent property activities
        const recentProperties = properties
          .sort((a: any, b: any) => new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime())
          .slice(0, 3);

        recentProperties.forEach((property: any) => {
          realActivities.push({
            id: `property-${property.id}`,
            type: 'property',
            title: 'New Property Listed',
            description: `${property.title} listed for $${property.price.toLocaleString()}`,
            user: property.agentId || 'System',
            timestamp: new Date(property.listingDate),
            status: 'success',
            icon: Building
          });
        });

        // Recent deal activities
        const recentDeals = deals
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        recentDeals.forEach((deal: any) => {
          const property = properties.find((p: any) => p.id === deal.propertyId);
          realActivities.push({
            id: `deal-${deal.id}`,
            type: 'deal',
            title: deal.stage === 'Closed' ? 'Deal Closed' : `Deal ${deal.stage}`,
            description: `${property?.title || 'Property'} - $${deal.value.toLocaleString()}`,
            user: deal.agentId || 'Agent',
            timestamp: new Date(deal.createdAt),
            status: deal.stage === 'Closed' ? 'success' : 'info',
            icon: Handshake
          });
        });

        // Recent contact activities
        const recentContacts = contacts
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        recentContacts.forEach((contact: any) => {
          realActivities.push({
            id: `contact-${contact.id}`,
            type: 'contact',
            title: 'New Contact Added',
            description: `${contact.firstName} ${contact.lastName} (${contact.type})`,
            user: contact.assignedAgent || 'System',
            timestamp: new Date(contact.createdAt),
            status: 'info',
            icon: Users
          });
        });

        // System activities
        if (realActivities.length === 0) {
          realActivities.push({
            id: 'system-ready',
            type: 'system',
            title: 'System Ready',
            description: 'CRM system is running smoothly',
            user: 'System',
            timestamp: new Date(),
            status: 'success',
            icon: CheckCircle
          });
        }

        // Sort by timestamp (newest first)
        realActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActivities(realActivities.slice(0, 10)); // Keep only 10 most recent
      } catch (error) {
        console.error('Error loading activities:', error);
        setActivities([{
          id: 'error',
          type: 'system',
          title: 'System Notice',
          description: 'Unable to load recent activities',
          user: 'System',
          timestamp: new Date(),
          status: 'warning',
          icon: AlertCircle
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();

    // Listen for data changes to add new activities
    const handleDataChange = (data: any, type: string) => {
      if (data && data.length > 0) {
        const latest = data[data.length - 1];
        let newActivity: ActivityItem;

        switch (type) {
          case 'properties':
            newActivity = {
              id: `new-property-${latest.id}`,
              type: 'property',
              title: 'Property Added',
              description: `${latest.title} listed for $${latest.price.toLocaleString()}`,
              user: latest.agentId || 'Agent',
              timestamp: new Date(),
              status: 'success',
              icon: Building
            };
            break;
          case 'deals':
            newActivity = {
              id: `new-deal-${latest.id}`,
              type: 'deal',
              title: 'Deal Created',
              description: `New deal worth $${latest.value.toLocaleString()}`,
              user: latest.agentId || 'Agent',
              timestamp: new Date(),
              status: 'info',
              icon: Handshake
            };
            break;
          case 'contacts':
            newActivity = {
              id: `new-contact-${latest.id}`,
              type: 'contact',
              title: 'Contact Added',
              description: `${latest.firstName} ${latest.lastName} added`,
              user: latest.assignedAgent || 'Agent',
              timestamp: new Date(),
              status: 'info',
              icon: Users
            };
            break;
          default:
            return;
        }

        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    };

    // Subscribe to data changes
    const handlePropertyChange = (data: any) => handleDataChange(data, 'properties');
    const handleDealChange = (data: any) => handleDataChange(data, 'deals');
    const handleContactChange = (data: any) => handleDataChange(data, 'contacts');

    unifiedDataService.subscribe('propertiesChanged', handlePropertyChange);
    unifiedDataService.subscribe('dealsChanged', handleDealChange);
    unifiedDataService.subscribe('contactsChanged', handleContactChange);

    // Refresh activities every 2 minutes
    const interval = setInterval(loadActivities, 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
      unifiedDataService.unsubscribe('propertiesChanged', handlePropertyChange);
      unifiedDataService.unsubscribe('dealsChanged', handleDealChange);
      unifiedDataService.unsubscribe('contactsChanged', handleContactChange);
    };
  }, []);

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.status)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">by {activity.user}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {activities.length} recent activities
            </span>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Live updates</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 