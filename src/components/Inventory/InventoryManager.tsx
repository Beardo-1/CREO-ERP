import React, { useState } from 'react';
import { Package, Wrench, Truck, AlertTriangle, TrendingUp, BarChart3, Search, Filter, Plus, Download, RefreshCw } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'property' | 'equipment' | 'supplies' | 'materials';
  subcategory: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  location: string;
  supplier: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'on-order';
  condition: 'new' | 'good' | 'fair' | 'needs-repair' | 'retired';
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  onOrderItems: number;
  monthlyTurnover: number;
}

const InventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Sample data
  const inventoryStats: InventoryStats = {
    totalItems: 1247,
    totalValue: 485600,
    lowStockItems: 23,
    outOfStockItems: 8,
    onOrderItems: 15,
    monthlyTurnover: 12.5
  };

  const inventoryItems: InventoryItem[] = [
    {
      id: 'INV-001',
      name: 'Professional Camera Equipment',
      category: 'equipment',
      subcategory: 'Photography',
      quantity: 5,
      minStock: 2,
      maxStock: 8,
      unitPrice: 2500,
      totalValue: 12500,
      location: 'Main Office',
      supplier: 'TechPro Equipment',
      lastUpdated: '2024-01-15',
      status: 'in-stock',
      condition: 'good'
    },
    {
      id: 'INV-002',
      name: 'Staging Furniture Set',
      category: 'property',
      subcategory: 'Staging',
      quantity: 12,
      minStock: 5,
      maxStock: 20,
      unitPrice: 850,
      totalValue: 10200,
      location: 'Warehouse A',
      supplier: 'Elite Staging Co.',
      lastUpdated: '2024-01-14',
      status: 'in-stock',
      condition: 'good'
    },
    {
      id: 'INV-003',
      name: 'For Sale Signs',
      category: 'supplies',
      subcategory: 'Marketing',
      quantity: 25,
      minStock: 50,
      maxStock: 200,
      unitPrice: 45,
      totalValue: 1125,
      location: 'Storage Room B',
      supplier: 'SignCraft Pro',
      lastUpdated: '2024-01-13',
      status: 'low-stock',
      condition: 'new'
    },
    {
      id: 'INV-004',
      name: 'Cleaning Supplies Kit',
      category: 'supplies',
      subcategory: 'Maintenance',
      quantity: 0,
      minStock: 10,
      maxStock: 30,
      unitPrice: 75,
      totalValue: 0,
      location: 'Utility Closet',
      supplier: 'CleanPro Supplies',
      lastUpdated: '2024-01-12',
      status: 'out-of-stock',
      condition: 'new'
    },
    {
      id: 'INV-005',
      name: 'Lockbox Systems',
      category: 'equipment',
      subcategory: 'Security',
      quantity: 8,
      minStock: 5,
      maxStock: 15,
      unitPrice: 125,
      totalValue: 1000,
      location: 'Security Storage',
      supplier: 'SecureTech Solutions',
      lastUpdated: '2024-01-11',
      status: 'on-order',
      condition: 'new'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 bg-green-100';
      case 'low-stock': return 'text-yellow-600 bg-yellow-100';
      case 'out-of-stock': return 'text-red-600 bg-red-100';
      case 'on-order': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'needs-repair': return 'text-orange-600 bg-orange-100';
      case 'retired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.lowStockItems}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.outOfStockItems}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">On Order</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.onOrderItems}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Turnover Rate</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.monthlyTurnover}%</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Add New Item</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
            <RefreshCw className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Stock Update</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
            <Download className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Export Report</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
            <Truck className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Create Order</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Inventory Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-900">Professional Camera Equipment restocked (+3 units)</span>
            </div>
            <span className="text-gray-500 text-sm">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-900">For Sale Signs below minimum stock level</span>
            </div>
            <span className="text-gray-500 text-sm">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-900">Cleaning Supplies Kit out of stock</span>
            </div>
            <span className="text-gray-500 text-sm">6 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-900">New order placed for Lockbox Systems (+10 units)</span>
            </div>
            <span className="text-gray-500 text-sm">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryList = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="property">Property</option>
            <option value="equipment">Equipment</option>
            <option value="supplies">Supplies</option>
            <option value="materials">Materials</option>
          </select>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Locations</option>
            <option value="Main Office">Main Office</option>
            <option value="Warehouse A">Warehouse A</option>
            <option value="Storage Room B">Storage Room B</option>
            <option value="Utility Closet">Utility Closet</option>
            <option value="Security Storage">Security Storage</option>
          </select>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg">
            <Filter className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Filter</span>
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900 capitalize">{item.category}</div>
                      <div className="text-sm text-gray-500">{item.subcategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.quantity}</div>
                      <div className="text-sm text-gray-500">Min: {item.minStock} | Max: {item.maxStock}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">${item.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">${item.unitPrice}/unit</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                      {item.condition.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-amber-600 hover:text-amber-800 text-sm font-medium">Edit</button>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">Reorder</button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage property inventory, equipment, and supplies</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg border border-gray-100 w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'inventory', label: 'Inventory List', icon: Package },
              { id: 'equipment', label: 'Equipment Tracker', icon: Wrench },
              { id: 'supplies', label: 'Supply Chain', icon: Truck }
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
          {activeTab === 'equipment' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl w-fit mx-auto mb-6">
                <Wrench className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Equipment Tracker</h3>
              <p className="text-gray-600 mb-6">Advanced equipment tracking and maintenance scheduling</p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Open Equipment Tracker
              </button>
            </div>
          )}
          {activeTab === 'supplies' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl w-fit mx-auto mb-6">
                <Truck className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Supply Chain Management</h3>
              <p className="text-gray-600 mb-6">Manage suppliers, orders, and supply chain logistics</p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Open Supply Chain
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManager; 