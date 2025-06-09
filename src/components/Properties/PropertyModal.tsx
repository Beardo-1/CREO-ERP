import React from 'react';
import { X, MapPin, Bed, Bath, Square, Calendar, User } from 'lucide-react';
import { Property } from '../../types';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {property.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.title} ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
          
          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                </div>
                
                <div className="flex items-center space-x-6">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center text-gray-600">
                      <Bed className="w-5 h-5 mr-2 text-gray-400" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Bath className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Square className="w-5 h-5 mr-2 text-gray-400" />
                  <span>{property.squareFeet.toLocaleString()} Square Feet</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  <span>Listed on {new Date(property.listingDate).toLocaleDateString()}</span>
                </div>
                
                {property.yearBuilt && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Year Built:</span>
                    <span>{property.yearBuilt}</span>
                  </div>
                )}
                
                {property.lotSize && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Lot Size:</span>
                    <span>{property.lotSize.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Status</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${property.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  ${Math.round(property.price / property.squareFeet).toLocaleString()}/sqft
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900">Status: </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === 'Available' ? 'bg-green-100 text-green-800' :
                    property.status === 'Under Contract' ? 'bg-yellow-100 text-yellow-800' :
                    property.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-900">Property Type: </span>
                  <span className="text-gray-600">{property.propertyType}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>
          
          {/* Features */}
          {property.features.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-8 flex space-x-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
              Schedule Showing
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-colors">
              Save to Favorites
            </button>
            <button className="px-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}