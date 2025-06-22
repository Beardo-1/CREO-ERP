import React, { useState, useEffect } from 'react';
import { Package, Wrench, Truck, AlertTriangle, TrendingUp, BarChart3, Search, Filter, Plus, Download, RefreshCw, Edit, Trash2, Eye } from 'lucide-react';
import { unifiedDataService } from '../../services/unifiedDataService';

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
  propertyId?: string;
  notes?: string;
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
  // Real data states
  const [properties, setProperties] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [inventoryStats, setInventoryStats] = useState<InventoryStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    onOrderItems: 0,
    monthlyTurnover: 0
  });

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'supplies' as InventoryItem['category'],
    subcategory: '',
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    location: '',
    supplier: '',
    condition: 'new' as InventoryItem['condition'],
    notes: ''
  });

  // Load real data and generate inventory
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const propertiesData = unifiedDataService.getProperties();
        const dealsData = unifiedDataService.getDeals();

        setProperties(propertiesData);
        setDeals(dealsData);

        // Generate inventory from real data
        const generatedInventory = generateInventoryFromData(propertiesData, dealsData);
        setInventoryData(generatedInventory);

        // Calculate stats
        calculateInventoryStats(generatedInventory);
      } catch (error) {
        console.error('Error loading inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    unifiedDataService.subscribe('properties', (data: any) => {
      setProperties(data);
      const generatedInventory = generateInventoryFromData(data, deals);
      setInventoryData(generatedInventory);
      calculateInventoryStats(generatedInventory);
    });

    unifiedDataService.subscribe('deals', (data: any) => {
      setDeals(data);
      const generatedInventory = generateInventoryFromData(properties, data);
      setInventoryData(generatedInventory);
      calculateInventoryStats(generatedInventory);
    });
  }, []);

  // Generate inventory from real data
  const generateInventoryFromData = (propertiesData: any[], dealsData: any[]): InventoryItem[] => {
    const inventory: InventoryItem[] = [];

    // Base inventory items for real estate business
    const baseItems = [
      {
      name: 'Professional Camera Equipment',
        category: 'equipment' as const,
      subcategory: 'Photography',
      quantity: 5,
      minStock: 2,
      maxStock: 8,
      unitPrice: 2500,
      location: 'Main Office',
      supplier: 'TechPro Equipment',
        condition: 'good' as const
      },
      {
      name: 'For Sale Signs',
        category: 'supplies' as const,
      subcategory: 'Marketing',
        quantity: Math.max(25, propertiesData.filter(p => p.status === 'For Sale').length * 2),
      minStock: 50,
      maxStock: 200,
      unitPrice: 45,
        location: 'Storage Room',
      supplier: 'SignCraft Pro',
        condition: 'new' as const
      },
      {
      name: 'Lockbox Systems',
        category: 'equipment' as const,
      subcategory: 'Security',
        quantity: Math.max(8, Math.floor(propertiesData.length * 0.6)),
      minStock: 5,
      maxStock: 15,
      unitPrice: 125,
      location: 'Security Storage',
      supplier: 'SecureTech Solutions',
        condition: 'good' as const
      },
      {
        name: 'Staging Furniture Set',
        category: 'property' as const,
        subcategory: 'Staging',
        quantity: Math.max(3, Math.floor(propertiesData.filter(p => p.type === 'Luxury').length * 0.5)),
        minStock: 2,
        maxStock: 10,
        unitPrice: 850,
        location: 'Warehouse',
        supplier: 'Elite Staging Co.',
        condition: 'good' as const
      },
      {
        name: 'Cleaning Supplies Kit',
        category: 'supplies' as const,
        subcategory: 'Maintenance',
        quantity: Math.max(10, Math.floor(propertiesData.length * 0.3)),
        minStock: 15,
        maxStock: 50,
        unitPrice: 75,
        location: 'Utility Storage',
        supplier: 'CleanPro Supplies',
        condition: 'new' as const
      },
      {
        name: 'Business Cards',
        category: 'supplies' as const,
        subcategory: 'Marketing',
        quantity: 500,
        minStock: 200,
        maxStock: 1000,
        unitPrice: 0.25,
        location: 'Office Supply',
        supplier: 'PrintPro',
        condition: 'new' as const
      },
      {
        name: 'Property Brochures',
        category: 'supplies' as const,
        subcategory: 'Marketing',
        quantity: Math.max(100, propertiesData.length * 20),
        minStock: 50,
        maxStock: 500,
        unitPrice: 2.50,
        location: 'Marketing Storage',
        supplier: 'PrintPro',
        condition: 'new' as const
      },
      {
        name: 'Measuring Tape (Professional)',
        category: 'equipment' as const,
        subcategory: 'Tools',
        quantity: 6,
        minStock: 3,
        maxStock: 10,
        unitPrice: 45,
        location: 'Tool Storage',
        supplier: 'ProTools Inc',
        condition: 'good' as const
      }
    ];

    baseItems.forEach((item, index) => {
      const quantity = item.quantity;
      const status: InventoryItem['status'] = 
        quantity === 0 ? 'out-of-stock' :
        quantity <= item.minStock ? 'low-stock' :
        Math.random() < 0.1 ? 'on-order' : 'in-stock';

      inventory.push({
        id: `INV-${String(index + 1).padStart(3, '0')}`,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        quantity,
        minStock: item.minStock,
        maxStock: item.maxStock,
        unitPrice: item.unitPrice,
        totalValue: quantity * item.unitPrice,
        location: item.location,
        supplier: item.supplier,
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status,
        condition: item.condition,
        notes: `Auto-generated based on ${item.category} needs`
      });
    });

    // Add property-specific items
    propertiesData.forEach((property, index) => {
      if (property.type === 'Luxury' && Math.random() < 0.3) {
        inventory.push({
          id: `PROP-${property.id}-${index}`,
          name: `Luxury Staging for ${property.title}`,
          category: 'property',
          subcategory: 'Staging',
          quantity: 1,
          minStock: 0,
          maxStock: 1,
          unitPrice: 5000,
          totalValue: 5000,
          location: property.address || 'Property Location',
          supplier: 'Premium Staging Co.',
          lastUpdated: property.updated_at || property.createdAt || new Date().toISOString().split('T')[0],
          status: 'in-stock',
          condition: 'good',
          propertyId: property.id,
          notes: `Staging items for luxury property: ${property.title}`
        });
      }
    });

    return inventory;
  };

  // Calculate inventory statistics
  const calculateInventoryStats = (inventory: InventoryItem[]) => {
    const stats = {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
      lowStockItems: inventory.filter(item => item.status === 'low-stock').length,
      outOfStockItems: inventory.filter(item => item.status === 'out-of-stock').length,
      onOrderItems: inventory.filter(item => item.status === 'on-order').length,
      monthlyTurnover: 12.5 // Simulated turnover rate
    };

    setInventoryStats(stats);
  };

  // Add new inventory item
  const handleAddItem = () => {
    if (newItem.name && newItem.unitPrice > 0) {
      const quantity = newItem.quantity;
      const status: InventoryItem['status'] = 
        quantity === 0 ? 'out-of-stock' :
        quantity <= newItem.minStock ? 'low-stock' : 'in-stock';
    
    const item: InventoryItem = {
        id: `INV-${Date.now().toString().slice(-6)}`,
        name: newItem.name,
        category: newItem.category,
        subcategory: newItem.subcategory,
      quantity,
        minStock: newItem.minStock,
        maxStock: newItem.maxStock,
        unitPrice: newItem.unitPrice,
        totalValue: quantity * newItem.unitPrice,
        location: newItem.location,
        supplier: newItem.supplier,
      lastUpdated: new Date().toISOString().split('T')[0],
      status,
        condition: newItem.condition,
        notes: newItem.notes
      };

      const updatedInventory = [...inventoryData, item];
      setInventoryData(updatedInventory);
      calculateInventoryStats(updatedInventory);

      // Reset form
      setNewItem({
        name: '',
        category: 'supplies',
        subcategory: '',
        quantity: 0,
        minStock: 0,
        maxStock: 0,
        unitPrice: 0,
        location: '',
        supplier: '',
        condition: 'new',
        notes: ''
      });

    setShowAddItemModal(false);
      // Success: Inventory item added successfully!
    } else {
      // Success: Please fill in all required fields
    }
  };

  // Update stock quantity
  const handleStockUpdate = (itemId: string, newQuantity: number) => {
    const updatedInventory = inventoryData.map(item => {
      if (item.id === itemId) {
        const status: InventoryItem['status'] = 
          newQuantity === 0 ? 'out-of-stock' :
                  newQuantity <= item.minStock ? 'low-stock' : 'in-stock';

        return {
          ...item,
          quantity: newQuantity,
          totalValue: newQuantity * item.unitPrice,
          status,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    setInventoryData(updatedInventory);
    calculateInventoryStats(updatedInventory);
    setShowStockUpdateModal(false);
    setSelectedItem(null);
    // Success: Stock updated successfully!
  };

  // Delete inventory item
  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      const updatedInventory = inventoryData.filter(item => item.id !== itemId);
      setInventoryData(updatedInventory);
      calculateInventoryStats(updatedInventory);
      // Success: Inventory item deleted successfully!
    }
  };

  // Create purchase order
  const handleCreateOrder = (orderData: any) => {
    // Update items to "on-order" status
    const itemsToOrder = orderData.items || [];
    const updatedInventory = inventoryData.map(item => {
      if (itemsToOrder.includes(item.id)) {
        return { ...item, status: 'on-order' as const };
      }
      return item;
    });

    setInventoryData(updatedInventory);
    calculateInventoryStats(updatedInventory);
    setShowCreateOrderModal(false);
    // Success: Purchase order created for ${itemsToOrder.length} items!
  };

  // Export inventory report
  const handleExportReport = () => {
    const csvData = [
      ['Inventory Report - Generated on ' + new Date().toLocaleDateString()],
      [''],
      ['Summary'],
      ['Total Items', inventoryStats.totalItems.toString()],
      ['Total Value', '$' + inventoryStats.totalValue.toLocaleString()],
      ['Low Stock Items', inventoryStats.lowStockItems.toString()],
      ['Out of Stock Items', inventoryStats.outOfStockItems.toString()],
      ['On Order Items', inventoryStats.onOrderItems.toString()],
      [''],
      ['Detailed Inventory'],
      ['ID', 'Name', 'Category', 'Subcategory', 'Quantity', 'Min Stock', 'Max Stock', 'Unit Price', 'Total Value', 'Location', 'Supplier', 'Status', 'Condition', 'Last Updated'],
      ...inventoryData.map(item => [
        item.id,
        item.name,
        item.category,
        item.subcategory,
        item.quantity.toString(),
        item.minStock.toString(),
        item.maxStock.toString(),
        '$' + item.unitPrice.toFixed(2),
        '$' + item.totalValue.toFixed(2),
        item.location,
        item.supplier,
        item.status,
        item.condition,
        item.lastUpdated
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    // Success: Inventory report exported successfully!
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'on-order': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'needs-repair': return 'bg-orange-100 text-orange-800';
      case 'retired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter inventory items
  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Get unique locations for filter
  const locations = [...new Set(inventoryData.map(item => item.location))];

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
          <button 
            onClick={() => setShowAddItemModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Add New Item</span>
          </button>
          <button 
            onClick={() => setShowStockUpdateModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Stock Update</span>
          </button>
          <button 
            onClick={handleExportReport}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Export Report</span>
          </button>
          <button 
            onClick={() => setShowCreateOrderModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
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
              {filteredInventory.map((item) => (
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

        {/* Add Item Modal */}
        {showAddItemModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddItemModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Inventory Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option value="property">Property</option>
                      <option value="equipment">Equipment</option>
                      <option value="supplies">Supplies</option>
                      <option value="materials">Materials</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                    <input
                      type="text"
                      placeholder="Enter subcategory"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Storage location"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Stock</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <input
                    type="text"
                    placeholder="Supplier name"
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
                    onClick={handleAddItem}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock Update Modal */}
        {showStockUpdateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowStockUpdateModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Stock</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {inventoryData.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Current: {item.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Quantity</label>
                    <input
                      type="number"
                      placeholder="Enter new quantity"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Reason</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="restock">Restock</option>
                      <option value="sale">Sale/Usage</option>
                      <option value="damaged">Damaged/Lost</option>
                      <option value="returned">Returned</option>
                      <option value="adjustment">Inventory Adjustment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Additional notes"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowStockUpdateModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleStockUpdate('', 0)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Update Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Order Modal */}
        {showCreateOrderModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateOrderModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Purchase Order</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">Select Supplier</option>
                        <option value="TechPro Equipment">TechPro Equipment</option>
                        <option value="Elite Staging Co.">Elite Staging Co.</option>
                        <option value="SignCraft Pro">SignCraft Pro</option>
                        <option value="CleanPro Supplies">CleanPro Supplies</option>
                        <option value="SecureTech Solutions">SecureTech Solutions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expected Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Items</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                      {inventoryData.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').map(item => (
                        <label key={item.id} className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                          <span className="text-sm text-gray-900">{item.name}</span>
                          <span className="text-xs text-gray-500">({item.status})</span>
                          <input 
                            type="number" 
                            placeholder="Qty"
                            className="w-16 px-2 py-1 text-xs border border-gray-200 rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Special instructions or notes"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateOrderModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleCreateOrder({})}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    Create Order
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

export default InventoryManager; 