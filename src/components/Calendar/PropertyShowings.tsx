import React from 'react';
import { Calendar, Clock, User, Star } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

const PropertyShowings: React.FC = () => {
  const { t } = useTranslation();
  const showings = [
    {
      id: 'SHOW-001',
      propertyAddress: '123 Oak Street, Downtown',
      date: '2024-01-29',
      time: '14:00',
      client: { name: 'John & Sarah Miller' },
      agent: 'Sarah Johnson',
      status: 'confirmed'
    },
    {
      id: 'SHOW-002',
      propertyAddress: '456 Pine Avenue, Suburbs',
      date: '2024-01-29',
      time: '10:00',
      client: { name: 'David Chen' },
      agent: 'Mike Chen',
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">{t(appContent.deals.calendarSchedulingTitle)}</h3>
        <p className="text-gray-600">{t(appContent.deals.calendarSchedulingSubtitle)}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900">
            Showings ({showings.length})
          </h4>
        </div>
        <div className="divide-y divide-gray-100">
          {showings.map((showing) => (
            <div key={showing.id} className="p-6">
              <div className="flex items-center space-x-3 mb-2">
                <h5 className="font-semibold text-gray-900">{showing.propertyAddress}</h5>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(showing.status)}`}>
                  {showing.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{showing.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{showing.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{showing.client.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>{showing.agent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyShowings; 