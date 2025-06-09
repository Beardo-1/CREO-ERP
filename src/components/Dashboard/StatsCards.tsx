import React from 'react';
import { Building, Users, Handshake, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, change, changeType, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex items-center space-x-2">
          {changeType === 'positive' ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-sm font-semibold ${
            changeType === 'positive' ? 'text-green-500' : 'text-red-500'
          }`}>
            {change}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-4xl font-bold text-gray-900 mb-2">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
      </div>
    </div>
  );
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <StatsCard
        title="Active Properties"
        value="247"
        change="+12.5%"
        changeType="positive"
        color="bg-blue-100"
        icon={<Building className="w-7 h-7 text-blue-600" />}
      />
      <StatsCard
        title="Total Leads"
        value="1,429"
        change="+8.2%"
        changeType="positive"
        color="bg-green-100"
        icon={<Users className="w-7 h-7 text-green-600" />}
      />
      <StatsCard
        title="Deals Closed"
        value="87"
        change="+15.3%"
        changeType="positive"
        color="bg-purple-100"
        icon={<Handshake className="w-7 h-7 text-purple-600" />}
      />
      <StatsCard
        title="Revenue"
        value="$2.4M"
        change="-3.1%"
        changeType="negative"
        color="bg-amber-100"
        icon={<DollarSign className="w-7 h-7 text-amber-600" />}
      />
    </div>
  );
}