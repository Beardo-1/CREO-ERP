import React from 'react';
import { Search, Settings, User } from 'lucide-react';
import { NotificationSystem } from '../Notifications/NotificationSystem';

interface HeaderProps {
  activeTab: string;
  userName: string;
}

export function Header({ activeTab, userName }: HeaderProps) {
  const getPageTitle = (tab: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      properties: 'Properties',
      contacts: 'Contacts',
      deals: 'Deals',
      leads: 'Lead Management',
      marketing: 'Marketing',
      locations: 'Locations',
      valuations: 'Valuations',
      media: 'Media Gallery',
      tasks: 'Tasks',
      calendar: 'Calendar',
      financial: 'Financial',
      agents: 'Team',
      documents: 'Documents',
      compliance: 'Compliance',
      reports: 'Reports'
    };
    return titles[tab] || 'Dashboard';
  };

  const getPageDescription = (tab: string) => {
    const descriptions: Record<string, string> = {
      dashboard: 'Here\'s what\'s happening with your real estate business today.',
      properties: 'Manage your property listings and inventory.',
      contacts: 'Track leads, clients, and business relationships.',
      deals: 'Monitor sales pipeline and transaction progress.',
      leads: 'Convert prospects into clients with advanced lead management.',
      marketing: 'Track campaign performance and marketing ROI.',
      locations: 'Analyze market trends and location-based insights.',
      valuations: 'Get accurate property valuations and market analysis.',
      media: 'Manage property photos, videos, and virtual tours.',
      tasks: 'Stay organized with your daily tasks and activities.',
      calendar: 'Manage appointments, showings, and meetings.',
      financial: 'Track commissions, expenses, and financial performance.',
      agents: 'Manage your team and agent performance.',
      documents: 'Organize contracts, agreements, and important documents.',
      compliance: 'Stay compliant with regulations and legal requirements.',
      reports: 'Analyze business performance with detailed reports.'
    };
    return descriptions[tab] || 'Manage your real estate business efficiently.';
  };

  return (
    <header className="header-gradient border-b border-white/20 px-8 py-6 relative shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
            Welcome back, {userName.split(' ')[0]}
          </h2>
          <p className="text-gray-600 mt-1 animate-fade-in-delay">
            {getPageDescription(activeTab)}
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              placeholder="Search properties, contacts, deals..."
              className="pl-12 pr-4 py-3 w-96 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:shadow-md"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationSystem />
            
            <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all duration-200 hover:scale-105">
              <Settings className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-2 hover:from-amber-50 hover:to-orange-50 transition-all duration-300 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Real Estate Agent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}