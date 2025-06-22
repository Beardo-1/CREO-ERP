import React, { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Database,
  FileText,
  Users,
  Home,
  Handshake,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Save,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { unifiedDataService } from '../../services/unifiedDataService';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface DataStats {
  properties: number;
  contacts: number;
  deals: number;
  agents: number;
  lastUpdated: Date;
}

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  warnings: string[];
}

export function DataManager() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'contacts' | 'deals' | 'agents' | 'import' | 'export'>('overview');
  const [dataStats, setDataStats] = useState<DataStats>({
    properties: 0,
    contacts: 0,
    deals: 0,
    agents: 0,
    lastUpdated: new Date()
  });
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'properties' | 'contacts' | 'deals' | 'agents'>('properties');

  // Load current data stats
  useEffect(() => {
    loadDataStats();
  }, []);

  const loadDataStats = () => {
    setDataStats({
      properties: unifiedDataService.getProperties().length,
      contacts: unifiedDataService.getContacts().length,
      deals: unifiedDataService.getDeals().length,
      agents: unifiedDataService.getAgents().length,
      lastUpdated: new Date()
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const text = await file.text();
      let data;

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(text);
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV.');
      }

      const result = await importData(importType, data);
      setImportResult(result);
      loadDataStats();
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        warnings: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        data.push(obj);
      }
    }

    return data;
  };

  const importData = async (type: string, data: any[]): Promise<ImportResult> => {
    const errors: string[] = [];
    let imported = 0;

    try {
      data.forEach((item, index) => {
        try {
          switch (type) {
            case 'properties':
              unifiedDataService.addProperty(item);
              break;
            case 'contacts':
              unifiedDataService.addContact(item);
              break;
            case 'deals':
              unifiedDataService.addDeal(item);
              break;
            case 'agents':
              unifiedDataService.addAgent(item);
              break;
          }
          imported++;
        } catch (error) {
          errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
        }
      });

      return {
        success: errors.length === 0,
        imported,
        errors,
        warnings: []
      };
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Import failed'],
        warnings: []
      };
    }
  };

  const exportData = (type: string, format: 'json' | 'csv' = 'csv') => {
    let data: any[];
    switch (type) {
      case 'properties':
        data = unifiedDataService.getProperties();
        break;
      case 'contacts':
        data = unifiedDataService.getContacts();
        break;
      case 'deals':
        data = unifiedDataService.getDeals();
        break;
      case 'agents':
        data = unifiedDataService.getAgents();
        break;
      default:
        data = [];
    }

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        // Success: No data to export
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(item => 
          headers.map(header => {
            const value = item[header];
            // Handle values with commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `creo-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // JSON export
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `creo-${type}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const clearData = (type: string) => {
    if (confirm(`Are you sure you want to clear all ${type} data? This action cannot be undone.`)) {
      switch (type) {
        case 'properties':
          unifiedDataService.setProperties([]);
          break;
        case 'contacts':
          unifiedDataService.setContacts([]);
          break;
        case 'deals':
          unifiedDataService.setDeals([]);
          break;
        case 'agents':
          unifiedDataService.setAgents([]);
          break;
      }
      loadDataStats();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.deals.dataManagementCenter)}</h1>
          <p className="text-gray-600">{t(appContent.deals.dataManagementSubtitle)}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t(appContent.deals.properties)}</p>
                <p className="text-2xl font-bold text-blue-600">{dataStats.properties}</p>
              </div>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t(appContent.deals.contacts)}</p>
                <p className="text-2xl font-bold text-green-600">{dataStats.contacts}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t(appContent.deals.deals)}</p>
                <p className="text-2xl font-bold text-purple-600">{dataStats.deals}</p>
              </div>
              <Handshake className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t(appContent.deals.agents)}</p>
                <p className="text-2xl font-bold text-orange-600">{dataStats.agents}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: t(appContent.deals.overview), icon: Database },
                { id: 'import', label: t(appContent.deals.importData), icon: Upload },
                { id: 'export', label: t(appContent.deals.exportData), icon: Download }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.deals.quickActions)}</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('import')}
                        className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-blue-600" />
                        <span>{t(appContent.deals.importNewData)}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('export')}
                        className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5 text-purple-600" />
                        <span>{t(appContent.deals.exportAllData)}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.deals.dataStatus)}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t(appContent.deals.lastUpdated)}</span>
                        <span className="font-medium">{dataStats.lastUpdated.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t(appContent.deals.totalRecords)}</span>
                        <span className="font-medium">{dataStats.properties + dataStats.contacts + dataStats.deals + dataStats.agents}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Import Tab */}
            {activeTab === 'import' && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.deals.importData)}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t(appContent.deals.dataType)}
                      </label>
                      <select
                        value={importType}
                        onChange={(e) => setImportType(e.target.value as any)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="properties">{t(appContent.deals.properties)}</option>
                        <option value="contacts">{t(appContent.deals.contacts)}</option>
                        <option value="deals">{t(appContent.deals.deals)}</option>
                        <option value="agents">{t(appContent.deals.agents)}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t(appContent.deals.uploadFile)}
                      </label>
                      <input
                        type="file"
                        accept=".json,.csv"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {isLoading && (
                    <div className="mt-4 flex items-center space-x-2 text-blue-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing file...</span>
                    </div>
                  )}

                  {importResult && (
                    <div className={`mt-4 p-4 rounded-lg ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {importResult.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                          {importResult.success ? 'Import Successful' : 'Import Failed'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Imported {importResult.imported} records
                      </p>
                      {importResult.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-red-800">Errors:</p>
                          <ul className="text-sm text-red-600 list-disc list-inside">
                            {importResult.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.deals.exportData)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['properties', 'contacts', 'deals', 'agents'].map((type) => (
                      <div key={type} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-center mb-4">
                          <h4 className="font-medium text-gray-900 capitalize">{type}</h4>
                          <p className="text-sm text-gray-500">
                            {(dataStats as any)[type]} records
                          </p>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => exportData(type)}
                            className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Export JSON</span>
                          </button>
                          <button
                            onClick={() => clearData(type)}
                            className="w-full flex items-center justify-center space-x-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear Data</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 