import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

export function ProgressCard() {
  const { t } = useTranslation();
  
  const progressData = [
    { day: 'M', value: 20, isToday: false },
    { day: 'T', value: 35, isToday: false },
    { day: 'W', value: 45, isToday: false },
    { day: 'T', value: 60, isToday: false },
    { day: 'F', value: 85, isToday: true },
    { day: 'S', value: 0, isToday: false },
    { day: 'S', value: 0, isToday: false },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{t(appContent.stats.progress)}</h3>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-2">6.1h</div>
        <div className="text-gray-600">
          <span className="font-medium">{t(appContent.stats.workTime)}</span>
          <br />
          <span className="text-sm">{t(appContent.stats.thisWeek)}</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between space-x-2 mb-4">
        {progressData.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="relative">
              <div className="w-6 h-20 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`w-full rounded-full transition-all duration-500 ${
                    item.isToday ? 'bg-amber-400' : 'bg-gray-300'
                  }`}
                  style={{ 
                    height: `${item.value}%`,
                    marginTop: `${100 - item.value}%`
                  }}
                />
              </div>
              {item.isToday && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-400 text-white text-xs px-2 py-1 rounded-lg">
                  5h 25m
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}