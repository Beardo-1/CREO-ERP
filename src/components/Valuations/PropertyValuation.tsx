import React, { useState } from 'react';
import { Calculator, MapPin, Home, TrendingUp, BarChart3, Plus, Search, Filter, Eye, Edit, Download } from 'lucide-react';

interface Valuation {
  id: string;
  propertyId: string;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  estimatedValue: number;
  marketValue: number;
  rentEstimate: number;
  valuationDate: string;
  method: 'CMA' | 'AVM' | 'Professional';
  status: 'pending' | 'completed' | 'expired';
  agent: string;
  comparables: Comparable[];
}

interface Comparable {
  id: string;
  address: string;
  soldPrice: number;
  soldDate: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  distance: string;
}

const mockValuations: Valuation[] = [
  {
    id: '1',
    propertyId: 'P001',
    address: '123 Oak Street, Downtown',
    propertyType: 'Single Family',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    lotSize: '0.25 acres',
    yearBuilt: 2015,
    estimatedValue: 485000,
    marketValue: 475000,
    rentEstimate: 2800,
    valuationDate: '2024-01-15',
    method: 'CMA',
    status: 'completed',
    agent: 'Emma Wilson',
    comparables: [
      {
        id: 'C1',
        address: '125 Oak Street',
        soldPrice: 465000,
        soldDate: '2024-01-10',
        sqft: 1800,
        bedrooms: 3,
        bathrooms: 2,
        distance: '0.1 miles'
      },
      {
        id: 'C2',
        address: '127 Maple Avenue',
        soldPrice: 495000,
        soldDate: '2024-01-05',
        sqft: 1900,
        bedrooms: 3,
        bathrooms: 2.5,
        distance: '0.2 miles'
      }
    ]
  },
  {
    id: '2',
    propertyId: 'P002',
    address: '456 Pine Avenue, Suburbs',
    propertyType: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    lotSize: 'N/A',
    yearBuilt: 2018,
    estimatedValue: 325000,
    marketValue: 320000,
    rentEstimate: 2200,
    valuationDate: '2024-01-12',
    method: 'AVM',
    status: 'completed',
    agent: 'John Smith',
    comparables: []
  }
];

export function PropertyValuation() {
  const [valuations, setValuations] = useState<Valuation[]>(mockValuations);
  const [selectedValuation, setSelectedValuation] = useState<Valuation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMethodColor = (method: string) => {
    const colors = {
      CMA: 'bg-blue-100 text-blue-800',
      AVM: 'bg-purple-100 text-purple-800',
      Professional: 'bg-green-100 text-green-800'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredValuations = valuations.filter(valuation => {
    const matchesStatus = filterStatus === 'all' || valuation.status === filterStatus;
    const matchesSearch = valuation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         valuation.agent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalValuations = valuations.length;
  const completedValuations = valuations.filter(v => v.status === 'completed').length;
  const avgValue = valuations.reduce((sum, v) => sum + v.estimatedValue, 0) / valuations.length;
  const totalValue = valuations.reduce((sum, v) => sum + v.estimatedValue, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Property Valuations</h3>
          <p className="text-gray-600">Automated and professional property valuations</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Valuation</span>
          </button>
        </div>
      </div>

      {/* Valuation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+5</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">{totalValuations}</h4>
          <p className="text-gray-600">Total Valuations</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+3</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">{completedValuations}</h4>
          <p className="text-gray-600">Completed</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+8%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">${avgValue.toLocaleString()}</h4>
          <p className="text-gray-600">Avg. Value</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+12%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</h4>
          <p className="text-gray-600">Total Value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Valuation List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredValuations.map((valuation) => (
            <div
              key={valuation.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedValuation(valuation)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{valuation.address}</h4>
                    <p className="text-gray-600">{valuation.propertyType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(valuation.status)}`}>
                    {valuation.status.charAt(0).toUpperCase() + valuation.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(valuation.method)}`}>
                    {valuation.method}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Estimated Value</p>
                  <p className="text-xl font-bold text-green-600">${valuation.estimatedValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Market Value</p>
                  <p className="text-lg font-semibold text-gray-900">${valuation.marketValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rent Estimate</p>
                  <p className="text-lg font-semibold text-blue-600">${valuation.rentEstimate}/mo</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>{valuation.bedrooms} bed</span>
                  <span>{valuation.bathrooms} bath</span>
                  <span>{valuation.sqft.toLocaleString()} sqft</span>
                  <span>Built {valuation.yearBuilt}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Valuation Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          {selectedValuation ? (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Property Details</h3>
                  <p className="text-gray-600">{selectedValuation.address}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-semibold">{selectedValuation.propertyType}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-semibold">{selectedValuation.bedrooms}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-semibold">{selectedValuation.bathrooms}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Square Feet:</span>
                  <span className="font-semibold">{selectedValuation.sqft.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lot Size:</span>
                  <span className="font-semibold">{selectedValuation.lotSize}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-semibold">{selectedValuation.yearBuilt}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Valuation Method:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(selectedValuation.method)}`}>
                    {selectedValuation.method}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">${selectedValuation.estimatedValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Estimated Value</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">${selectedValuation.marketValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Market Value</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Home className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">${selectedValuation.rentEstimate}/mo</p>
                  <p className="text-sm text-gray-600">Rent Estimate</p>
                </div>
              </div>

              {selectedValuation.comparables.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Comparable Sales</h4>
                  <div className="space-y-3">
                    {selectedValuation.comparables.map((comp) => (
                      <div key={comp.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900">{comp.address}</p>
                          <p className="text-green-600 font-semibold">${comp.soldPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{comp.bedrooms} bed, {comp.bathrooms} bath, {comp.sqft.toLocaleString()} sqft</span>
                          <span>{comp.distance}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Sold {comp.soldDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all">
                  Update Valuation
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Report</span>
                </button>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all">
                  Share with Client
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Valuation</h3>
              <p className="text-gray-600">Choose a property valuation from the list to view detailed information and comparables.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 