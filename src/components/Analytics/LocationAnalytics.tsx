import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  DollarSign, 
  Users, 
  BarChart3,
  Filter,
  Search,
  Calendar,
  Eye,
  Download,
  RefreshCw,
  Target,
  Zap,
  Award,
  AlertTriangle
} from 'lucide-react';

interface LocationData {
  id: string;
  area: string;
  city: string;
  state: string;
  zipCode: string;
  averagePrice: number;
  priceChange: number;
  daysOnMarket: number;
  inventory: number;
  salesVolume: number;
  pricePerSqft: number;
  walkScore: number;
  schoolRating: number;
  crimeRate: number;
  demographics: {
    medianAge: number;
    medianIncome: number;
    populationGrowth: number;
  };
  marketTrends: {
    month: string;
    averagePrice: number;
    salesCount: number;
  }[];
}

interface MarketInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'trend' | 'hot-market';
  title: string;
  description: string;
  location: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

export function LocationAnalytics() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'comparison'>('list');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    // Mock data - in real app, this would come from MLS and market data APIs
    const mockLocations: LocationData[] = [
      {
        id: '1',
        area: 'Downtown District',
        city: 'Metro City',
        state: 'CA',
        zipCode: '90210',
        averagePrice: 850000,
        priceChange: 12.5,
        daysOnMarket: 18,
        inventory: 45,
        salesVolume: 125,
        pricePerSqft: 425,
        walkScore: 92,
        schoolRating: 8.5,
        crimeRate: 2.1,
        demographics: {
          medianAge: 34,
          medianIncome: 95000,
          populationGrowth: 3.2
        },
        marketTrends: [
          { month: 'Jan', averagePrice: 820000, salesCount: 18 },
          { month: 'Feb', averagePrice: 835000, salesCount: 22 },
          { month: 'Mar', averagePrice: 850000, salesCount: 25 },
          { month: 'Apr', averagePrice: 865000, salesCount: 28 },
          { month: 'May', averagePrice: 850000, salesCount: 32 },
          { month: 'Jun', averagePrice: 850000, salesCount: 30 }
        ]
      },
      {
        id: '2',
        area: 'Suburban Heights',
        city: 'Metro City',
        state: 'CA',
        zipCode: '90211',
        averagePrice: 650000,
        priceChange: 8.3,
        daysOnMarket: 25,
        inventory: 78,
        salesVolume: 89,
        pricePerSqft: 285,
        walkScore: 65,
        schoolRating: 9.2,
        crimeRate: 1.2,
        demographics: {
          medianAge: 42,
          medianIncome: 78000,
          populationGrowth: 1.8
        },
        marketTrends: [
          { month: 'Jan', averagePrice: 620000, salesCount: 12 },
          { month: 'Feb', averagePrice: 635000, salesCount: 15 },
          { month: 'Mar', averagePrice: 645000, salesCount: 18 },
          { month: 'Apr', averagePrice: 655000, salesCount: 16 },
          { month: 'May', averagePrice: 650000, salesCount: 14 },
          { month: 'Jun', averagePrice: 650000, salesCount: 14 }
        ]
      },
      {
        id: '3',
        area: 'Waterfront District',
        city: 'Metro City',
        state: 'CA',
        zipCode: '90212',
        averagePrice: 1200000,
        priceChange: -2.1,
        daysOnMarket: 42,
        inventory: 23,
        salesVolume: 34,
        pricePerSqft: 580,
        walkScore: 78,
        schoolRating: 7.8,
        crimeRate: 1.8,
        demographics: {
          medianAge: 48,
          medianIncome: 125000,
          populationGrowth: 0.5
        },
        marketTrends: [
          { month: 'Jan', averagePrice: 1250000, salesCount: 8 },
          { month: 'Feb', averagePrice: 1230000, salesCount: 6 },
          { month: 'Mar', averagePrice: 1210000, salesCount: 5 },
          { month: 'Apr', averagePrice: 1200000, salesCount: 7 },
          { month: 'May', averagePrice: 1195000, salesCount: 4 },
          { month: 'Jun', averagePrice: 1200000, salesCount: 4 }
        ]
      }
    ];

    const mockInsights: MarketInsight[] = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Emerging Market Opportunity',
        description: 'Suburban Heights showing strong price growth with increasing inventory',
        location: 'Suburban Heights, CA 90211',
        impact: 'high',
        confidence: 87
      },
      {
        id: '2',
        type: 'hot-market',
        title: 'Hot Market Alert',
        description: 'Downtown District properties selling 40% faster than city average',
        location: 'Downtown District, CA 90210',
        impact: 'high',
        confidence: 94
      },
      {
        id: '3',
        type: 'warning',
        title: 'Market Cooling',
        description: 'Waterfront District showing price decline and increased days on market',
        location: 'Waterfront District, CA 90212',
        impact: 'medium',
        confidence: 78
      },
      {
        id: '4',
        type: 'trend',
        title: 'School District Impact',
        description: 'Areas with 9+ school ratings showing 15% premium pricing',
        location: 'Multiple Locations',
        impact: 'medium',
        confidence: 91
      }
    ];

    setLocations(mockLocations);
    setInsights(mockInsights);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Target;
      case 'hot-market': return Zap;
      case 'warning': return AlertTriangle;
      case 'trend': return TrendingUp;
      default: return BarChart3;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-100 text-green-800 border-green-200';
      case 'hot-market': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'trend': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.zipCode.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Location Analytics</h1>
            <p className="text-gray-600">Market insights and location-based real estate data</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="2years">Last 2 Years</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by area, city, or zip code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'comparison' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">
                    {insight.confidence}% confidence
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{insight.title}</h3>
                <p className="text-sm mb-2">{insight.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span>{insight.location}</span>
                  <span className="font-medium">{insight.impact.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location Data */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedLocation(location)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{location.area}</h3>
                  <p className="text-gray-600">{location.city}, {location.state} {location.zipCode}</p>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  location.priceChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {location.priceChange >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(location.priceChange)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${(location.averagePrice / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-600">Avg. Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{location.daysOnMarket}</div>
                  <div className="text-sm text-gray-600">Days on Market</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Inventory:</span>
                  <span className="font-medium">{location.inventory} homes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price/Sqft:</span>
                  <span className="font-medium">${location.pricePerSqft}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Walk Score:</span>
                  <span className="font-medium">{location.walkScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">School Rating:</span>
                  <span className="font-medium">{location.schoolRating}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'map' && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map View</h3>
            <p className="text-gray-600 mb-4">
              Interactive map with property data, market trends, and location insights
            </p>
            <div className="bg-gray-100 rounded-lg p-8 mx-auto max-w-2xl">
              <div className="text-gray-500 text-sm">
                Map integration with Google Maps API, Mapbox, or similar service would be implemented here.
                Features would include:
              </div>
              <ul className="text-left text-gray-600 text-sm mt-4 space-y-1">
                <li>• Property markers with price and status</li>
                <li>• Heat maps for price trends</li>
                <li>• School district boundaries</li>
                <li>• Crime data overlays</li>
                <li>• Transportation and amenities</li>
                <li>• Market boundary definitions</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'comparison' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Location Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg. Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Price Change</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Days on Market</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Inventory</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Walk Score</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Schools</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.map((location) => (
                  <tr key={location.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{location.area}</div>
                        <div className="text-sm text-gray-600">{location.zipCode}</div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${(location.averagePrice / 1000).toFixed(0)}K
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={`flex items-center justify-end space-x-1 ${
                        location.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {location.priceChange >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(location.priceChange)}%</span>
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">{location.daysOnMarket}</td>
                    <td className="text-right py-3 px-4">{location.inventory}</td>
                    <td className="text-right py-3 px-4">{location.walkScore}</td>
                    <td className="text-right py-3 px-4">{location.schoolRating}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLocation.area}</h2>
                  <p className="text-gray-600">{selectedLocation.city}, {selectedLocation.state} {selectedLocation.zipCode}</p>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-900">
                    ${(selectedLocation.averagePrice / 1000).toFixed(0)}K
                  </div>
                  <div className="text-blue-700">Average Price</div>
                  <div className={`text-sm flex items-center space-x-1 mt-1 ${
                    selectedLocation.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedLocation.priceChange >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(selectedLocation.priceChange)}% vs last period</span>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-900">{selectedLocation.daysOnMarket}</div>
                  <div className="text-green-700">Days on Market</div>
                  <div className="text-sm text-green-600 mt-1">
                    {selectedLocation.daysOnMarket < 30 ? 'Fast-moving market' : 'Slower market'}
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-900">{selectedLocation.inventory}</div>
                  <div className="text-purple-700">Active Listings</div>
                  <div className="text-sm text-purple-600 mt-1">
                    {selectedLocation.salesVolume} sold this period
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Sqft:</span>
                      <span className="font-medium">${selectedLocation.pricePerSqft}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sales Volume:</span>
                      <span className="font-medium">{selectedLocation.salesVolume} properties</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Walk Score:</span>
                      <span className="font-medium">{selectedLocation.walkScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">School Rating:</span>
                      <span className="font-medium">{selectedLocation.schoolRating}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crime Rate:</span>
                      <span className="font-medium">{selectedLocation.crimeRate}/10</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Median Age:</span>
                      <span className="font-medium">{selectedLocation.demographics.medianAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Median Income:</span>
                      <span className="font-medium">${selectedLocation.demographics.medianIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population Growth:</span>
                      <span className={`font-medium ${
                        selectedLocation.demographics.populationGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedLocation.demographics.populationGrowth >= 0 ? '+' : ''}{selectedLocation.demographics.populationGrowth}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 