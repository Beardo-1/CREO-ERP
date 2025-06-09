import React from 'react';

export function CalendarWidget() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  const meetings = [
    {
      id: 1,
      title: 'Weekly Team Sync',
      subtitle: 'Discuss progress on projects',
      time: '8:00 am',
      attendees: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=100'
      ]
    },
    {
      id: 2,
      title: 'Onboarding Session',
      subtitle: 'Introduction for new hires',
      time: '10:00 am',
      attendees: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
      ]
    }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [22, 23, 24, 25, 26, 27];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-500">August</div>
          <div className="text-sm text-gray-500">September 2024</div>
          <div className="text-sm text-gray-500">October</div>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-4 mb-6">
        {weekDays.map((day, index) => (
          <div key={day} className="text-center">
            <div className="text-xs text-gray-500 mb-2">{day}</div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
              index === 2 ? 'bg-gray-900 text-white' : 'text-gray-700'
            }`}>
              {dates[index]}
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
            <div className="text-sm font-medium text-gray-600">{meeting.time}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{meeting.title}</div>
              <div className="text-sm text-gray-600">{meeting.subtitle}</div>
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