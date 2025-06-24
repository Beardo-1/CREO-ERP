import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { safeNestedTranslate } from '../../utils/translationHelpers';

export function CalendarWidget() {
  const { t } = useTranslation();
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  const meetings = [
    {
      id: 1,
      titleKey: 'weeklyTeamSync' as const,
      subtitleKey: 'discussProgress' as const,
      time: '8:00 am',
      attendees: [
        "",
        "",
        ""
      ]
    },
    {
      id: 2,
      titleKey: 'onboardingSession' as const,
      subtitleKey: 'introductionNewHires' as const,
      time: '10:00 am',
      attendees: [
        "",
        ""
      ]
    }
  ];

  const weekDays = [
    { key: 'mon' as const, short: 'Mon' },
    { key: 'tue' as const, short: 'Tue' },
    { key: 'wed' as const, short: 'Wed' },
    { key: 'thu' as const, short: 'Thu' },
    { key: 'fri' as const, short: 'Fri' },
    { key: 'sat' as const, short: 'Sat' }
  ];
  const dates = [22, 23, 24, 25, 26, 27];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">{t(appContent.calendar.august)}</div>
          <div className="text-sm text-gray-500">{t(appContent.calendar.september)} 2024</div>
          <div className="text-sm text-gray-500">{t(appContent.calendar.october)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-3 mb-4">
        {weekDays.map((day, index) => (
          <div key={day.key} className="text-center">
            <div className="text-xs text-gray-500 mb-2">
              {safeNestedTranslate(t, appContent.calendar, day.key, day.short)}
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
              index === 2 ? 'bg-gray-900 text-white' : 'text-gray-700'
            }`}>
              {dates[index]}
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
            <div className="text-sm font-medium text-gray-600">{meeting.time}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {safeNestedTranslate(t, appContent.calendar, meeting.titleKey, String(meeting.titleKey))}
              </div>
              <div className="text-sm text-gray-600">
                {safeNestedTranslate(t, appContent.calendar, meeting.subtitleKey, String(meeting.subtitleKey))}
              </div>
            </div>
            <div className="flex -space-x-2">
              {meeting.attendees.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt=""
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}