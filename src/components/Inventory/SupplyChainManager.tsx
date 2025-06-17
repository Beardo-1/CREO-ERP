import React, { useState } from 'react';
import { Users, Package, TrendingUp, Star, Phone, Mail, MapPin, Calendar, DollarSign, Clock, CheckCircle, AlertTriangle, Search, Filter, Plus, Download, Eye } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: 'staging' | 'marketing' | 'maintenance' | 'technology' | 'security' | 'general';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  paymentTerms: string;
  deliveryTime: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastOrderDate: string;
  reliability: number;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface SupplyMetrics {
  totalSuppliers: number;
  activeOrders: number;
  monthlySpend: number;
  onTimeDelivery: number;
  averageDeliveryTime: number;
  supplierRating: number;
}

const SupplyChainManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample data
  const supplyMetrics: SupplyMetrics = {
    totalSuppliers: 24,
    activeOrders: 12,
    monthlySpend: 45600,
    onTimeDelivery: 94.2,
    averageDeliveryTime: 3.5,
    supplierRating: 4.6
  };

  const suppliers: Supplier[] = [
    {
      id: 'SUP-001',
      name: 'Elite Staging Solutions',
      category: 'staging',
      contactPerson: 'Jennifer Martinez',
      email: 'jennifer@elitestaging.com',
      phone: '(555) 123-4567',
      address: '123 Design Ave, Los Angeles, CA 90210',
      rating: 4.8,
      totalOrders: 45,
      totalSpent: 125000,
      paymentTerms: 'Net 30',
      deliveryTime: '2-3 days',
      status: 'active',
      lastOrderDate: '2024-01-15',
      reliability: 96
    },
    {
      id: 'SUP-002',
      name: 'SignCraft Professional',
      category: 'marketing',
      contactPerson: 'Michael Chen',
      email: 'michael@signcraft.com',
      phone: '(555) 234-5678',
      address: '456 Print St, San Francisco, CA 94102',
      rating: 4.5,
      totalOrders: 32,
      totalSpent: 28500,
      paymentTerms: 'Net 15',
      deliveryTime: '1-2 days',
      status: 'active',
      lastOrderDate: '2024-01-12',
      reliability: 92
    },
    {
      id: 'SUP-003',
      name: 'TechPro Equipment',
      category: 'technology',
      contactPerson: 'Sarah Wilson',
      email: 'sarah@techpro.com',
      phone: '(555) 345-6789',
      address: '789 Tech Blvd, Austin, TX 78701',
      rating: 4.7,
      totalOrders: 28,
      totalSpent: 85000,
      paymentTerms: 'Net 30',
      deliveryTime: '3-5 days',
      status: 'active',
      lastOrderDate: '2024-01-10',
      reliability: 94
    }
  ];

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: 'PO-001',
      supplierId: 'SUP-001',
      supplierName: 'Elite Staging Solutions',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-18',
      status: 'confirmed',
      totalAmount: 4500,
      items: [
        { id: '1', name: 'Staging Furniture Set', quantity: 2, unitPrice: 850, totalPrice: 1700, category: 'staging' },
        { id: '2', name: 'Decorative Accessories', quantity: 5, unitPrice: 560, totalPrice: 2800, category: 'staging' }
      ],
      priority: 'medium',
      notes: 'Needed for upcoming property staging'
    },
    {
      id: 'PO-002',
      supplierId: 'SUP-002',
      supplierName: 'SignCraft Professional',
      orderDate: '2024-01-14',
      expectedDelivery: '2024-01-16',
      status: 'shipped',
      totalAmount: 1250,
      items: [
        { id: '3', name: 'For Sale Signs', quantity: 25, unitPrice: 45, totalPrice: 1125, category: 'marketing' },
        { id: '4', name: 'Open House Banners', quantity: 5, unitPrice: 25, totalPrice: 125, category: 'marketing' }
      ],
      priority: 'high',
      notes: 'Rush order for weekend open houses'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      staging: 'bg-purple-100 text-purple-800',
      marketing: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-green-100 text-green-800',
      technology: 'bg-indigo-100 text-indigo-800',
      security: 'bg-red-100 text-red-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Suppliers</p>
            <p className="text-2xl font-bold text-gray-900">{supplyMetrics.totalSuppliers}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Active Orders</p>
            <p className="text-2xl font-bold text-gray-900">{supplyMetrics.activeOrders}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Monthly Spend</p>
            <p className="text-2xl font-bold text-gray-900">${supplyMetrics.monthlySpend.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">On-Time Delivery</p>
            <p className="text-2xl font-bold text-gray-900">{supplyMetrics.onTimeDelivery}%</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Avg Delivery</p>
            <p className="text-2xl font-bold text-gray-900">{supplyMetrics.averageDeliveryTime} days</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Supplier Rating</p>
            <p className="text-2xl font-bold text-gray-900">{supplyMetrics.supplierRating}/5</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl">
            <Star className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-6">
      {renderStatsCards()}
      
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search suppliers..."
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
            <option value="staging">Staging</option>
            <option value="marketing">Marketing</option>
            <option value="maintenance">Maintenance</option>
            <option value="technology">Technology</option>
            <option value="security">Security</option>
            <option value="general">General</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg">
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{supplier.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(supplier.category)}`}>
                  {supplier.category}
                </span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                {supplier.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{supplier.contactPerson}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{supplier.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{supplier.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{supplier.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">{supplier.rating}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{supplier.reliability}%</div>
                <div className="text-xs text-gray-500">Reliability</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{supplier.totalOrders}</div>
                <div className="text-xs text-gray-500">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">${supplier.totalSpent.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Spent</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium">
                Create Order
              </button>
              <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      {renderStatsCards()}
      
      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Purchase Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.supplierName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.orderDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.expectedDelivery}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                      <button className="text-amber-600 hover:text-amber-800 text-sm font-medium">Edit</button>
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      {renderStatsCards()}
      
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl w-fit mx-auto mb-6">
          <TrendingUp className="w-16 h-16 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Supply Chain Analytics</h3>
        <p className="text-gray-600 mb-6">Advanced analytics and reporting for supply chain performance</p>
        <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
          View Analytics Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supply Chain Management</h1>
          <p className="text-gray-600">Manage suppliers, purchase orders, and supply chain analytics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg border border-gray-100 w-fit">
            {[
              { id: 'suppliers', label: 'Suppliers', icon: Users },
              { id: 'orders', label: 'Purchase Orders', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
          {activeTab === 'suppliers' && renderSuppliers()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default SupplyChainManager; 