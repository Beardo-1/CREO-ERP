import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Settings, Square, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface TimeSession {
  startTime: number;
  endTime?: number;
  duration: number;
  date: string;
}

export function TimeTracker() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [totalTimeToday, setTotalTimeToday] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update timer when running
  useEffect(() => {
    if (isRunning && sessionStartTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setCurrentTime(elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, sessionStartTime]);

  const loadSavedData = () => {
    try {
      const today = new Date().toDateString();
      const savedSessions = localStorage.getItem('creo_time_sessions');
      const currentSession = localStorage.getItem('creo_current_session');
      
      if (savedSessions) {
        const sessions: TimeSession[] = JSON.parse(savedSessions);
        const todaySessions = sessions.filter(session => session.date === today);
        const totalSeconds = todaySessions.reduce((total, session) => total + session.duration, 0);
        setTotalTimeToday(totalSeconds);
      }

      // Check if there's an active session
      if (currentSession) {
        const session = JSON.parse(currentSession);
        if (session.isRunning) {
          setIsRunning(true);
          setSessionStartTime(session.startTime);
          const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
          setCurrentTime(elapsed);
        }
      }
    } catch (error) {
      console.error('Error loading time tracker data:', error);
    }
  };

  const saveCurrentSession = (running: boolean, startTime: number | null) => {
    try {
      const sessionData = {
        isRunning: running,
        startTime: startTime,
        lastUpdate: Date.now()
      };
      localStorage.setItem('creo_current_session', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error saving current session:', error);
    }
  };

  const saveCompletedSession = (duration: number) => {
    try {
      const today = new Date().toDateString();
      const savedSessions = localStorage.getItem('creo_time_sessions');
      const sessions: TimeSession[] = savedSessions ? JSON.parse(savedSessions) : [];
      
      const newSession: TimeSession = {
        startTime: sessionStartTime!,
        endTime: Date.now(),
        duration: duration,
        date: today
      };
      
      sessions.push(newSession);
      localStorage.setItem('creo_time_sessions', JSON.stringify(sessions));
      
      // Update total time for today
      setTotalTimeToday(prev => prev + duration);
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('timeTracked', { 
        detail: { duration, totalToday: totalTimeToday + duration }
      }));
    } catch (error) {
      console.error('Error saving completed session:', error);
    }
  };

  const handleStart = () => {
    const now = Date.now();
    setIsRunning(true);
    setSessionStartTime(now);
    setCurrentTime(0);
    saveCurrentSession(true, now);
  };

  const handlePause = () => {
    if (sessionStartTime && currentTime > 0) {
      saveCompletedSession(currentTime);
    }
    setIsRunning(false);
    setSessionStartTime(null);
    setCurrentTime(0);
    localStorage.removeItem('creo_current_session');
  };

  const handleStop = () => {
    if (sessionStartTime && currentTime > 0) {
      saveCompletedSession(currentTime);
    }
    setIsRunning(false);
    setSessionStartTime(null);
    setCurrentTime(0);
    localStorage.removeItem('creo_current_session');
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionStartTime(null);
    setCurrentTime(0);
    localStorage.removeItem('creo_current_session');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Time Tracker</h3>
        <div className="text-sm text-gray-600">
          Today: {formatDuration(totalTimeToday + (isRunning ? currentTime : 0))}
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 transition-colors ${
          isRunning ? 'text-green-600' : 'text-gray-900'
        }`}>
          {formatTime(currentTime)}
        </div>
        <p className="text-gray-600">
          {isRunning ? 'Session Running' : 'Current Session'}
        </p>
        {isRunning && (
          <div className="mt-2">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Recording</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center space-x-3">
        {!isRunning ? (
          <button 
            onClick={handleStart}
            className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
            title="Start Timer"
          >
            <Play className="w-5 h-5 text-white ml-0.5" />
          </button>
        ) : (
          <button 
            onClick={handlePause}
            className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
            title="Pause Timer"
          >
            <Pause className="w-5 h-5 text-white" />
          </button>
        )}
        
        <button 
          onClick={handleStop}
          disabled={!isRunning && currentTime === 0}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg disabled:hover:scale-100"
          title="Stop Timer"
        >
          <Square className="w-4 h-4 text-white" />
        </button>
        
        <button 
          onClick={handleReset}
          disabled={isRunning}
          className="w-12 h-12 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg disabled:hover:scale-100"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="w-12 h-12 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {showSettings && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-10">
          <h4 className="font-semibold text-gray-900 mb-3">Time Tracker Settings</h4>
          <div className="space-y-3">
            <button 
              onClick={() => {
                localStorage.removeItem('creo_time_sessions');
                setTotalTimeToday(0);
                setShowSettings(false);
              }}
              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All Time Data
            </button>
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}
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