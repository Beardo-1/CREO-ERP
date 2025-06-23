import React, { useState } from 'react';
import { Play, Pause, Settings } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

export function TimeTracker() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleSettings = () => {
    // Open settings modal or navigate to settings
    console.log('Opening time tracker settings');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracker</h3>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {Math.floor(time / 3600).toString().padStart(2, '0')}:
          {Math.floor((time % 3600) / 60).toString().padStart(2, '0')}:
          {(time % 60).toString().padStart(2, '0')}
        </div>
        <p className="text-gray-600">Current Session</p>
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <button 
          onClick={handleStart}
          disabled={isRunning}
          className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Play className="w-5 h-5 text-gray-600" />
        </button>
        <button 
          onClick={handlePause}
          disabled={!isRunning}
          className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Pause className="w-5 h-5 text-gray-600" />
        </button>
        <button 
          onClick={handleSettings}
          className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

function TrendingUp({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}