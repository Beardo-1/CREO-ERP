import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, Share2, Eye, Calendar } from 'lucide-react';
import { Property } from '../../types';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const { t } = useTranslation();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'under contract':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div 
      className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group animate-fade-in"
      onClick={() => onClick(property)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(property.status)}`}>
          {property.status}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Add to favorites functionality
              console.log('Adding property to favorites:', property.id);
            }}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Share property functionality
              if (navigator.share) {
                navigator.share({
                  title: property.title,
                  text: `Check out this property: ${property.title}`,
                  url: window.location.href
                });
              } else {
                // Fallback to clipboard
                navigator.clipboard.writeText(window.location.href);
                console.log('Property link copied to clipboard');
              }
            }}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
          >
            <Share2 className="w-4 h-4 text-gray-600 hover:text-blue-500" />
          </button>
        </div>
        
        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
          {formatPrice(property.price)}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-200">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bed className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t(appContent.properties.bedrooms)}</p>
              <p className="font-semibold text-gray-900">{property.bedrooms}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Bath className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t(appContent.properties.bathrooms)}</p>
              <p className="font-semibold text-gray-900">{property.bathrooms}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Square className="w-4 h-4 text-purple-600" />
            </div>
                         <div>
               <p className="text-xs text-gray-500">{t(appContent.properties.area)}</p>
               <p className="font-semibold text-gray-900">{property.squareFeet?.toLocaleString()}</p>
             </div>
           </div>
         </div>
         
         {/* Property Type and Date */}
         <div className="flex items-center justify-between mb-4">
           <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
             {property.propertyType}
           </span>
           <div className="flex items-center text-gray-500 text-xs">
             <Calendar className="w-3 h-3 mr-1" />
             <span>Listed {new Date(property.listingDate).toLocaleDateString()}</span>
           </div>
         </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            {t(appContent.properties.propertyDetails)}
          </button>
          <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors duration-200">
            <Eye className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}