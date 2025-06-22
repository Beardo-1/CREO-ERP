import React, { useState } from 'react';
import { Home, Package, MapPin, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Star, Eye, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';

interface PropertyInventoryItem {
  id: string;
  propertyId: string;
  propertyAddress: string;
  itemName: string;
  category: 'staging' | 'fixtures' | 'appliances' | 'furniture' | 'decor' | 'maintenance' | 'security';
  subcategory: string;
  quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs-replacement';
  value: number;
  purchaseDate: string;
  installDate?: string;
  warrantyExpiry?: string;
  location: string; // Room or area within property
  status: 'active' | 'staged' | 'removed' | 'maintenance' | 'storage';
  notes: string;
  images: string[];
  lastInspection: string;
  nextInspection: string;
}

interface PropertySummary {
  propertyId: string;
  address: string;
  type: 'residential' | 'commercial' | 'luxury' | 'rental';
  status: 'active' | 'staged' | 'sold' | 'rented';
  totalItems: number;
  totalValue: number;
  stagingItems: number;
  maintenanceItems: number;
  lastUpdated: string;
}

interface InventoryStats {
  totalProperties: number;
  totalItems: number;
  totalValue: number;
  stagedProperties: number;
  maintenanceRequired: number;
  averageValuePerProperty: number;
}

const PropertyInventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showStagePropertyModal, setShowStagePropertyModal] = useState(false);
  const [showScheduleInspectionModal, setShowScheduleInspectionModal] = useState(false);
  const [showMaintenanceAlertModal, setShowMaintenanceAlertModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PropertyInventoryItem | null>(null);
  const [selectedPropertyForStaging, setSelectedPropertyForStaging] = useState<PropertySummary | null>(null);

  // Sample data
  const inventoryStats: InventoryStats = {
    totalProperties: 45,
    totalItems: 1247,
    totalValue: 485600,
    stagedProperties: 12,
    maintenanceRequired: 23,
    averageValuePerProperty: 10791
  };

  const propertySummaries: PropertySummary[] = [
    {
      propertyId: 'PROP-001',
      address: '123 Luxury Lane, Beverly Hills, CA',
      type: 'luxury',
      status: 'staged',
      totalItems: 45,
      totalValue: 85000,
      stagingItems: 32,
      maintenanceItems: 2,
      lastUpdated: '2024-01-15'
    },
    {
      propertyId: 'PROP-002',
      address: '456 Modern Ave, Los Angeles, CA',
      type: 'residential',
      status: 'active',
      totalItems: 28,
      totalValue: 42000,
      stagingItems: 18,
      maintenanceItems: 1,
      lastUpdated: '2024-01-14'
    },
    {
      propertyId: 'PROP-003',
      address: '789 Business Blvd, Downtown LA, CA',
      type: 'commercial',
      status: 'active',
      totalItems: 65,
      totalValue: 125000,
      stagingItems: 0,
      maintenanceItems: 8,
      lastUpdated: '2024-01-13'
    },
    {
      propertyId: 'PROP-004',
      address: '321 Family St, Pasadena, CA',
      type: 'residential',
      status: 'sold',
      totalItems: 22,
      totalValue: 28000,
      stagingItems: 0,
      maintenanceItems: 0,
      lastUpdated: '2024-01-10'
    }
  ];

  const inventoryItems: PropertyInventoryItem[] = [
    {
      id: 'PI-001',
      propertyId: 'PROP-001',
      propertyAddress: '123 Luxury Lane, Beverly Hills, CA',
      itemName: 'Italian Leather Sofa Set',
      category: 'staging',
      subcategory: 'Living Room Furniture',
      quantity: 1,
      condition: 'excellent',
      value: 8500,
      purchaseDate: '2023-06-15',
      location: 'Living Room',
      status: 'staged',
      notes: 'High-end staging piece for luxury properties',
      images: ['sofa1.jpg', 'sofa2.jpg'],
      lastInspection: '2024-01-10',
      nextInspection: '2024-04-10'
    },
    {
      id: 'PI-002',
      propertyId: 'PROP-001',
      propertyAddress: '123 Luxury Lane, Beverly Hills, CA',
      itemName: 'Crystal Chandelier',
      category: 'fixtures',
      subcategory: 'Lighting',
      quantity: 1,
      condition: 'excellent',
      value: 12000,
      purchaseDate: '2023-08-20',
      installDate: '2023-08-25',
      warrantyExpiry: '2025-08-25',
      location: 'Dining Room',
      status: 'active',
      notes: 'Custom crystal chandelier, professionally installed',
      images: ['chandelier1.jpg'],
      lastInspection: '2024-01-05',
      nextInspection: '2024-07-05'
    },
    {
      id: 'PI-003',
      propertyId: 'PROP-002',
      propertyAddress: '456 Modern Ave, Los Angeles, CA',
      itemName: 'Smart Home Security System',
      category: 'security',
      subcategory: 'Surveillance',
      quantity: 1,
      condition: 'good',
      value: 3500,
      purchaseDate: '2023-03-10',
      installDate: '2023-03-15',
      warrantyExpiry: '2025-03-15',
      location: 'Whole Property',
      status: 'active',
      notes: '24/7 monitoring system with mobile app',
      images: ['security1.jpg', 'security2.jpg'],
      lastInspection: '2023-12-15',
      nextInspection: '2024-06-15'
    },
    {
      id: 'PI-004',
      propertyId: 'PROP-002',
      propertyAddress: '456 Modern Ave, Los Angeles, CA',
      itemName: 'Stainless Steel Appliance Package',
      category: 'appliances',
      subcategory: 'Kitchen',
      quantity: 4,
      condition: 'good',
      value: 6500,
      purchaseDate: '2023-01-20',
      installDate: '2023-01-25',
      warrantyExpiry: '2025-01-25',
      location: 'Kitchen',
      status: 'active',
      notes: 'Refrigerator, dishwasher, range, microwave',
      images: ['appliances1.jpg'],
      lastInspection: '2024-01-01',
      nextInspection: '2024-07-01'
    },
    {
      id: 'PI-005',
      propertyId: 'PROP-003',
      propertyAddress: '789 Business Blvd, Downtown LA, CA',
      itemName: 'HVAC System',
      category: 'maintenance',
      subcategory: 'Climate Control',
      quantity: 2,
      condition: 'fair',
      value: 15000,
      purchaseDate: '2022-05-10',
      installDate: '2022-05-15',
      warrantyExpiry: '2024-05-15',
      location: 'Mechanical Room',
      status: 'maintenance',
      notes: 'Requires filter replacement and duct cleaning',
      images: ['hvac1.jpg'],
      lastInspection: '2023-11-20',
      nextInspection: '2024-02-20'
    }
  ];

  // Functionality handlers
  const handleAddItem = (newItem: Partial<PropertyInventoryItem>) => {
        setShowAddItemModal(false);
  };

  const handleStageProperty = (propertyId: string, stagingItems: string[]) => {
        setShowStagePropertyModal(false);
    setSelectedPropertyForStaging(null);
  };

  const handleScheduleInspection = (itemId: string, inspectionDate: string, inspectionType: string) => {
        setShowScheduleInspectionModal(false);
    setSelectedItem(null);
  };

  const handleMaintenanceAlert = (itemId: string, alertType: string, priority: string, notes: string) => {
        setShowMaintenanceAlertModal(false);
    setSelectedItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'staged': return 'text-blue-600 bg-blue-100';
      case 'removed': return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'storage': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'needs-replacement': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPropertyStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'staged': return 'text-blue-600 bg-blue-100';
      case 'sold': return 'text-purple-600 bg-purple-100';
      case 'rented': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesProperty = selectedProperty === 'all' || item.propertyId === selectedProperty;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesProperty && matchesStatus;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalProperties}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Home className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalItems.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${inventoryStats.totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Staged Properties</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.stagedProperties}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Maintenance Required</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.maintenanceRequired}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Value/Property</p>
              <p className="text-2xl font-bold text-gray-900">${inventoryStats.averageValuePerProperty.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Home className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Property Summaries */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Summaries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {propertySummaries.map((property) => (
            <div key={property.propertyId} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{property.address}</h4>
                  <p className="text-sm text-gray-500">{property.propertyId}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{property.totalItems}</div>
                  <div className="text-xs text-gray-500">Items</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">${property.totalValue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Value</div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">{property.stagingItems} staged</span>
                <span className="text-orange-600">{property.maintenanceItems} maintenance</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowAddItemModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Add Item</span>
          </button>
          <button 
            onClick={() => setShowStagePropertyModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Star className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Stage Property</span>
          </button>
          <button 
            onClick={() => setShowScheduleInspectionModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Calendar className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Schedule Inspection</span>
          </button>
          <button 
            onClick={() => setShowMaintenanceAlertModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <AlertTriangle className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Maintenance Alert</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderInventoryList = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Properties</option>
            {propertySummaries.map((property) => (
              <option key={property.propertyId} value={property.propertyId}>
                {property.address.split(',')[0]}
              </option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="staging">Staging</option>
            <option value="fixtures">Fixtures</option>
            <option value="appliances">Appliances</option>
            <option value="furniture">Furniture</option>
            <option value="decor">Decor</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="staged">Staged</option>
            <option value="removed">Removed</option>
            <option value="maintenance">Maintenance</option>
            <option value="storage">Storage</option>
          </select>
          <button 
            onClick={() => setShowAddItemModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Add Item</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{item.propertyAddress.split(',')[0]}</div>
                      <div className="text-sm text-gray-500">{item.propertyId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{item.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">${item.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Purchased: {item.purchaseDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Inventory</h1>
          <p className="text-gray-600">Track and manage property-specific inventory and assets</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg border border-gray-100 w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'inventory', label: 'Inventory List', icon: Package },
              { id: 'staging', label: 'Staging Manager', icon: Star },
              { id: 'maintenance', label: 'Maintenance Tracker', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'inventory' && renderInventoryList()}
          {activeTab === 'staging' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl w-fit mx-auto mb-6">
                <Star className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Staging Manager</h3>
              <p className="text-gray-600 mb-6">Manage property staging inventory and schedules</p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Open Staging Manager
              </button>
            </div>
          )}
          {activeTab === 'maintenance' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl w-fit mx-auto mb-6">
                <AlertTriangle className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Maintenance Tracker</h3>
              <p className="text-gray-600 mb-6">Track maintenance schedules and property condition</p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Open Maintenance Tracker
              </button>
            </div>
          )}
        </div>

        {/* Add Item Modal */}
        {showAddItemModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddItemModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Property Inventory Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                      {propertySummaries.map((property) => (
                        <option key={property.propertyId} value={property.propertyId}>
                          {property.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      placeholder="Enter item name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                      <option value="staging">Staging</option>
                      <option value="fixtures">Fixtures</option>
                      <option value="appliances">Appliances</option>
                      <option value="furniture">Furniture</option>
                      <option value="decor">Decor</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="security">Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Room or area"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="needs-replacement">Needs Replacement</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Additional notes about the item"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddItemModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleAddItem({})}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage Property Modal */}
        {showStagePropertyModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowStagePropertyModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Property</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Property</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      {propertySummaries.map((property) => (
                        <option key={property.propertyId} value={property.propertyId}>
                          {property.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Staging Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Staging Items</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {inventoryItems.filter(item => item.category === 'staging').map(item => (
                        <label key={item.id} className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                          <span className="text-sm text-gray-900">{item.itemName}</span>
                          <span className="text-xs text-gray-500">({item.location})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowStagePropertyModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleStageProperty('', [])}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Stage Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Inspection Modal */}
        {showScheduleInspectionModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowScheduleInspectionModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Inspection</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      {inventoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.itemName} - {item.propertyAddress.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inspection Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inspection Type</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="routine">Routine Inspection</option>
                      <option value="maintenance">Maintenance Check</option>
                      <option value="warranty">Warranty Inspection</option>
                      <option value="damage">Damage Assessment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Inspection notes"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowScheduleInspectionModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleScheduleInspection('', '', '')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Alert Modal */}
        {showMaintenanceAlertModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMaintenanceAlertModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Maintenance Alert</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {inventoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.itemName} - {item.propertyAddress.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="repair">Repair Needed</option>
                      <option value="replacement">Replacement Required</option>
                      <option value="service">Service Due</option>
                      <option value="warranty">Warranty Expiring</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the maintenance issue"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowMaintenanceAlertModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleMaintenanceAlert('', '', '', '')}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Create Alert
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

export default PropertyInventory; 