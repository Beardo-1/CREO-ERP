import React, { useState, useEffect } from 'react';
import { PropertyCard } from './PropertyCard';
import { Property } from '../../types';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, MapPin, Bed, Bath, Square, Calendar, DollarSign, X, Upload, Image, Building } from 'lucide-react';
import { unifiedDataService } from '../../services/unifiedDataService';

interface NewProperty {
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  yearBuilt?: number;
  description: string;
  amenities: string[];
  images: string[];
  status: string;
  listingDate: string;
  agent: string;
}

const ActiveListings: React.FC = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [newProperty, setNewProperty] = useState<NewProperty>({
    title: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'Residential',
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 0,
    lotSize: 0,
    yearBuilt: new Date().getFullYear(),
    description: '',
    amenities: [],
    images: [],
    status: 'Available',
    listingDate: new Date().toISOString().split('T')[0],
    agent: 'Current Agent'
  });

  // Load properties from dataService
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const loadedProperties = await unifiedDataService.getProperties();
        // Ensure we have an array
        const safeProperties = Array.isArray(loadedProperties) ? loadedProperties : [];
        setProperties(safeProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
        setProperties([]);
      }
    };

    loadProperties();

    // Subscribe to property changes
    const handlePropertyChange = (updatedProperties: Property[]) => {
      const safeProperties = Array.isArray(updatedProperties) ? updatedProperties : [];
      setProperties(safeProperties);
    };

    unifiedDataService.subscribe('propertiesChanged', handlePropertyChange);

    return () => {
      unifiedDataService.unsubscribe('propertiesChanged', handlePropertyChange);
    };
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  const handleAddProperty = () => {
    setShowAddModal(true);
  };

  const handleCreateProperty = async () => {
    if (newProperty.title && newProperty.address && newProperty.price > 0) {
      try {
        const property: Omit<Property, 'id'> = {
          title: newProperty.title,
          address: newProperty.address,
          city: newProperty.city,
          state: newProperty.state,
          zipCode: newProperty.zipCode,
          propertyType: newProperty.propertyType as 'Residential' | 'Commercial' | 'Land' | 'Rental',
          price: newProperty.price,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms,
          squareFeet: newProperty.squareFeet,
          lotSize: newProperty.lotSize || 0,
          yearBuilt: newProperty.yearBuilt || new Date().getFullYear(),
          description: newProperty.description,
          features: newProperty.amenities,
          images: newProperty.images.length > 0 ? newProperty.images : [],
          status: newProperty.status === 'Pending' ? 'Under Contract' : newProperty.status as 'Available' | 'Sold' | 'Rented',
          listingDate: newProperty.listingDate,
          agentId: newProperty.agent
        };
        
        // Save to dataService
        unifiedDataService.addProperty(property as Property);
        
        // Reset form
        setNewProperty({
          title: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          propertyType: 'Residential',
          price: 0,
          bedrooms: 1,
          bathrooms: 1,
          squareFeet: 0,
          lotSize: 0,
          yearBuilt: new Date().getFullYear(),
          description: '',
          amenities: [],
          images: [],
          status: 'Available',
          listingDate: new Date().toISOString().split('T')[0],
          agent: 'Current Agent'
        });
        setShowAddModal(false);
        // Success: Property added successfully!
      } catch (error) {
        console.error('Error creating property:', error);
        // Success: Error creating property. Please try again.
      }
    } else {
      // Success: Please fill in all required fields
    }
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setNewProperty({
      title: property.title,
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      propertyType: property.propertyType,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      squareFeet: property.squareFeet,
      lotSize: property.lotSize || 0,
      yearBuilt: property.yearBuilt || new Date().getFullYear(),
      description: property.description,
      amenities: property.features || [],
      images: property.images,
      status: property.status,
      listingDate: property.listingDate,
      agent: property.agentId
    });
    setShowEditModal(true);
    setShowDetailsModal(false);
  };

  const handleUpdateProperty = async () => {
    if (selectedProperty && newProperty.title && newProperty.address && newProperty.price > 0) {
      try {
        const updatedProperty: Partial<Property> = {
          title: newProperty.title,
          address: newProperty.address,
          city: newProperty.city,
          state: newProperty.state,
          zipCode: newProperty.zipCode,
          propertyType: newProperty.propertyType as 'Residential' | 'Commercial' | 'Land' | 'Rental',
          price: newProperty.price,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms,
          squareFeet: newProperty.squareFeet,
          lotSize: newProperty.lotSize || 0,
          yearBuilt: newProperty.yearBuilt || new Date().getFullYear(),
          description: newProperty.description,
          features: newProperty.amenities,
          images: newProperty.images,
          status: newProperty.status === 'Pending' ? 'Under Contract' : newProperty.status as 'Available' | 'Sold' | 'Rented',
          listingDate: newProperty.listingDate,
          agentId: newProperty.agent
        };
        
        // Update in dataService
        unifiedDataService.updateProperty(selectedProperty.id, updatedProperty);
        
        setShowEditModal(false);
        setSelectedProperty(null);
        // Success: Property updated successfully!
      } catch (error) {
        console.error('Error updating property:', error);
        // Success: Error updating property. Please try again.
      }
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // Delete from dataService
        unifiedDataService.deleteProperty(propertyId);
        
        setShowDetailsModal(false);
        setSelectedProperty(null);
        // Success: Property deleted successfully!
      } catch (error) {
        console.error('Error deleting property:', error);
        // Success: Error deleting property. Please try again.
      }
    }
  };

  const addAmenity = (amenity: string) => {
    if (amenity.trim() && !newProperty.amenities.includes(amenity.trim())) {
      setNewProperty({
        ...newProperty,
        amenities: [...newProperty.amenities, amenity.trim()]
      });
    }
  };

  const removeAmenity = (amenity: string) => {
    setNewProperty({
      ...newProperty,
      amenities: newProperty.amenities.filter(a => a !== amenity)
    });
  };

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || property.propertyType.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'all' || property.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{t(appContent.properties.activeListings)}</h3>
            <p className="text-gray-600">{filteredProperties.length} active {t(appContent.properties.properties).toLowerCase()}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              />
            </div>
            
            {/* Type Filter */}
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
              <option value="rental">Rental</option>
            </select>
            
            {/* Status Filter */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="under contract">Under Contract</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
            
            {/* Export Button */}
            <button 
              onClick={() => {
                // Implement export functionality
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            {/* Add Property Button */}
            <button 
              onClick={handleAddProperty}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t(appContent.properties.addProperty)}</span>
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search or filters, or add a new property.</p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Property Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'Available' ? 'bg-green-100 text-green-800' :
                      property.status === 'Under Contract' ? 'bg-yellow-100 text-yellow-800' :
                      property.status === 'Sold' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{property.title}</h3>
                    <span className="text-2xl font-bold text-amber-600">{formatPrice(property.price)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm truncate">{property.address}, {property.city}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span>{property.squareFeet.toLocaleString()} ft²</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handlePropertyClick(property)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button 
                      onClick={() => handleEditProperty(property)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Property Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Add New Property</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
                      <input
                        type="text"
                        value={newProperty.title}
                        onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Beautiful Family Home"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="123 Main Street"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={newProperty.city}
                          onChange={(e) => setNewProperty({...newProperty, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Springfield"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={newProperty.state}
                          onChange={(e) => setNewProperty({...newProperty, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="CA"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input
                          type="text"
                          value={newProperty.zipCode}
                          onChange={(e) => setNewProperty({...newProperty, zipCode: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="12345"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                        <select
                          value={newProperty.propertyType}
                          onChange={(e) => setNewProperty({...newProperty, propertyType: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Land">Land</option>
                          <option value="Rental">Rental</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Property Details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                      <input
                        type="number"
                        value={newProperty.price}
                        onChange={(e) => setNewProperty({...newProperty, price: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="500000"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                        <input
                          type="number"
                          value={newProperty.bedrooms}
                          onChange={(e) => setNewProperty({...newProperty, bedrooms: parseInt(e.target.value) || 1})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                        <input
                          type="number"
                          value={newProperty.bathrooms}
                          onChange={(e) => setNewProperty({...newProperty, bathrooms: parseInt(e.target.value) || 1})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                        <input
                          type="number"
                          value={newProperty.yearBuilt}
                          onChange={(e) => setNewProperty({...newProperty, yearBuilt: parseInt(e.target.value) || new Date().getFullYear()})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                        <input
                          type="number"
                          value={newProperty.squareFeet}
                          onChange={(e) => setNewProperty({...newProperty, squareFeet: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="2500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lot Size (sq ft)</label>
                        <input
                          type="number"
                          value={newProperty.lotSize}
                          onChange={(e) => setNewProperty({...newProperty, lotSize: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={newProperty.status}
                        onChange={(e) => setNewProperty({...newProperty, status: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="Available">Available</option>
                        <option value="Pending">Pending</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Describe the property features, location benefits, and unique selling points..."
                  />
                </div>
                
                {/* Amenities */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {newProperty.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{amenity}</span>
                        <button
                          onClick={() => removeAmenity(amenity)}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addAmenity(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Add amenity (e.g., Pool, Garage, Garden)"
                  />
                </div>
                
                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateProperty}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Create Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Property Details Modal */}
        {showDetailsModal && selectedProperty && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedProperty.title}</h3>
                  <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                      {selectedProperty.images && selectedProperty.images.length > 0 ? (
                        <img 
                          src={selectedProperty.images[0]} 
                          alt={selectedProperty.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Building className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-amber-600">{formatPrice(selectedProperty.price)}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedProperty.status === 'Available' ? 'bg-green-100 text-green-800' :
                          selectedProperty.status === 'Under Contract' ? 'bg-yellow-100 text-yellow-800' :
                          selectedProperty.status === 'Sold' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedProperty.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-2xl font-bold text-gray-900">{selectedProperty.bedrooms}</div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-2xl font-bold text-gray-900">{selectedProperty.bathrooms}</div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-2xl font-bold text-gray-900">{selectedProperty.squareFeet.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Sq Ft</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{selectedProperty.description}</p>
                    </div>
                    
                    {selectedProperty.features && selectedProperty.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.features.map((feature, index) => (
                            <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Property Type:</span>
                        <span className="ml-2 font-medium">{selectedProperty.propertyType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Year Built:</span>
                        <span className="ml-2 font-medium">{selectedProperty.yearBuilt}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Lot Size:</span>
                        <span className="ml-2 font-medium">{selectedProperty.lotSize?.toLocaleString() || 'N/A'} sq ft</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Listed:</span>
                        <span className="ml-2 font-medium">{new Date(selectedProperty.listingDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => handleEditProperty(selectedProperty)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Edit Property
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(selectedProperty.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Delete Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Property Modal */}
        {showEditModal && selectedProperty && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Edit Property</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
                      <input
                        type="text"
                        value={newProperty.title}
                        onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={newProperty.city}
                          onChange={(e) => setNewProperty({...newProperty, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={newProperty.state}
                          onChange={(e) => setNewProperty({...newProperty, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Property Details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                      <input
                        type="number"
                        value={newProperty.price}
                        onChange={(e) => setNewProperty({...newProperty, price: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={newProperty.status}
                        onChange={(e) => setNewProperty({...newProperty, status: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="Available">Available</option>
                        <option value="Pending">Pending</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateProperty}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Update Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveListings; 