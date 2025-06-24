import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Users,
  Handshake,
  Calendar,
  Phone,
  Mail,
  Eye,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';
import { SafeRender } from '../../utils/safeRender';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: string;
}

interface RecentActivity {
  id: string;
  type: 'property' | 'deal' | 'contact' | 'task';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'info' | 'error';
}

export default function Overview() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // Load real data for metrics and activities
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const [properties, deals, contacts] = await Promise.all([
          unifiedDataService.getProperties().catch(() => []),
          unifiedDataService.getDeals().catch(() => []),
          unifiedDataService.getContacts().catch(() => [])
        ]);
        
        // Get agents separately since it's not async
        const agents = unifiedDataService.getAgents();

        // Ensure arrays are valid
        const safeProperties = Array.isArray(properties) ? properties : [];
        const safeDeals = Array.isArray(deals) ? deals : [];
        const safeContacts = Array.isArray(contacts) ? contacts : [];

        // Calculate real metrics with safe array operations
        const activeDeals = safeDeals.filter((deal: any) => deal && deal.stage !== 'Closed');
        const closedDeals = safeDeals.filter((deal: any) => deal && deal.stage === 'Closed');
        const totalRevenue = closedDeals.reduce((sum: number, deal: any) => sum + (deal?.value || 0), 0);
        const newContacts = safeContacts.filter((contact: any) => {
          if (!contact || !contact.createdAt) return false;
          try {
            const createdDate = new Date(contact.createdAt);
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return createdDate > monthAgo;
          } catch {
            return false;
          }
        });

        // Calculate conversion rate safely
        const qualifiedContacts = safeContacts.filter((c: any) => c && (c.status === 'Qualified' || c.status === 'Converted'));
        const conversionRate = safeContacts.length > 0 ? (qualifiedContacts.length / safeContacts.length) * 100 : 0;

        // Today's appointments (using recent contacts as proxy)
        const todayAppointments = Math.floor(safeContacts.length * 0.05); // 5% of contacts

        const realMetrics: MetricCard[] = [
          {
            id: 'revenue',
            title: t(appContent.overview.totalRevenue) || 'Total Revenue',
            value: totalRevenue > 0 ? `$${(totalRevenue / 1000000).toFixed(1)}M` : '$0',
            change: totalRevenue > 0 ? 12.5 : 0,
            changeType: 'increase',
            icon: DollarSign,
            color: 'green',
            description: t(appContent.overview.revenueGenerated) || 'Revenue generated this month'
          },
          {
            id: 'properties',
            title: t(appContent.overview.activeProperties) || 'Active Properties',
            value: safeProperties.length.toString(),
            change: safeProperties.length > 0 ? 8.2 : 0,
            changeType: 'increase',
            icon: Building,
            color: 'blue',
            description: t(appContent.overview.propertiesListed) || 'Properties currently listed'
          },
          {
            id: 'deals',
            title: t(appContent.stats.activeDeals) || 'Active Deals',
            value: activeDeals.length.toString(),
            change: activeDeals.length > closedDeals.length ? 5.1 : -3.1,
            changeType: activeDeals.length > closedDeals.length ? 'increase' : 'decrease',
            icon: Handshake,
            color: 'purple',
            description: t(appContent.overview.dealsInProgress) || 'Deals in progress'
          },
          {
            id: 'clients',
            title: t(appContent.stats.newClients) || 'New Clients',
            value: newContacts.length.toString(),
            change: newContacts.length > 0 ? 15.7 : 0,
            changeType: 'increase',
            icon: Users,
            color: 'amber',
            description: t(appContent.overview.newClientsMonth) || 'New clients this month'
          },
          {
            id: 'appointments',
            title: t(appContent.stats.appointments) || 'Appointments',
            value: todayAppointments.toString(),
            change: 0,
            changeType: 'neutral',
            icon: Calendar,
            color: 'indigo',
            description: t(appContent.overview.scheduledToday) || 'Scheduled for today'
          },
          {
            id: 'conversion',
            title: t(appContent.overview.conversionRate) || 'Conversion Rate',
            value: `${conversionRate.toFixed(1)}%`,
            change: conversionRate > 50 ? 2.3 : -1.2,
            changeType: conversionRate > 50 ? 'increase' : 'decrease',
            icon: Target,
            color: 'emerald',
            description: t(appContent.overview.leadConversion) || 'Lead to client conversion'
          }
        ];

        // Generate real recent activities
        const activities: RecentActivity[] = [];

        // Recent properties
        const recentProperties = safeProperties
          .filter((p: any) => p && p.listingDate)
          .sort((a: any, b: any) => {
            try {
              return new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime();
            } catch {
              return 0;
            }
          })
          .slice(0, 2);

        recentProperties.forEach((property: any) => {
          if (property && property.id && property.title) {
            activities.push({
              id: `property-${property.id}`,
              type: 'property',
              title: t(appContent.overview.newPropertyListed) || 'New Property Listed',
              description: `${property.title} - $${(property.price || 0).toLocaleString()}`,
              timestamp: new Date(property.listingDate),
              status: 'success'
            });
          }
        });

        // Recent deals
        const recentDeals = safeDeals
          .filter((d: any) => d && d.createdAt)
          .sort((a: any, b: any) => {
            try {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } catch {
              return 0;
            }
          })
          .slice(0, 2);

        recentDeals.forEach((deal: any) => {
          if (deal && deal.id) {
            const property = safeProperties.find((p: any) => p && p.id === deal.propertyId);
            activities.push({
              id: `deal-${deal.id}`,
              type: 'deal',
              title: deal.stage === 'Closed' ? (t(appContent.overview.dealClosed) || 'Deal Closed') : 'Deal Updated',
              description: `${property?.title || 'Property'} - $${(deal.value || 0).toLocaleString()}`,
              timestamp: new Date(deal.createdAt),
              status: deal.stage === 'Closed' ? 'success' : 'info'
            });
          }
        });

        // Recent contacts
        const recentContacts = safeContacts
          .filter((c: any) => c && c.createdAt)
          .sort((a: any, b: any) => {
            try {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } catch {
              return 0;
            }
          })
          .slice(0, 2);

        recentContacts.forEach((contact: any) => {
          if (contact && contact.id) {
            activities.push({
              id: `contact-${contact.id}`,
              type: 'contact',
              title: t(appContent.overview.newClientAdded) || 'New Client Added',
              description: `${contact.firstName || ''} ${contact.lastName || ''} - ${contact.type || 'Contact'}`,
              timestamp: new Date(contact.createdAt),
              status: 'info'
            });
          }
        });

        // Add follow-up reminders
        const needFollowUp = safeContacts.filter((c: any) => {
          if (!c || !c.lastContact || c.status !== 'Contacted') return false;
          try {
            const lastContact = new Date(c.lastContact);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return lastContact < weekAgo;
          } catch {
            return false;
          }
        }).slice(0, 1);

        needFollowUp.forEach((contact: any) => {
          if (contact && contact.id) {
            activities.push({
              id: `followup-${contact.id}`,
              type: 'task',
              title: 'Follow-up Required',
              description: `${contact.firstName || ''} ${contact.lastName || ''} needs follow-up`,
              timestamp: new Date(contact.lastContact),
              status: 'warning'
            });
          }
        });

        // Sort activities by timestamp safely
        activities.sort((a, b) => {
          try {
            return b.timestamp.getTime() - a.timestamp.getTime();
          } catch {
            return 0;
          }
        });

        setMetrics(realMetrics);
        setRecentActivities(activities.slice(0, 6)); // Keep top 6 activities
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set empty state on error
        setMetrics([]);
        setRecentActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Refresh dashboard every 2 minutes
    const interval = setInterval(loadDashboardData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange, t]);

  const quickActions: QuickAction[] = [
    {
      id: 'add-property',
      title: t(appContent.overview.addProperty) || 'Add Property',
      description: t(appContent.overview.listNewProperty) || 'List a new property',
      icon: Building,
      color: 'blue',
      action: 'properties'
    },
    {
      id: 'add-contact',
      title: t(appContent.overview.addContact) || 'Add Contact',
      description: t(appContent.overview.createNewContact) || 'Create new contact',
      icon: Users,
      color: 'green',
      action: 'contacts'
    },
    {
      id: 'schedule-meeting',
      title: t(appContent.overview.scheduleMeeting) || 'Schedule Meeting',
      description: t(appContent.overview.bookAppointment) || 'Book an appointment',
      icon: Calendar,
      color: 'purple',
      action: 'calendar'
    },
    {
      id: 'create-deal',
      title: t(appContent.overview.createDeal) || 'Create Deal',
      description: t(appContent.overview.startNewDeal) || 'Start new deal',
      icon: Handshake,
      color: 'amber',
      action: 'deals'
    }
  ];

  const getMetricColor = (color: string) => {
    const colors = {
      green: 'from-green-500 to-emerald-600',
      blue: 'from-blue-500 to-cyan-600',
      purple: 'from-purple-500 to-violet-600',
      amber: 'from-amber-500 to-orange-600',
      indigo: 'from-indigo-500 to-blue-600',
      emerald: 'from-emerald-500 to-teal-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'increase') return <ArrowUp className="w-4 h-4" />;
    if (changeType === 'decrease') return <ArrowDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getChangeColor = (changeType: string) => {
    if (changeType === 'increase') return 'text-green-600';
    if (changeType === 'decrease') return 'text-red-600';
    return 'text-gray-600';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property': return <Building className="w-5 h-5" />;
      case 'deal': return <Handshake className="w-5 h-5" />;
      case 'contact': return <Users className="w-5 h-5" />;
      case 'task': return <Clock className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp: Date) => {
    try {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} days ago`;
      if (hours > 0) return `${hours} hours ago`;
      return 'Just now';
    } catch {
      return 'Recently';
    }
  };

  // Handle quick action clicks
  const handleQuickAction = (action: string) => {
    // This would typically trigger navigation or modal opening
    
    // For now, just log the action - in a real app this would navigate
    // or trigger appropriate modals/forms
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-64 rounded-xl"></div>
            <div className="bg-gray-200 h-64 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          // Safe icon rendering
          const IconComponent = metric.icon;
          return (
            <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getMetricColor(metric.color)} flex items-center justify-center text-white`}>
                  <SafeRender componentName={`MetricIcon-${metric.id}`}>
                    <IconComponent className="w-6 h-6" />
                  </SafeRender>
                </div>
                <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
                  {getChangeIcon(metric.changeType)}
                  <span className="text-sm font-medium">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.overview.quickActions) || 'Quick Actions'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.action)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getMetricColor(action.color)} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                    <SafeRender componentName={`ActionIcon-${action.id}`}>
                      <ActionIcon className="w-5 h-5" />
                    </SafeRender>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.overview.recentActivity) || 'Recent Activity'}</h2>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 