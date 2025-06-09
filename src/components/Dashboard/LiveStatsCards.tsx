import React, { useState, useEffect } from 'react';
import { Building, Users, Handshake, DollarSign, TrendingUp, TrendingDown, Zap, Target } from 'lucide-react';

interface StatCard {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  prefix?: string;
  suffix?: string;
  target?: number;
}

export function LiveStatsCards() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      id: 'properties',
      title: 'Active Properties',
      value: 156,
      change: 12,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      target: 200
    },
    {
      id: 'contacts',
      title: 'Total Contacts',
      value: 1247,
      change: 23,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      target: 1500
    },
    {
      id: 'deals',
      title: 'Active Deals',
      value: 89,
      change: 8,
      icon: Handshake,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      target: 100
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: 245000,
      change: 15.5,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      prefix: '$',
      target: 300000
    }
  ]);

  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setStats(prevStats => 
        prevStats.map(stat => {
          const randomChange = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const newValue = Math.max(0, stat.value + randomChange);
          const newChange = stat.id === 'revenue' 
            ? +(Math.random() * 30 - 15).toFixed(1)
            : Math.floor(Math.random() * 50 - 25);
          
          return {
            ...stat,
            value: newValue,
            change: newChange
          };
        })
      );
      
      setTimeout(() => setIsAnimating(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (stat: StatCard) => {
    const { value, prefix = '', suffix = '' } = stat;
    if (stat.id === 'revenue') {
      return `${prefix}${(value / 1000).toFixed(0)}K`;
    }
    return `${prefix}${value.toLocaleString()}${suffix}`;
  };

  const getProgressPercentage = (stat: StatCard) => {
    if (!stat.target) return 0;
    return Math.min((stat.value / stat.target) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        const progressPercentage = getProgressPercentage(stat);
        
        return (
          <div
            key={stat.id}
            className={`card-gradient rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center relative overflow-hidden`}>
                <Icon className={`w-6 h-6 ${stat.color} transition-transform duration-300 hover:scale-110`} />
                {isAnimating && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? '+' : ''}{stat.change}%
                </span>
              </div>
            </div>

            {/* Value */}
            <div className="mb-4">
              <h4 className={`text-3xl font-bold text-gray-900 transition-all duration-500 ${
                isAnimating ? 'scale-105' : ''
              }`}>
                {formatValue(stat)}
              </h4>
              <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
            </div>

            {/* Progress Bar */}
            {stat.target && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                      stat.id === 'properties' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                      stat.id === 'contacts' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      stat.id === 'deals' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                      'bg-gradient-to-r from-amber-400 to-amber-600'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Live</span>
              </div>
              {stat.target && (
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {stat.id === 'revenue' ? `$${(stat.target / 1000).toFixed(0)}K` : stat.target.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        );
      })}
    </div>
  );
} 