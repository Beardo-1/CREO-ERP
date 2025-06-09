import React from 'react';
import { Play, Pause, Settings } from 'lucide-react';

export function TimeTracker() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Time tracker</h3>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#f3f4f6"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#fbbf24"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 50 * 0.65} ${2 * Math.PI * 50}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-gray-900">02:35</div>
          <div className="text-sm text-gray-600">Work Time</div>
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Play className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Pause className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
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