import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface TimeSession {
  startTime: number;
  endTime?: number;
  duration: number;
  date: string;
}

interface DayProgress {
  day: string;
  fullDay: string;
  value: number;
  duration: number;
  isToday: boolean;
  isWeekend: boolean;
}

export function ProgressCard() {
  const { t } = useTranslation();
  const [weeklyData, setWeeklyData] = useState<DayProgress[]>([]);
  const [totalWeeklyTime, setTotalWeeklyTime] = useState(0);
  const [weeklyTarget] = useState(40 * 3600); // 40 hours in seconds
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadWeeklyData();
    
    // Listen for time tracker updates
    const handleTimeTracked = () => {
      loadWeeklyData();
    };
    
    window.addEventListener('timeTracked', handleTimeTracked);
    
    return () => {
      window.removeEventListener('timeTracked', handleTimeTracked);
    };
  }, []);

  const loadWeeklyData = () => {
    try {
      const savedSessions = localStorage.getItem('creo_time_sessions');
      const sessions: TimeSession[] = savedSessions ? JSON.parse(savedSessions) : [];
      
      // Get current week dates
      const today = new Date();
      const currentDay = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - currentDay + 1);
      
      const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      const weeklyProgress: DayProgress[] = weekDays.map((day, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        const dateString = date.toDateString();
        
        // Calculate total time for this day
        const daySessions = sessions.filter(session => session.date === dateString);
        const totalSeconds = daySessions.reduce((total, session) => total + session.duration, 0);
        
        // Add current session time if it's today and timer is running
        let currentSessionTime = 0;
        if (dateString === today.toDateString()) {
          const currentSession = localStorage.getItem('creo_current_session');
          if (currentSession) {
            const session = JSON.parse(currentSession);
            if (session.isRunning) {
              currentSessionTime = Math.floor((Date.now() - session.startTime) / 1000);
            }
          }
        }
        
        const totalTimeWithCurrent = totalSeconds + currentSessionTime;
        const maxDailyHours = 10; // 10 hours max for visualization
        const percentage = Math.min((totalTimeWithCurrent / (maxDailyHours * 3600)) * 100, 100);
        
        return {
          day,
          fullDay: fullDays[index],
          value: percentage,
          duration: totalTimeWithCurrent,
          isToday: dateString === today.toDateString(),
          isWeekend: index >= 5
        };
      });
      
      setWeeklyData(weeklyProgress);
      
      // Calculate total weekly time
      const totalWeekly = weeklyProgress.reduce((total, day) => total + day.duration, 0);
      setTotalWeeklyTime(totalWeekly);
      
    } catch (error) {
      console.error('Error loading weekly data:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeShort = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  const getProgressColor = (isToday: boolean, value: number, isWeekend: boolean) => {
    if (isToday) return 'bg-amber-400';
    if (isWeekend) return 'bg-blue-300';
    if (value > 80) return 'bg-green-400';
    if (value > 50) return 'bg-yellow-400';
    if (value > 20) return 'bg-orange-400';
    return 'bg-gray-300';
  };

  const weeklyProgress = totalWeeklyTime > 0 ? (totalWeeklyTime / weeklyTarget) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{t(appContent.stats.progress)}</h3>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-gray-400" />
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Calendar className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatTime(totalWeeklyTime)}
        </div>
        <div className="text-gray-600">
          <span className="font-medium">{t(appContent.stats.workTime)}</span>
          <br />
          <span className="text-sm">{t(appContent.stats.thisWeek)}</span>
        </div>
        
        {/* Weekly Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Weekly Target</span>
            <span>{Math.round(weeklyProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                weeklyProgress >= 100 ? 'bg-green-500' : 
                weeklyProgress >= 75 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {totalWeeklyTime < weeklyTarget ? formatTime(weeklyTarget - totalWeeklyTime) + ' remaining' : 'Target achieved!'}
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between space-x-2 mb-4">
        {weeklyData.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div className="relative w-full">
              <div className="w-6 h-20 bg-gray-100 rounded-full overflow-hidden mx-auto">
                <div 
                  className={`w-full rounded-full transition-all duration-500 ${
                    getProgressColor(item.isToday, item.value, item.isWeekend)
                  }`}
                  style={{ 
                    height: `${item.value}%`,
                    marginTop: `${100 - item.value}%`
                  }}
                />
              </div>
              {item.isToday && item.duration > 0 && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-400 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                  {formatTimeShort(item.duration)}
                </div>
              )}
              {!item.isToday && item.duration > 3600 && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                  {formatTimeShort(item.duration)}
                </div>
              )}
            </div>
            <span className={`text-xs font-medium ${
              item.isToday ? 'text-amber-600' : 
              item.isWeekend ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {item.day}
            </span>
          </div>
        ))}
      </div>

      {/* Productivity Insights */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-sm font-semibold text-gray-900">
            {weeklyData.filter(d => d.duration > 0).length}
          </div>
          <div className="text-xs text-gray-600">Active Days</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-sm font-semibold text-gray-900">
            {weeklyData.length > 0 ? formatTimeShort(totalWeeklyTime / weeklyData.filter(d => d.duration > 0).length || 0) : '0m'}
          </div>
          <div className="text-xs text-gray-600">Avg/Day</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-sm font-semibold text-gray-900">
            {Math.max(...weeklyData.map(d => d.duration)) > 0 ? formatTimeShort(Math.max(...weeklyData.map(d => d.duration))) : '0m'}
          </div>
          <div className="text-xs text-gray-600">Best Day</div>
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-10">
          <h4 className="font-semibold text-gray-900 mb-3">Weekly Breakdown</h4>
          <div className="space-y-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getProgressColor(day.isToday, day.value, day.isWeekend)}`} />
                  <span className={`font-medium ${day.isToday ? 'text-amber-600' : 'text-gray-700'}`}>
                    {day.fullDay}
                  </span>
                  {day.isToday && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Today</span>}
                </div>
                <span className="text-sm text-gray-600">
                  {day.duration > 0 ? formatTime(day.duration) : 'No time logged'}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="w-full mt-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}