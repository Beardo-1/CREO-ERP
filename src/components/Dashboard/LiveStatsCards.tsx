import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Building, Users, Handshake, Calendar, Target } from 'lucide-react';
import { getResponsiveClasses, spacingResponsive, componentSizes } from '../../utils/responsive';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';
import { safeNestedTranslate } from '../../utils/translationHelpers';

interface StatCard {
  titleKey: keyof typeof appContent.stats;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  progress: number;
}

export function LiveStatsCards() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        
        // Get real data from dataService
        const [properties, deals, contacts] = await Promise.all([
          unifiedDataService.getProperties(),
          unifiedDataService.getDeals(),
          unifiedDataService.getContacts()
        ]);

        // Calculate real stats
        const activeDeals = deals.filter((deal: any) => deal.stage !== 'Closed');
        const closedDeals = deals.filter((deal: any) => deal.stage === 'Closed');
        const totalRevenue = closedDeals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
        
        // For appointments, we'll use a subset of contacts as proxy for today's appointments
        const todayAppointments = Math.floor(contacts.length * 0.1); // 10% of contacts as appointments
        
        // Calculate month-over-month changes (placeholder for now - would need historical data)
        const calculateChange = (current: number, type: 'count' | 'revenue') => {
          // For demo purposes, calculate based on data patterns
          if (current === 0) return { change: '0%', trend: 'up' as const };
          
          const changePercent = Math.floor((current * 0.1) + (type === 'revenue' ? 5 : 2));
          return {
            change: `+${changePercent}%`,
            trend: 'up' as const
          };
        };

        const realStats: StatCard[] = [
          {
            titleKey: 'totalProperties',
            value: properties.length.toString(),
            ...calculateChange(properties.length, 'count'),
            icon: <Building className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: 'from-blue-500 to-blue-600',
            progress: Math.min(100, (properties.length / 100) * 100)
          },
          {
            titleKey: 'activeDeals',
            value: activeDeals.length.toString(),
            ...calculateChange(activeDeals.length, 'count'),
            icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: 'from-green-500 to-green-600',
            progress: Math.min(100, (activeDeals.length / 50) * 100)
          },
          {
            titleKey: 'totalRevenue',
            value: totalRevenue > 0 ? `$${(totalRevenue / 1000000).toFixed(1)}M` : '$0',
            ...calculateChange(totalRevenue, 'revenue'),
            icon: <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: 'from-amber-500 to-orange-500',
            progress: Math.min(100, (totalRevenue / 1000000) * 20)
          },
          {
            titleKey: 'newClients',
            value: contacts.length.toString(),
            ...calculateChange(contacts.length, 'count'),
            icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: 'from-purple-500 to-purple-600',
            progress: Math.min(100, (contacts.length / 100) * 100)
          },
          {
            titleKey: 'appointments',
            value: todayAppointments.toString(),
            ...calculateChange(todayAppointments, 'count'),
            icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: 'from-pink-500 to-pink-600',
            progress: Math.min(100, (todayAppointments / 20) * 100)
          },
          {
            titleKey: 'successRate',
            value: deals.length > 0 ? `${Math.round((closedDeals.length / deals.length) * 100)}%` : '0%',
            change: '+2.1%',
            trend: 'up',
            icon: <Handshake className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: 'from-indigo-500 to-indigo-600',
            progress: deals.length > 0 ? (closedDeals.length / deals.length) * 100 : 0
          }
        ];

        setStats(realStats);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to empty stats
        setStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`grid ${getResponsiveClasses('cards', 'stats')} ${spacingResponsive.gapSmall}`}>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`bg-white/90 backdrop-blur-xl rounded-2xl ${componentSizes.card.small} shadow-lg border border-white/20 animate-pulse`}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${getResponsiveClasses('cards', 'stats')} ${spacingResponsive.gapSmall}`}>
      {stats.map((stat, index) => (
        <div
          key={stat.titleKey}
          className={`bg-white/90 backdrop-blur-xl rounded-2xl ${componentSizes.card.small} shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in group`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Icon with gradient background */}
          <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${stat.color} text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            {stat.icon}
          </div>
          
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
            {safeNestedTranslate(t, appContent.stats, stat.titleKey as string, String(stat.titleKey))}
          </h3>
          
          {/* Value */}
          <div className="flex items-end justify-between">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</span>
            
            {/* Trend indicator */}
            <div className={`flex items-center space-x-1 ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{stat.change}</span>
            </div>
          </div>
          
          {/* Progress bar based on actual data */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
              style={{ width: `${stat.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}