import React, { useState } from 'react';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock, MapPin, User, DollarSign, TrendingUp, Settings, Plus, Search, Filter } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: 'camera' | 'staging' | 'security' | 'tools' | 'technology' | 'vehicle';
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  location: string;
  assignedTo: string;
  status: 'active' | 'maintenance' | 'repair' | 'retired' | 'missing';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance: string;
  nextMaintenance: string;
  warrantyExpiry: string;
  maintenanceCost: number;
  utilizationRate: number;
}

interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'routine' | 'repair' | 'inspection' | 'calibration' | 'upgrade';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  cost: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

const EquipmentTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample data
  const equipment: Equipment[] = [
    {
      id: 'EQ-001',
      name: 'Professional DSLR Camera',
      type: 'camera',
      model: 'Canon EOS R5',
      serialNumber: 'CN001234567',
      purchaseDate: '2023-03-15',
      purchasePrice: 3500,
      currentValue: 2800,
      location: 'Main Office',
      assignedTo: 'Sarah Johnson',
      status: 'active',
      condition: 'excellent',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      warrantyExpiry: '2025-03-15',
      maintenanceCost: 150,
      utilizationRate: 85
    },
    {
      id: 'EQ-002',
      name: 'Luxury Staging Furniture Set',
      type: 'staging',
      model: 'Elite Collection',
      serialNumber: 'ST-789456',
      purchaseDate: '2023-01-20',
      purchasePrice: 12000,
      currentValue: 9500,
      location: 'Warehouse A',
      assignedTo: 'Mike Chen',
      status: 'active',
      condition: 'good',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-03-15',
      warrantyExpiry: '2025-01-20',
      maintenanceCost: 300,
      utilizationRate: 92
    },
    {
      id: 'EQ-003',
      name: 'Smart Lockbox System',
      type: 'security',
      model: 'SecureTech Pro',
      serialNumber: 'ST-456789',
      purchaseDate: '2023-06-10',
      purchasePrice: 250,
      currentValue: 200,
      location: 'Field Equipment',
      assignedTo: 'David Wilson',
      status: 'maintenance',
      condition: 'fair',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05',
      warrantyExpiry: '2024-06-10',
      maintenanceCost: 75,
      utilizationRate: 78
    },
    {
      id: 'EQ-004',
      name: 'Drone for Aerial Photography',
      type: 'camera',
      model: 'DJI Mavic Pro 3',
      serialNumber: 'DJ-987654',
      purchaseDate: '2023-08-22',
      purchasePrice: 2200,
      currentValue: 1800,
      location: 'Main Office',
      assignedTo: 'Lisa Rodriguez',
      status: 'repair',
      condition: 'poor',
      lastMaintenance: '2023-11-20',
      nextMaintenance: '2024-02-20',
      warrantyExpiry: '2024-08-22',
      maintenanceCost: 450,
      utilizationRate: 65
    },
    {
      id: 'EQ-005',
      name: 'Company Vehicle',
      type: 'vehicle',
      model: 'Toyota Camry 2023',
      serialNumber: 'VIN123456789',
      purchaseDate: '2023-02-01',
      purchasePrice: 28000,
      currentValue: 24000,
      location: 'Main Office Parking',
      assignedTo: 'John Smith',
      status: 'active',
      condition: 'excellent',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      warrantyExpiry: '2026-02-01',
      maintenanceCost: 200,
      utilizationRate: 88
    }
  ];

  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: 'MR-001',
      equipmentId: 'EQ-001',
      equipmentName: 'Professional DSLR Camera',
      type: 'routine',
      description: 'Sensor cleaning and calibration',
      scheduledDate: '2024-04-10',
      technician: 'Tech Solutions Inc.',
      cost: 150,
      status: 'scheduled',
      priority: 'medium',
      notes: 'Regular maintenance to ensure optimal performance'
    },
    {
      id: 'MR-002',
      equipmentId: 'EQ-003',
      equipmentName: 'Smart Lockbox System',
      type: 'repair',
      description: 'Battery replacement and software update',
      scheduledDate: '2024-02-05',
      completedDate: '2024-02-06',
      technician: 'SecureTech Support',
      cost: 75,
      status: 'completed',
      priority: 'high',
      notes: 'Battery was completely drained, replaced with new unit'
    },
    {
      id: 'MR-003',
      equipmentId: 'EQ-004',
      equipmentName: 'Drone for Aerial Photography',
      type: 'repair',
      description: 'Gimbal repair and propeller replacement',
      scheduledDate: '2024-01-25',
      technician: 'DJI Authorized Service',
      cost: 450,
      status: 'in-progress',
      priority: 'critical',
      notes: 'Gimbal damaged during last shoot, needs professional repair'
    },
    {
      id: 'MR-004',
      equipmentId: 'EQ-005',
      equipmentName: 'Company Vehicle',
      type: 'routine',
      description: 'Oil change and tire rotation',
      scheduledDate: '2024-04-15',
      technician: 'AutoCare Center',
      cost: 200,
      status: 'scheduled',
      priority: 'low',
      notes: 'Regular 3-month maintenance service'
    },
    {
      id: 'MR-005',
      equipmentId: 'EQ-002',
      equipmentName: 'Luxury Staging Furniture Set',
      type: 'inspection',
      description: 'Quality inspection and minor repairs',
      scheduledDate: '2024-01-20',
      technician: 'Elite Staging Co.',
      cost: 300,
      status: 'overdue',
      priority: 'medium',
      notes: 'Annual inspection overdue by 2 weeks'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'repair': return 'text-red-600 bg-red-100';
      case 'retired': return 'text-gray-600 bg-gray-100';
      case 'missing': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const renderEquipmentList = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Equipment</p>
              <p className="text-2xl font-bold text-white">{equipment.length}</p>
            </div>
            <Wrench className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">${equipment.reduce((sum, eq) => sum + eq.currentValue, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Needs Maintenance</p>
              <p className="text-2xl font-bold text-white">{equipment.filter(eq => eq.status === 'maintenance' || eq.status === 'repair').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Avg Utilization</p>
              <p className="text-2xl font-bold text-white">{Math.round(equipment.reduce((sum, eq) => sum + eq.utilizationRate, 0) / equipment.length)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Types</option>
            <option value="camera">Camera</option>
            <option value="staging">Staging</option>
            <option value="security">Security</option>
            <option value="tools">Tools</option>
            <option value="technology">Technology</option>
            <option value="vehicle">Vehicle</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="repair">Repair</option>
            <option value="retired">Retired</option>
            <option value="missing">Missing</option>
          </select>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200">
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white">Add Equipment</span>
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-white/70 text-sm">{item.model}</p>
                <p className="text-white/50 text-xs">{item.id}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Current Value</span>
                <span className="text-white font-medium">${item.currentValue.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Condition</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Utilization</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                      style={{ width: `${item.utilizationRate}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{item.utilizationRate}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </div>

              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <User className="w-4 h-4" />
                <span>{item.assignedTo}</span>
              </div>

              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Next Maintenance: {new Date(item.nextMaintenance).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
                  View Details
                </button>
                <button className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-white text-sm hover:from-green-600 hover:to-teal-600 transition-all duration-200">
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMaintenanceSchedule = () => (
    <div className="space-y-6">
      {/* Maintenance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Scheduled</p>
              <p className="text-2xl font-bold text-white">{maintenanceRecords.filter(r => r.status === 'scheduled').length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">{maintenanceRecords.filter(r => r.status === 'in-progress').length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-white">{maintenanceRecords.filter(r => r.status === 'overdue').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{maintenanceRecords.filter(r => r.status === 'completed').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Maintenance Records Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Maintenance Schedule</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200">
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">Schedule Maintenance</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Scheduled Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {maintenanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{record.equipmentName}</div>
                      <div className="text-sm text-white/70">{record.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white capitalize">{record.type}</td>
                  <td className="px-6 py-4 text-sm text-white">{new Date(record.scheduledDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-white">{record.technician}</td>
                  <td className="px-6 py-4 text-sm text-white">${record.cost}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(record.priority)}`}>
                      {record.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMaintenanceStatusColor(record.status)}`}>
                      {record.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-amber-400 hover:text-amber-300 text-sm">Edit</button>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                      {record.status === 'scheduled' && (
                        <button className="text-green-400 hover:text-green-300 text-sm">Start</button>
                      )}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Equipment Tracker</h1>
          <p className="text-white/70">Track and manage real estate equipment and maintenance</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 w-fit">
            {[
              { id: 'equipment', label: 'Equipment List', icon: Wrench },
              { id: 'maintenance', label: 'Maintenance Schedule', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'equipment' && renderEquipmentList()}
          {activeTab === 'maintenance' && renderMaintenanceSchedule()}
          {activeTab === 'analytics' && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
              <TrendingUp className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Equipment Analytics</h3>
              <p className="text-white/70 mb-6">Detailed analytics and performance metrics for equipment</p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105">
                View Analytics
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentTracker; 