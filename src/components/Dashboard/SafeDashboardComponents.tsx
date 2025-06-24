import React, { Suspense } from 'react';
import { SafeRender } from '../../utils/safeRender';
import { LiveStatsCards } from './LiveStatsCards';
import { TaskProgress } from './TaskProgress';
import { CalendarWidget } from './CalendarWidget';
import { ProgressCard } from './ProgressCard';
import { TimeTracker } from './TimeTracker';

// Loading fallbacks
const LoadingCard = ({ title }: { title: string }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded mb-4"></div>
    <div className="h-8 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 rounded"></div>
  </div>
);

const ErrorFallback = ({ componentName }: { componentName: string }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-medium text-red-800">{componentName} Unavailable</h3>
        <p className="text-xs text-red-600">This component is temporarily disabled</p>
      </div>
    </div>
  </div>
);

// Safe wrapper components
export const SafeLiveStatsCards: React.FC = () => (
  <SafeRender 
    componentName="LiveStatsCards"
    fallback={<ErrorFallback componentName="Stats Cards" />}
  >
    <Suspense fallback={<LoadingCard title="Loading Stats..." />}>
      <LiveStatsCards />
    </Suspense>
  </SafeRender>
);

export const SafeTaskProgress: React.FC = () => (
  <SafeRender 
    componentName="TaskProgress"
    fallback={<ErrorFallback componentName="Task Progress" />}
  >
    <Suspense fallback={<LoadingCard title="Loading Tasks..." />}>
      <TaskProgress />
    </Suspense>
  </SafeRender>
);

export const SafeCalendarWidget: React.FC = () => (
  <SafeRender 
    componentName="CalendarWidget"
    fallback={<ErrorFallback componentName="Calendar" />}
  >
    <Suspense fallback={<LoadingCard title="Loading Calendar..." />}>
      <CalendarWidget />
    </Suspense>
  </SafeRender>
);

export const SafeProgressCard: React.FC = () => (
  <SafeRender 
    componentName="ProgressCard"
    fallback={<ErrorFallback componentName="Progress Card" />}
  >
    <Suspense fallback={<LoadingCard title="Loading Progress..." />}>
      <ProgressCard />
    </Suspense>
  </SafeRender>
);

export const SafeTimeTracker: React.FC = () => (
  <SafeRender 
    componentName="TimeTracker"
    fallback={<ErrorFallback componentName="Time Tracker" />}
  >
    <Suspense fallback={<LoadingCard title="Loading Time Tracker..." />}>
      <TimeTracker />
    </Suspense>
  </SafeRender>
); 