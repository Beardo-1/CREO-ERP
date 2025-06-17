import React from 'react';
import { componentSizes, textResponsive } from '../../utils/responsive';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface ProfileCardProps {
  name: string;
  role: string;
  earnings: string;
  profileImage?: string;
}

export function ProfileCard({ name, role, earnings, profileImage }: ProfileCardProps) {
  const { t } = useTranslation();
  
  return (
    <div className={`card-gradient rounded-3xl ${componentSizes.card.medium} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0">
          {profileImage ? (
            <img src={profileImage} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-sm sm:text-base lg:text-lg font-bold">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`${textResponsive.heading.h4} font-bold text-gray-900 truncate`}>{name}</h3>
          <p className={`${textResponsive.body.small} text-gray-600 truncate`}>{role}</p>
          <div className="mt-2 bg-amber-100 text-amber-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block">
            {earnings}
          </div>
        </div>
      </div>
      
              <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">{t(appContent.profile.commissionEarned)}</span>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{t(appContent.profile.activeListings)}</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{t(appContent.profile.closedDeals)}</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{t(appContent.profile.clientSatisfaction)}</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}