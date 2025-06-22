import React, { useState } from 'react';
import { Search, Settings, User, Menu, X } from 'lucide-react';
import { NotificationSystem } from '../Notifications/NotificationSystem';
import { headerContent } from './Header.content';
import { useTranslation } from '../../contexts/TranslationContext';
import { spacingResponsive, textResponsive, visibility } from '../../utils/responsive';

interface HeaderProps {
  activeTab: string;
  userName: string;
  onMobileMenuToggle?: () => void;
  onTabChange?: (tab: string) => void;
}

export function Header({ activeTab, userName, onMobileMenuToggle, onTabChange }: HeaderProps) {
  const { currentLanguage, toggleLanguage, t } = useTranslation();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const getPageTitle = (tab: string) => {
    const titles = headerContent.pageTitles as Record<string, { en: string; ar: string }>;
    return titles[tab] ? t(titles[tab]) : t(titles.dashboard);
  };

  const getPageDescription = (tab: string) => {
    const descriptions = headerContent.pageDescriptions as Record<string, { en: string; ar: string }>;
    return descriptions[tab] ? t(descriptions[tab]) : t(descriptions.dashboard);
  };

  return (
    <header className="header-gradient border-b border-white/20 px-4 lg:px-6 py-3 relative shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo/Title + Mobile Menu */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={onMobileMenuToggle}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Title Section */}
          <div className="flex items-center">
        <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 animate-fade-in truncate">
            {t(headerContent.greeting)}
          </h2>
              <p className="text-xs text-gray-600 animate-fade-in-delay hidden md:block truncate">
            {getPageDescription(activeTab)}
          </p>
            </div>
          </div>
        </div>
        
        {/* Center Section - Search Bar (Desktop Only) */}
        <div className={`${visibility.desktopOnly} flex-1 max-w-md mx-8`}>
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              placeholder={t(headerContent.searchPlaceholder)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:shadow-md hover:bg-white/90"
            />
          </div>
          </div>
          
                {/* Right Section - Actions - Single Horizontal Row */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Search Toggle - Only on Mobile */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* 1. Notifications */}
          <NotificationSystem />
          
          {/* 2. Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 shadow-lg backdrop-blur-sm border border-white/30 cursor-pointer focus:outline-none flex items-center justify-center"
            aria-label={`Switch to ${currentLanguage === 'en' ? 'Arabic' : 'English'}`}
            title={`Switch to ${currentLanguage === 'en' ? 'العربية' : 'English'}`}
          >
            <span className="text-xs sm:text-sm font-bold text-white">
              {currentLanguage === 'en' ? 'EN' : 'ع'}
            </span>
          </button>
          
          {/* 3. Settings - Hidden on Mobile */}
          <button 
            onClick={() => onTabChange && onTabChange('settings')}
            className="hidden sm:flex w-10 h-10 items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {/* 4. Account - Responsive */}
          <div 
            onClick={() => onTabChange && onTabChange('profile')}
            className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-xl px-2 py-1.5 hover:bg-white/70 transition-all duration-300 cursor-pointer group border border-white/20 h-8 sm:h-10"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="hidden xl:flex xl:flex-col xl:justify-center">
              <p className="text-xs font-semibold text-gray-900 leading-tight">{userName}</p>
              <p className="text-xs text-gray-500 leading-tight">{t(headerContent.userRole)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className={`${visibility.mobileAndTablet} mt-3 animate-fade-in`}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t(headerContent.searchPlaceholder)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-300"
            />
          </div>
        </div>
      )}
    </header>
  );
}