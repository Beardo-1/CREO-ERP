import React from 'react';
import { PropertyCard } from './PropertyCard';
import { mockProperties } from '../../data/mockData';
import { Property } from '../../types';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

const ActiveListings: React.FC = () => {
  const { t } = useTranslation();
  const activeProperties = mockProperties.filter(property => property.status === 'Available');

  const handlePropertyClick = (property: Property) => {
    console.log('Property clicked:', property);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{t(appContent.properties.activeListings)}</h3>
          <p className="text-gray-600">{activeProperties.length} {t(appContent.properties.properties).toLowerCase()}</p>
        </div>
        <div className="flex space-x-4">
          <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
            <option>All Types</option>
            <option>{t(appContent.properties.villa)}</option>
            <option>{t(appContent.properties.apartment)}</option>
            <option>{t(appContent.properties.office)}</option>
          </select>
          <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
            <option>{t(appContent.properties.price)} Range</option>
            <option>Under $500K</option>
            <option>$500K - $1M</option>
            <option>Over $1M</option>
          </select>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
            {t(appContent.properties.addProperty)}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={handlePropertyClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveListings; 