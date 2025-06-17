import React from 'react';
import { TrendingUp, TrendingDown, Home, Users, DollarSign, Calendar, Target, Award } from 'lucide-react';
import { getResponsiveClasses, spacingResponsive, componentSizes } from '../../utils/responsive';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface StatCard {
  titleKey: keyof typeof appContent.stats;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

export function LiveStatsCards() {
  const { t } = useTranslation();
  
  const stats: StatCard[] = [
    {
      titleKey: 'totalProperties',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: <Home className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      titleKey: 'activeDeals',
      value: '89',
      change: '+8.2%',
      trend: 'up',
      icon: <Target className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      titleKey: 'totalRevenue',
      value: '$2.4M',
      change: '+15.3%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500'
    },
    {
      titleKey: 'newClients',
      value: '156',
      change: '+23.1%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      titleKey: 'appointments',
      value: '24',
      change: '-5.2%',
      trend: 'down',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600'
    },
    {
      titleKey: 'successRate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: <Award className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

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
            <div className="w-5 h-5 sm:w-6 sm:h-6">
            {stat.icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">{t(appContent.stats[stat.titleKey])}</h3>
          
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
          
          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
              style={{ 
                width: `${Math.random() * 40 + 60}%`,
                animationDelay: `${index * 0.2}s`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
} 