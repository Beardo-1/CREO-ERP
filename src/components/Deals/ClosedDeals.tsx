import React, { useState } from 'react';
import {
  CheckCircle,
  DollarSign,
  Calendar,
  User,
  Home,
  TrendingUp,
  Award,
  Eye,
  Download,
  Filter,
  Search,
  Star,
  MapPin,
  Clock,
  BarChart3,
  Trophy,
  Target,
  Users,
  Plus
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface ClosedDeal {
  id: string;
  propertyId: string;
  propertyAddress: string;
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'commercial';
  salePrice: number;
  listPrice: number;
  commission: number;
  commissionRate: number;
  buyer: {
    name: string;
    type: 'first-time' | 'repeat' | 'investor' | 'cash';
  };
  seller: {
    name: string;
    type: 'individual' | 'investor' | 'bank' | 'developer';
  };
  agent: {
    name: string;
    id: string;
    commission: number;
  };
  contractDate: string;
  closingDate: string;
  daysOnMarket: number;
  daysToClose: number;
  marketingCosts: number;
  netProfit: number;
  satisfaction: {
    buyer: number;
    seller: number;
  };
  referralSource: string;
  notes: string;
}

export default function ClosedDeals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('closing-date');
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');
  const { t } = useTranslation();

  const closedDeals: ClosedDeal[] = [
    {
      id: 'CD-001',
      propertyId: 'PROP-001',
      propertyAddress: '123 Oak Street, Downtown',
      propertyType: 'house',
      salePrice: 450000,
      listPrice: 465000,
      commission: 27000,
      commissionRate: 6,
      buyer: {
        name: 'John & Sarah Miller',
        type: 'first-time'
      },
      seller: {
        name: 'Robert Johnson',
        type: 'individual'
      },
      agent: {
        name: 'Sarah Johnson',
        id: 'AGT-001',
        commission: 13500
      },
      contractDate: '2024-01-10',
      closingDate: '2024-01-28',
      daysOnMarket: 45,
      daysToClose: 18,
      marketingCosts: 3500,
      netProfit: 23500,
      satisfaction: {
        buyer: 5,
        seller: 4
      },
      referralSource: 'Online Lead',
      notes: 'Smooth transaction, buyers were well-prepared'
    },
    {
      id: 'CD-002',
      propertyId: 'PROP-002',
      propertyAddress: '456 Pine Avenue, Suburbs',
      propertyType: 'house',
      salePrice: 750000,
      listPrice: 750000,
      commission: 45000,
      commissionRate: 6,
      buyer: {
        name: 'David & Lisa Chen',
        type: 'repeat'
      },
      seller: {
        name: 'Maria Rodriguez',
        type: 'individual'
      },
      agent: {
        name: 'Mike Chen',
        id: 'AGT-002',
        commission: 22500
      },
      contractDate: '2024-01-05',
      closingDate: '2024-01-25',
      daysOnMarket: 32,
      daysToClose: 20,
      marketingCosts: 4200,
      netProfit: 40800,
      satisfaction: {
        buyer: 5,
        seller: 5
      },
      referralSource: 'Past Client Referral',
      notes: 'Excellent clients, quick decision makers'
    },
    {
      id: 'CD-003',
      propertyId: 'PROP-003',
      propertyAddress: '789 Elm Street, Arts District',
      propertyType: 'apartment',
      salePrice: 320000,
      listPrice: 335000,
      commission: 19200,
      commissionRate: 6,
      buyer: {
        name: 'Jennifer Wilson',
        type: 'investor'
      },
      seller: {
        name: 'Thomas Anderson',
        type: 'individual'
      },
      agent: {
        name: 'Emily Davis',
        id: 'AGT-003',
        commission: 9600
      },
      contractDate: '2023-12-15',
      closingDate: '2024-01-20',
      daysOnMarket: 67,
      daysToClose: 36,
      marketingCosts: 2800,
      netProfit: 16400,
      satisfaction: {
        buyer: 4,
        seller: 3
      },
      referralSource: 'Agent Network',
      notes: 'Price negotiation took longer than expected'
    }
  ];

  const getPropertyTypeColor = (type: string) => {
    const colors = {
      house: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200',
      apartment: 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200',
      condo: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200',
      townhouse: 'bg-gradient-to-r from-amber-50 to-orange-100 text-orange-700 border border-orange-200',
      commercial: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.house;
  };

  const getBuyerTypeColor = (type: string) => {
    const colors = {
      'first-time': 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200',
      'repeat': 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200',
      'investor': 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200',
      'cash': 'bg-gradient-to-r from-amber-50 to-orange-100 text-orange-700 border border-orange-200'
    };
    return colors[type as keyof typeof colors] || colors['first-time'];
  };

  const filteredDeals = closedDeals.filter(deal => {
    const matchesSearch = deal.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgent = agentFilter === 'all' || deal.agent.id === agentFilter;
    
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const closingDate = new Date(deal.closingDate);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      
      switch (timeFilter) {
        case 'last-30':
          matchesTime = closingDate >= thirtyDaysAgo;
          break;
        case 'last-90':
          matchesTime = closingDate >= ninetyDaysAgo;
          break;
        case 'this-year':
          matchesTime = closingDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesAgent && matchesTime;
  });

  const totalSales = filteredDeals.reduce((sum, deal) => sum + deal.salePrice, 0);
  const totalCommission = filteredDeals.reduce((sum, deal) => sum + deal.commission, 0);
  const avgDaysOnMarket = Math.round(filteredDeals.reduce((sum, deal) => sum + deal.daysOnMarket, 0) / filteredDeals.length);
  const avgSatisfaction = filteredDeals.reduce((sum, deal) => sum + (deal.satisfaction.buyer + deal.satisfaction.seller) / 2, 0) / filteredDeals.length;

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.totalSales)}</p>
              <p className="text-2xl font-bold text-gray-900">${(totalSales / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.totalCommission)}</p>
              <p className="text-2xl font-bold text-gray-900">${(totalCommission / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.avgDaysOnMarket)}</p>
              <p className="text-2xl font-bold text-gray-900">{avgDaysOnMarket}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.avgSatisfactionLabel)}</p>
              <p className="text-2xl font-bold text-gray-900">{avgSatisfaction.toFixed(1)}/5</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-3 rounded-xl">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.deals.salesByPropertyType)}</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <BarChart3 className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.deals.monthlyPerformance)}</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <TrendingUp className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {t(appContent.deals.closedDeals)}
              </h1>
              <p className="text-gray-600 text-lg">{filteredDeals.length} {t(appContent.deals.successfulTransactions)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t(appContent.deals.list)}
                </button>
                <button
                  onClick={() => setViewMode('analytics')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'analytics'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t(appContent.deals.analytics)}
                </button>
              </div>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3">
                <Plus className="w-6 h-6" />
                <span>{t(appContent.deals.addDeal)}</span>
              </button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.totalDealsLabel)}</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredDeals.length}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.totalVolumeLabel)}</p>
                  <p className="text-2xl font-bold text-gray-900">${(totalSales / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.commissionLabel)}</p>
                  <p className="text-2xl font-bold text-gray-900">${(totalCommission / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.avgSatisfactionLabel)}</p>
                  <p className="text-2xl font-bold text-gray-900">{avgSatisfaction.toFixed(1)}/5</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'analytics' ? (
          renderAnalytics()
        ) : (
          <>
            {/* Enhanced Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={t(appContent.deals.searchDeals)}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    />
                  </div>
                </div>

                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">{t(appContent.deals.allTime)}</option>
                  <option value="year">{t(appContent.deals.thisYear)}</option>
                  <option value="quarter">{t(appContent.deals.thisQuarter)}</option>
                  <option value="month">{t(appContent.deals.thisMonth)}</option>
                </select>

                <select
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
                >
                  <option value="all">{t(appContent.deals.allAgents)}</option>
                  <option value="AGT-001">Sarah Johnson</option>
                  <option value="AGT-002">Mike Chen</option>
                  <option value="AGT-003">Emily Davis</option>
                </select>

                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>{t(appContent.deals.downloadReport)}</span>
                </button>
              </div>
            </div>

            {/* Enhanced Deals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredDeals.map((deal) => (
                <div key={deal.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{deal.propertyAddress}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPropertyTypeColor(deal.propertyType)}`}>
                              {deal.propertyType.charAt(0).toUpperCase() + deal.propertyType.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${deal.salePrice.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          {deal.salePrice === deal.listPrice ? (
                            <span className="text-gray-600">At list price</span>
                          ) : deal.salePrice > deal.listPrice ? (
                            <span className="text-green-600">+${(deal.salePrice - deal.listPrice).toLocaleString()} over</span>
                          ) : (
                            <span className="text-red-600">-${(deal.listPrice - deal.salePrice).toLocaleString()} under</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl">
                        <p className="text-sm text-gray-600">{t(appContent.deals.commissionLabel)}</p>
                        <p className="text-lg font-bold text-amber-700">${deal.commission.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-xl">
                        <p className="text-sm text-gray-600">Days on Market</p>
                        <p className="text-lg font-bold text-blue-700">{deal.daysOnMarket}</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl">
                        <p className="text-sm text-gray-600">Days to Close</p>
                        <p className="text-lg font-bold text-purple-700">{deal.daysToClose}</p>
                      </div>
                    </div>
                  </div>

                  {/* Parties Information */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-xl">
                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Buyer
                        </h5>
                        <p className="font-medium text-blue-800">{deal.buyer.name}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getBuyerTypeColor(deal.buyer.type)}`}>
                          {deal.buyer.type.charAt(0).toUpperCase() + deal.buyer.type.slice(1).replace('-', ' ')}
                        </span>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                        <h5 className="font-semibold text-green-900 mb-2 flex items-center">
                          <Home className="w-4 h-4 mr-2" />
                          Seller
                        </h5>
                        <p className="font-medium text-green-800">{deal.seller.name}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200">
                          {deal.seller.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Satisfaction Ratings</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Buyer</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < deal.satisfaction.buyer
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Seller</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < deal.satisfaction.seller
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Financial Summary</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Marketing Costs:</span>
                            <span className="font-medium">${deal.marketingCosts.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Net Profit:</span>
                            <span className="font-medium text-green-600">${deal.netProfit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t(appContent.deals.commissionRate)}:</span>
                            <span className="font-medium">{deal.commissionRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{t(appContent.deals.closingDate)}: {new Date(deal.closingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{t(appContent.deals.agent)}: {deal.agent.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {deal.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{deal.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredDeals.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Closed Deals Found</h3>
                  <p className="text-gray-600 mb-6">No deals match your current filters. Try adjusting your search criteria.</p>
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 