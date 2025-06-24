import React, { useState } from 'react';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock, MapPin, User, DollarSign, TrendingUp, Settings, Plus, Search, Filter } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { safeNestedTranslate } from '../../utils/translationHelpers';

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
  const { t } = useTranslation();
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
      case 'active': return 'bg-green-500 text-white';
      case 'maintenance': return 'bg-yellow-500 text-white';
      case 'repair': return 'bg-red-500 text-white';
      case 'retired': return 'bg-gray-500 text-white';
      case 'missing': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'fair': return 'bg-yellow-500 text-white';
      case 'poor': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-yellow-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      case 'overdue': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.totalEquipment)}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{equipment.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.totalValue)}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${equipment.reduce((sum, eq) => sum + eq.currentValue, 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.needsMaintenance)}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{equipment.filter(eq => eq.status === 'maintenance' || eq.status === 'repair').length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.avgUtilization)}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{Math.round(equipment.reduce((sum, eq) => sum + eq.utilizationRate, 0) / equipment.length)}%</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t(appContent.deals.searchEquipment)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">{t(appContent.deals.allTypes)}</option>
            <option value="camera">{t(appContent.deals.camera)}</option>
            <option value="staging">{t(appContent.deals.staging)}</option>
            <option value="security">{t(appContent.deals.security)}</option>
            <option value="tools">{t(appContent.deals.tools)}</option>
            <option value="technology">{t(appContent.deals.technology)}</option>
            <option value="vehicle">{t(appContent.deals.vehicle)}</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">{t(appContent.deals.allStatus)}</option>
            <option value="active">{t(appContent.deals.active)}</option>
            <option value="maintenance">{t(appContent.deals.maintenance)}</option>
            <option value="repair">{t(appContent.deals.repair)}</option>
            <option value="retired">{t(appContent.deals.retired)}</option>
            <option value="missing">{t(appContent.deals.missing)}</option>
          </select>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>{t(appContent.deals.addEquipment)}</span>
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.model}</p>
                <p className="text-gray-500 text-xs">{item.id}</p>
              </div>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                {t(appContent.deals[item.status as keyof typeof appContent.deals] || { en: item.status, ar: item.status })}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">{t(appContent.deals.currentValue)}</span>
                <span className="text-gray-900 font-semibold">${item.currentValue.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">{t(appContent.deals.condition)}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                  {t(appContent.deals[item.condition as keyof typeof appContent.deals] || { en: item.condition, ar: item.condition })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">{t(appContent.deals.utilization)}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.utilizationRate}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 text-sm font-medium">{item.utilizationRate}%</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <User className="w-4 h-4" />
                  <span>{item.assignedTo}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{t(appContent.deals.nextMaintenance)}: {new Date(item.nextMaintenance).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                  {t(appContent.deals.viewDetails)}
                </button>
                <button className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors">
                  {t(appContent.deals.scheduleMaintenance)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.scheduled)}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{maintenanceRecords.filter(r => r.status === 'scheduled').length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.inProgress)}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{maintenanceRecords.filter(r => r.status === 'in-progress').length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.overdue)}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{maintenanceRecords.filter(r => r.status === 'overdue').length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.completed)}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{maintenanceRecords.filter(r => r.status === 'completed').length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Records Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{t(appContent.deals.maintenanceSchedule)}</h3>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>{t(appContent.deals.scheduleMaintenance)}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.deals.equipment)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.deals.type)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.deals.scheduledDate)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.deals.technician)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.deals.cost)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.taskManagement.priority)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.deals.status)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.deals.actions)}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.equipmentName}</div>
                      <div className="text-sm text-gray-600">{record.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                    {t(appContent.deals[record.type as keyof typeof appContent.deals] || { en: record.type, ar: record.type })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(record.scheduledDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.technician}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${record.cost}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(record.priority)}`}>
                      {t(appContent.taskManagement[record.priority as keyof typeof appContent.taskManagement] || { en: record.priority, ar: record.priority })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMaintenanceStatusColor(record.status)}`}>
                      {t(appContent.deals[record.status.replace('-', '') as keyof typeof appContent.deals] || { en: record.status.replace('-', ' '), ar: record.status.replace('-', ' ') })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">{t(appContent.deals.edit)}</button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">{t(appContent.deals.view)}</button>
                      {record.status === 'scheduled' && (
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">{t(appContent.deals.start)}</button>
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
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.deals.equipmentTrackerTitle)}</h1>
          <p className="text-gray-600">{t(appContent.deals.equipmentTrackerSubtitle)}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg border border-gray-100 w-fit">
            {[
              { id: 'equipment', label: t(appContent.deals.equipmentList), icon: Wrench },
              { id: 'maintenance', label: t(appContent.deals.maintenanceSchedule), icon: Calendar },
              { id: 'analytics', label: t(appContent.deals.analytics), icon: TrendingUp }
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
        <div className="space-y-6">
          {activeTab === 'equipment' && renderEquipmentList()}
          {activeTab === 'maintenance' && renderMaintenanceSchedule()}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <TrendingUp className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(appContent.deals.equipmentAnalytics)}</h3>
              <p className="text-gray-600 mb-6">{t(appContent.deals.equipmentAnalyticsDesc)}</p>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
                {t(appContent.deals.viewAnalytics)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentTracker; 