import React, { useState, useEffect } from 'react';
import { Zap, Home, Users, Handshake, DollarSign } from 'lucide-react';
import { CreoLogo } from './Logo/CreoLogo';
import { useTranslation } from '../contexts/TranslationContext';
import { appContent } from '../content/app.content';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = [
    { icon: Zap, text: t(appContent.loading.initializingCreo), color: "text-orange-500" },
    { icon: Home, text: t(appContent.loading.loadingProperties), color: "text-blue-500" },
    { icon: Users, text: t(appContent.loading.connectingContacts), color: "text-green-500" },
    { icon: Handshake, text: t(appContent.loading.syncingDeals), color: "text-purple-500" },
    { icon: DollarSign, text: t(appContent.loading.preparingDashboard), color: "text-amber-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1));
        
        if (newProgress >= 100) {
          setIsComplete(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 1000);
          clearInterval(interval);
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete, loadingSteps.length]);

  const CurrentIcon = loadingSteps[currentStep]?.icon || Zap;

  return (
    <div className="fixed inset-0 gradient-bg-professional flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-beige-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gray-300 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-orange-200 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="text-center z-10 max-w-md mx-auto px-8">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-gentle">
            <CreoLogo size={64} color="white" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="mb-12 animate-fade-in-delay">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-sm animate-slide-up">
            {t(appContent.loading.welcomeTitle)}
          </h1>
          <p className="text-xl text-gray-700 drop-shadow-sm animate-slide-up delay-300">
            {t(appContent.loading.welcomeSubtitle)}
          </p>
        </div>

        {/* Loading Animation */}
        <div className="mb-8 animate-scale-in delay-500">
          <div className="relative">
            {/* Current Step Icon */}
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CurrentIcon className={`w-8 h-8 ${loadingSteps[currentStep]?.color || 'text-orange-500'} animate-pulse`} />
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 mb-4 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              </div>
            </div>

            {/* Progress Text */}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
              <span className="animate-fade-in">
                {loadingSteps[currentStep]?.text || t(appContent.loading.loading)}
              </span>
              <span className="font-semibold animate-fade-in">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Loading Steps Indicators */}
        <div className="flex justify-center space-x-3 mb-8 animate-fade-in delay-700">
          {loadingSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/30 backdrop-blur-sm scale-110 shadow-lg' 
                    : isCompleted 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-white/10 backdrop-blur-sm'
                }`}
              >
                <StepIcon 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? step.color + ' animate-pulse' 
                      : isCompleted 
                      ? 'text-green-500' 
                      : 'text-gray-400'
                  }`} 
                />
              </div>
            );
          })}
        </div>

        {/* Completion Animation */}
        {isComplete && (
          <div className="animate-scale-in">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 animate-fade-in">
              {t(appContent.loading.readyToGo)}
            </p>
          </div>
        )}

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-gray-400 rounded-full animate-float delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-orange-300 rounded-full animate-float delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-gray-300 rounded-full animate-float delay-500"></div>
        </div>
      </div>
    </div>
  );
} 