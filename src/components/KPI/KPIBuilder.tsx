import React, { useState } from 'react';
import { 
  Plus, 
  BarChart3, 
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Target,
  TrendingUp
} from 'lucide-react';

interface SimpleKPI {
  id: string;
  name: string;
  description: string;
  value: number;
  target?: number;
  category: string;
  color: string;
}

export function KPIBuilder() {
  const [kpis, setKpis] = useState<SimpleKPI[]>([
        {
          id: '1',
          name: 'Total Revenue',
      description: 'Monthly revenue generated',
      value: 85000,
          target: 100000,
      category: 'Financial',
      color: '#10b981'
        },
        {
          id: '2',
          name: 'Active Listings',
          description: 'Number of active property listings',
      value: 24,
      target: 30,
      category: 'Properties',
      color: '#3b82f6'
    },
    {
      id: '3',
      name: 'New Leads',
      description: 'New leads this month',
      value: 42,
      category: 'Sales',
      color: '#f59e0b'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingKPI, setEditingKPI] = useState<SimpleKPI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKPIs = kpis.filter(kpi => 
    kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpi.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddKPI = () => {
    setEditingKPI({
      id: Date.now().toString(),
      name: '',
      description: '',
      value: 0,
      category: 'General',
      color: '#6366f1'
    });
    setShowForm(true);
  };

  const handleEditKPI = (kpi: SimpleKPI) => {
    setEditingKPI(kpi);
    setShowForm(true);
  };

  const handleSaveKPI = () => {
    if (!editingKPI || !editingKPI.name) return;

    if (kpis.find(k => k.id === editingKPI.id)) {
      // Update existing
      setKpis(kpis.map(k => k.id === editingKPI.id ? editingKPI : k));
    } else {
      // Add new
      setKpis([...kpis, editingKPI]);
    }

    setShowForm(false);
    setEditingKPI(null);
  };

  const handleDeleteKPI = (id: string) => {
    setKpis(kpis.filter(k => k.id !== id));
  };

  const getProgressPercentage = (value: number, target?: number) => {
    if (!target) return 0;
    return Math.min((value / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
              <h1 className="text-3xl font-bold text-gray-900">KPI Management</h1>
              <p className="text-gray-600">Create and manage your key performance indicators</p>
          </div>
            <button
              onClick={handleAddKPI}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add KPI</span>
            </button>
        </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search KPIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKPIs.map((kpi) => (
            <div key={kpi.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: kpi.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
                    <p className="text-sm text-gray-600">{kpi.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditKPI(kpi)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteKPI(kpi.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{kpi.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {kpi.value.toLocaleString()}
                  </span>
                  {kpi.target && (
                    <span className="text-sm text-gray-600">
                      / {kpi.target.toLocaleString()}
                    </span>
                  )}
              </div>

              {kpi.target && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                        {getProgressPercentage(kpi.value, kpi.target).toFixed(1)}%
                    </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          backgroundColor: kpi.color,
                          width: `${getProgressPercentage(kpi.value, kpi.target)}%`
                        }}
                      />
                    </div>
                </div>
              )}
              </div>
            </div>
          ))}
      </div>

        {/* Empty State */}
        {filteredKPIs.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No KPIs Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Create your first KPI to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddKPI}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First KPI</span>
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && editingKPI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {kpis.find(k => k.id === editingKPI.id) ? 'Edit KPI' : 'Add New KPI'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">KPI Name</label>
                        <input
                          type="text"
                    value={editingKPI.name}
                          onChange={(e) => setEditingKPI({ ...editingKPI, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter KPI name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                    value={editingKPI.description}
                          onChange={(e) => setEditingKPI({ ...editingKPI, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Describe what this KPI measures"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Value</label>
                        <input
                          type="number"
                      value={editingKPI.value}
                      onChange={(e) => setEditingKPI({ ...editingKPI, value: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Target (Optional)</label>
                          <input
                            type="number"
                            value={editingKPI.target || ''}
                            onChange={(e) => setEditingKPI({ ...editingKPI, target: parseFloat(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={editingKPI.category}
                    onChange={(e) => setEditingKPI({ ...editingKPI, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Financial">Financial</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Properties">Properties</option>
                    <option value="Operations">Operations</option>
                    <option value="General">General</option>
                  </select>
                </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                      value={editingKPI.color}
                            onChange={(e) => setEditingKPI({ ...editingKPI, color: e.target.value })}
                            className="w-12 h-10 border border-gray-200 rounded-lg"
                          />
                          <input
                            type="text"
                      value={editingKPI.color}
                            onChange={(e) => setEditingKPI({ ...editingKPI, color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKPI}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save KPI</span>
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
    </div>
  );
}