import React from 'react';
import { MapPin, Bed, Bath, Square, Calendar, Eye } from 'lucide-react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Under Contract': return 'bg-amber-100 text-amber-800';
      case 'Sold': return 'bg-blue-100 text-blue-800';
      case 'Rented': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="card-gradient rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105"
      onClick={() => onClick(property)}
    >
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${property.price.toLocaleString()}
        </div>
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
          <Eye className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
          )}
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Listed {new Date(property.listingDate).toLocaleDateString()}</span>
          </div>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {property.propertyType}
          </span>
        </div>
      </div>
    </div>
  );
}