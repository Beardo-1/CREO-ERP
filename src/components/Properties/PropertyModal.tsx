import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Square, Calendar, DollarSign, Heart, Share2, Phone, Mail, Star, ChevronLeft, ChevronRight, Home, Car, Wifi, Shield, Zap, Trees } from 'lucide-react';
import { Property } from '../../types';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface PropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useTranslation();

  if (!isOpen) return null;

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const featureIcons: { [key: string]: React.ReactNode } = {
    'Parking': <Car className="w-4 h-4" />,
    'WiFi': <Wifi className="w-4 h-4" />,
    'Security': <Shield className="w-4 h-4" />,
    'Garden': <Trees className="w-4 h-4" />,
    'Electricity': <Zap className="w-4 h-4" />,
    'default': <Home className="w-4 h-4" />
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Image Gallery */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
            
            {/* Image Indicators */}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Status Badge */}
            <div className={`absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(property.status)}`}>
              {property.status}
            </div>
            
            {/* Price Badge */}
            <div className="absolute bottom-6 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg">
              {formatPrice(property.price)}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                </div>
                <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                  {property.propertyType}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 ml-6">
                <button className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors duration-200">
                  <Heart className="w-5 h-5 text-red-600" />
                </button>
                <button className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors duration-200">
                  <Share2 className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>
            
            {/* Property Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.propertyModal.propertyDetails)}</h3>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bed className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t(appContent.propertyModal.bedrooms)}</p>
                    <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Bath className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t(appContent.propertyModal.bathrooms)}</p>
                    <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Square className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t(appContent.propertyModal.squareFeet)}</p>
                    <p className="font-semibold text-gray-900">{property.squareFeet.toLocaleString()}</p>
                  </div>
                </div>
                
                {property.yearBuilt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t(appContent.propertyModal.yearBuilt)}</p>
                      <p className="font-semibold text-gray-900">{property.yearBuilt}</p>
                    </div>
                  </div>
                )}
                
                {property.lotSize && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Trees className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t(appContent.propertyModal.lotSize)}</p>
                      <p className="font-semibold text-gray-900">{property.lotSize.toLocaleString()} {t(appContent.propertyModal.sqFt)}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.propertyModal.featuresAmenities)}</h3>
                <div className="space-y-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        {featureIcons[feature] || featureIcons.default}
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.propertyModal.listingInformation)}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t(appContent.propertyModal.listedDate)}</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(property.listingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t(appContent.propertyModal.pricePerSqFt)}</p>
                      <p className="font-semibold text-gray-900">
                        ${Math.round(property.price / property.squareFeet)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.propertyModal.description)}</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                {t(appContent.propertyModal.scheduleViewing)}
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                {t(appContent.propertyModal.contactAgent)}
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                {t(appContent.propertyModal.downloadBrochure)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}