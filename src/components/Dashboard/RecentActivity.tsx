import React from 'react';
import { Clock, User, Building, FileText } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'contact' | 'property' | 'deal' | 'document';
  title: string;
  description: string;
  time: string;
  user: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'contact',
    title: 'New lead registered',
    description: 'John Smith from website contact form',
    time: '2 hours ago',
    user: 'Emma Wilson'
  },
  {
    id: '2',
    type: 'property',
    title: 'Property listing updated',
    description: 'Downtown Condo - Price reduced to $850,000',
    time: '4 hours ago',
    user: 'David Brown'
  },
  {
    id: '3',
    type: 'deal',
    title: 'Deal moved to contract stage',
    description: 'Family Home on Oak Avenue',
    time: '6 hours ago',
    user: 'Emma Wilson'
  },
  {
    id: '4',
    type: 'document',
    title: 'Document uploaded',
    description: 'Inspection report for commercial property',
    time: '1 day ago',
    user: 'David Brown'
  }
];

export function RecentActivity() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'contact': return <User className="w-4 h-4" />;
      case 'property': return <Building className="w-4 h-4" />;
      case 'deal': return <FileText className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'contact': return 'bg-green-100 text-green-600';
      case 'property': return 'bg-blue-100 text-blue-600';
      case 'deal': return 'bg-purple-100 text-purple-600';
      case 'document': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(activity.type)}`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span>{activity.time}</span>
                <span className="mx-2">•</span>
                <span>{activity.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activity
      </button>
    </div>
  );
}