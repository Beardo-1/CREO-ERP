import React, { useState } from 'react';
import { Calculator, Home, BarChart3, TrendingUp, Search, Plus, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

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

export function PropertyValuation() {
  const { t } = useTranslation();
  const [valuations, setValuations] = useState<Valuation[]>([]);
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
  const avgValue = valuations.length > 0 ? valuations.reduce((sum, v) => sum + v.estimatedValue, 0) / valuations.length : 0;
  const totalValue = valuations.reduce((sum, v) => sum + v.estimatedValue, 0);

  if (valuations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Valuations Found</h3>
            <p className="text-gray-600 mb-6">Start by creating your first property valuation.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all"
            >
              Create Valuation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{t(appContent.deals.valuationsTitle)}</h3>
          <p className="text-gray-600">{t(appContent.deals.valuationsSubtitle)}</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t(appContent.deals.searchProperties)}
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
            <option value="all">{t(appContent.deals.allStatus)}</option>
            <option value="pending">{t(appContent.deals.pending)}</option>
            <option value="completed">{t(appContent.deals.completed)}</option>
            <option value="expired">{t(appContent.deals.expired)}</option>
          </select>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{t(appContent.deals.newValuation)}</span>
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
          <p className="text-gray-600">{t(appContent.deals.totalValuations)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+3</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">{completedValuations}</h4>
          <p className="text-gray-600">{t(appContent.deals.completed)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+8%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">${avgValue.toLocaleString()}</h4>
          <p className="text-gray-600">{t(appContent.deals.avgValue)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+12%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</h4>
          <p className="text-gray-600">{t(appContent.deals.totalValue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Valuation List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredValuations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Valuations Found</h4>
              <p className="text-gray-600">Create your first property valuation to get started.</p>
            </div>
          ) : (
            filteredValuations.map((valuation) => (
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
                    <p className="text-sm text-gray-600">{t(appContent.deals.estimatedValue)}</p>
                    <p className="text-xl font-bold text-green-600">${valuation.estimatedValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t(appContent.deals.marketValue)}</p>
                    <p className="text-lg font-semibold text-gray-900">${valuation.marketValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t(appContent.deals.rentEstimate)}</p>
                    <p className="text-lg font-semibold text-blue-600">${valuation.rentEstimate}/mo</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{valuation.bedrooms} {t(appContent.deals.bed)}</span>
                    <span>{valuation.bathrooms} {t(appContent.deals.bath)}</span>
                    <span>{valuation.sqft.toLocaleString()} {t(appContent.deals.sqft)}</span>
                    <span>{t(appContent.deals.built)} {valuation.yearBuilt}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Valuation Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          {selectedValuation ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900">Valuation Details</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedValuation.status)}`}>
                  {selectedValuation.status.charAt(0).toUpperCase() + selectedValuation.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-semibold text-gray-900">{selectedValuation.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Agent</p>
                  <p className="font-semibold text-gray-900">{selectedValuation.agent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valuation Date</p>
                  <p className="font-semibold text-gray-900">{new Date(selectedValuation.valuationDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all">
                  Update Valuation
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>{t(appContent.deals.downloadReport)}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(appContent.deals.selectValuation)}</h3>
              <p className="text-gray-600">Choose a property valuation from the list to view detailed information and comparables.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 