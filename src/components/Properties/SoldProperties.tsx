import React, { useState } from 'react';
import {
  Building,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  Award,
  Users,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Download,
  BarChart3,
  Target,
  Star
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface SoldProperty {
  id: string;
  title: string;
  address: string;
  listPrice: number;
  soldPrice: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: string;
  listingDate: Date;
  soldDate: Date;
  daysOnMarket: number;
  agent: {
    id: string;
    name: string;
    avatar: string;
  };
  buyer: {
    name: string;
    type: 'individual' | 'investor' | 'company';
  };
  commission: number;
  images: string[];
}

export default function SoldProperties() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '1y' | 'all'>('90d');
  const [sortBy, setSortBy] = useState<'soldDate' | 'soldPrice' | 'daysOnMarket'>('soldDate');

  const mockSoldProperties: SoldProperty[] = [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      address: '123 Oak Street, Downtown',
      listPrice: 450000,
      soldPrice: 465000,
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1200,
      propertyType: 'apartment',
      listingDate: new Date('2024-01-15'),
      soldDate: new Date('2024-02-28'),
      daysOnMarket: 44,
      agent: {
        id: '1',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40'
      },
      buyer: {
        name: 'Michael Smith',
        type: 'individual'
      },
      commission: 27900,
      images: ['/api/placeholder/400/300']
    },
    {
      id: '2',
      title: 'Luxury Family Home',
      address: '456 Pine Avenue, Suburbs',
      listPrice: 750000,
      soldPrice: 735000,
      bedrooms: 4,
      bathrooms: 3,
      squareFootage: 2800,
      propertyType: 'house',
      listingDate: new Date('2024-01-01'),
      soldDate: new Date('2024-02-15'),
      daysOnMarket: 45,
      agent: {
        id: '2',
        name: 'Mike Chen',
        avatar: '/api/placeholder/40/40'
      },
      buyer: {
        name: 'Johnson Family',
        type: 'individual'
      },
      commission: 44100,
      images: ['/api/placeholder/400/300']
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculatePriceChange = (listPrice: number, soldPrice: number) => {
    const change = ((soldPrice - listPrice) / listPrice) * 100;
    return {
      percentage: Math.abs(change),
      type: change >= 0 ? 'increase' : 'decrease'
    };
  };

  const totalSales = mockSoldProperties.reduce((sum, property) => sum + property.soldPrice, 0);
  const totalCommission = mockSoldProperties.reduce((sum, property) => sum + property.commission, 0);
  const averageDaysOnMarket = Math.round(
    mockSoldProperties.reduce((sum, property) => sum + property.daysOnMarket, 0) / mockSoldProperties.length
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.soldProperties.soldProperties)}</h1>
            <p className="text-gray-600">{mockSoldProperties.length} {t(appContent.soldProperties.propertiesSold)}</p>
          </div>
          
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>{t(appContent.soldProperties.exportReport)}</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(totalSales)}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.soldProperties.totalSalesVolume)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(totalCommission)}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.soldProperties.totalCommission)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{averageDaysOnMarket}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.soldProperties.avgDaysOnMarket)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">98.2%</h3>
            <p className="text-gray-600 text-sm">{t(appContent.soldProperties.saleSuccessRate)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t(appContent.soldProperties.searchSoldProperties)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="30d">{t(appContent.soldProperties.last30Days)}</option>
              <option value="90d">{t(appContent.soldProperties.last90Days)}</option>
              <option value="1y">{t(appContent.soldProperties.lastYear)}</option>
              <option value="all">{t(appContent.soldProperties.allTime)}</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="soldDate">{t(appContent.soldProperties.sortBySoldDate)}</option>
              <option value="soldPrice">{t(appContent.soldProperties.sortByPrice)}</option>
              <option value="daysOnMarket">{t(appContent.soldProperties.sortByDaysOnMarket)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sold Properties List */}
      <div className="space-y-6">
        {mockSoldProperties.map((property) => {
          const priceChange = calculatePriceChange(property.listPrice, property.soldPrice);
          
          return (
            <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start space-x-6">
                {/* Property Image */}
                <div className="w-32 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{property.address}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{property.bedrooms} {t(appContent.soldProperties.beds)}</span>
                        <span>{property.bathrooms} {t(appContent.soldProperties.baths)}</span>
                        <span>{property.squareFootage.toLocaleString()} {t(appContent.soldProperties.sqFt)}</span>
                        <span className="capitalize">{property.propertyType}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">{t(appContent.soldProperties.sold)}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {t(appContent.soldProperties.soldOn)} {property.soldDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Price Information */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t(appContent.soldProperties.listPrice)}</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatPrice(property.listPrice)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t(appContent.soldProperties.soldPrice)}</div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatPrice(property.soldPrice)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t(appContent.soldProperties.priceChange)}</div>
                      <div className={`text-lg font-semibold flex items-center ${
                        priceChange.type === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {priceChange.type === 'increase' ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                        )}
                        {priceChange.percentage.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t(appContent.soldProperties.commission)}</div>
                      <div className="text-lg font-semibold text-amber-600">
                        {formatPrice(property.commission)}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <img
                          src={property.agent.avatar}
                          alt={property.agent.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.agent.name}</div>
                          <div className="text-xs text-gray-600">{t(appContent.soldProperties.listingAgent)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.buyer.name}</div>
                          <div className="text-xs text-gray-600">{t(appContent.soldProperties[property.buyer.type as keyof typeof appContent.soldProperties] || { en: property.buyer.type, ar: property.buyer.type })}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{property.daysOnMarket} {t(appContent.soldProperties.daysOnMarket)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{t(appContent.soldProperties.listed)} {property.listingDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.soldProperties.salesPerformance)}</h3>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-gray-500">{t(appContent.soldProperties.salesPerformanceChart)}</p>
            <p className="text-sm text-gray-400">{t(appContent.soldProperties.chartIntegrationNeeded)}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 