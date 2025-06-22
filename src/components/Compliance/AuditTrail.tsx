import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { 
  Shield, 
  Clock, 
  User, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Download, 
  Filter, 
  Search, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Settings, 
  Database, 
  Lock, 
  Unlock, 
  Key, 
  Activity, 
  Monitor, 
  Smartphone, 
  Globe, 
  MapPin, 
  Wifi, 
  Server,
  Archive,
  RefreshCw,
  ExternalLink,
  Flag,
  Tag,
  Hash,
  Layers,
  GitBranch,
  History,
  Upload,
  DollarSign,
  Scale,
  Tablet
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'import' | 'approve' | 'reject' | 'archive';
  resource: string;
  resourceType: 'property' | 'contact' | 'deal' | 'document' | 'user' | 'system' | 'report' | 'template' | 'setting';
  resourceId?: string;
  description: string;
  details: AuditDetails;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'data' | 'system' | 'user' | 'compliance' | 'financial' | 'legal';
  ipAddress: string;
  userAgent: string;
  location?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'api';
  sessionId: string;
  success: boolean;
  errorMessage?: string;
  changes?: AuditChange[];
  metadata: Record<string, any>;
}

interface AuditDetails {
  module: string;
  subModule?: string;
  operation: string;
  affectedRecords: number;
  dataSize?: string;
  duration?: number;
  apiEndpoint?: string;
  httpMethod?: string;
  responseCode?: number;
}

interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  fieldType: string;
}

interface AuditFilter {
  dateRange: { start: string; end: string };
  users: string[];
  actions: string[];
  resources: string[];
  severity: string[];
  categories: string[];
  success?: boolean;
}

export function AuditTrail() {
  const { t } = useTranslation();
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-20T10:30:00Z',
      userId: 'user-123',
      userName: 'John Smith',
      userRole: 'Agent',
      action: 'update',
      resource: 'Property Listing - 123 Oak Street',
      resourceType: 'property',
      resourceId: 'prop-123',
      description: 'Updated property listing price and description',
      details: {
        module: 'Properties',
        subModule: 'Listings',
        operation: 'Update Property',
        affectedRecords: 1,
        duration: 1250
      },
      severity: 'medium',
      category: 'data',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Chicago, IL',
      deviceType: 'desktop',
      sessionId: 'sess-abc123',
      success: true,
      changes: [
        {
          field: 'price',
          oldValue: 450000,
          newValue: 465000,
          fieldType: 'currency'
        },
        {
          field: 'description',
          oldValue: 'Beautiful home with garden',
          newValue: 'Beautiful home with garden and updated kitchen',
          fieldType: 'text'
        }
      ],
      metadata: {
        browser: 'Chrome',
        os: 'Windows 10',
        referrer: '/properties/listings'
      }
    },
    {
      id: '2',
      timestamp: '2024-01-20T09:15:00Z',
      userId: 'user-456',
      userName: 'Sarah Johnson',
      userRole: 'Manager',
      action: 'create',
      resource: 'New Deal - Johnson Purchase',
      resourceType: 'deal',
      resourceId: 'deal-789',
      description: 'Created new purchase deal for client',
      details: {
        module: 'Deals',
        operation: 'Create Deal',
        affectedRecords: 1,
        duration: 850
      },
      severity: 'low',
      category: 'data',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'Springfield, IL',
      deviceType: 'desktop',
      sessionId: 'sess-def456',
      success: true,
      metadata: {
        browser: 'Safari',
        os: 'macOS',
        dealValue: 380000
      }
    },
    {
      id: '3',
      timestamp: '2024-01-20T08:45:00Z',
      userId: 'user-789',
      userName: 'Mike Wilson',
      userRole: 'Admin',
      action: 'login',
      resource: 'System Login',
      resourceType: 'system',
      description: 'User logged into the system',
      details: {
        module: 'Authentication',
        operation: 'User Login',
        affectedRecords: 0,
        duration: 320
      },
      severity: 'low',
      category: 'security',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      location: 'Chicago, IL',
      deviceType: 'mobile',
      sessionId: 'sess-ghi789',
      success: true,
      metadata: {
        browser: 'Safari Mobile',
        os: 'iOS 15',
        loginMethod: 'password'
      }
    },
    {
      id: '4',
      timestamp: '2024-01-20T08:30:00Z',
      userId: 'user-321',
      userName: 'Emma Davis',
      userRole: 'Agent',
      action: 'delete',
      resource: 'Contact - Old Lead',
      resourceType: 'contact',
      resourceId: 'contact-456',
      description: 'Deleted inactive contact record',
      details: {
        module: 'Contacts',
        operation: 'Delete Contact',
        affectedRecords: 1,
        duration: 450
      },
      severity: 'high',
      category: 'data',
      ipAddress: '192.168.1.115',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Peoria, IL',
      deviceType: 'desktop',
      sessionId: 'sess-jkl012',
      success: true,
      metadata: {
        browser: 'Edge',
        os: 'Windows 10',
        reason: 'Inactive for 2+ years'
      }
    },
    {
      id: '5',
      timestamp: '2024-01-20T07:20:00Z',
      userId: 'system',
      userName: 'System',
      userRole: 'System',
      action: 'export',
      resource: 'Monthly Sales Report',
      resourceType: 'report',
      description: 'Automated monthly report generation',
      details: {
        module: 'Reports',
        operation: 'Generate Report',
        affectedRecords: 245,
        dataSize: '2.4 MB',
        duration: 15000
      },
      severity: 'low',
      category: 'system',
      ipAddress: '127.0.0.1',
      userAgent: 'System/1.0',
      deviceType: 'api',
      sessionId: 'sys-auto-001',
      success: true,
      metadata: {
        reportType: 'monthly-sales',
        format: 'PDF',
        recipients: ['manager@company.com']
      }
    }
  ]);

  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterResource, setFilterResource] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="w-4 h-4" />;
      case 'read': return <Eye className="w-4 h-4" />;
      case 'update': return <Edit className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'login': return <Key className="w-4 h-4" />;
      case 'logout': return <Lock className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      case 'import': return <Upload className="w-4 h-4" />;
      case 'approve': return <CheckCircle className="w-4 h-4" />;
      case 'reject': return <XCircle className="w-4 h-4" />;
      case 'archive': return <Archive className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'login': return 'bg-purple-100 text-purple-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      case 'export': return 'bg-indigo-100 text-indigo-800';
      case 'import': return 'bg-orange-100 text-orange-800';
      case 'approve': return 'bg-green-100 text-green-800';
      case 'reject': return 'bg-red-100 text-red-800';
      case 'archive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'system': return <Server className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'compliance': return <Flag className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      case 'legal': return <Scale className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'api': return <Server className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || entry.action === filterAction;
    const matchesResource = filterResource === 'all' || entry.resourceType === filterResource;
    const matchesSeverity = filterSeverity === 'all' || entry.severity === filterSeverity;
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesUser = filterUser === 'all' || entry.userId === filterUser;
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const entryDate = new Date(entry.timestamp);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = entryDate >= startDate && entryDate <= endDate;
    }
    
    return matchesSearch && matchesAction && matchesResource && matchesSeverity && 
           matchesCategory && matchesUser && matchesDate;
  });

  const auditStats = {
    total: auditEntries.length,
    today: auditEntries.filter(e => {
      const today = new Date().toDateString();
      return new Date(e.timestamp).toDateString() === today;
    }).length,
    failed: auditEntries.filter(e => !e.success).length,
    critical: auditEntries.filter(e => e.severity === 'critical').length,
    security: auditEntries.filter(e => e.category === 'security').length
  };

  const uniqueUsers = [...new Set(auditEntries.map(e => e.userName))];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(appContent.deals.auditTrail)}</h1>
        <p className="text-gray-600">{t(appContent.deals.auditTrailSubtitle)}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{auditStats.total}</p>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{auditStats.today}</p>
              <p className="text-sm text-gray-600">Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{auditStats.failed}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{auditStats.critical}</p>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{auditStats.security}</p>
              <p className="text-sm text-gray-600">Security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <Filter className="w-4 h-4 mr-2 inline" />
              Filters
            </button>
          </div>

          <div className="flex space-x-3">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 ${viewMode === 'timeline' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Timeline
              </button>
            </div>

            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-medium transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="read">Read</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="export">Export</option>
                <option value="import">Import</option>
              </select>

              <select
                value={filterResource}
                onChange={(e) => setFilterResource(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Resources</option>
                <option value="property">Property</option>
                <option value="contact">Contact</option>
                <option value="deal">Deal</option>
                <option value="document">Document</option>
                <option value="user">User</option>
                <option value="system">System</option>
                <option value="report">Report</option>
              </select>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="security">Security</option>
                <option value="data">Data</option>
                <option value="system">System</option>
                <option value="user">User</option>
                <option value="compliance">Compliance</option>
                <option value="financial">Financial</option>
                <option value="legal">Legal</option>
              </select>

              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateRange({ start: '', end: '' });
                  setFilterAction('all');
                  setFilterResource('all');
                  setFilterSeverity('all');
                  setFilterCategory('all');
                  setFilterUser('all');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Entries */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        {viewMode === 'list' ? (
          <div className="divide-y divide-gray-200">
            {filteredEntries.map(entry => (
              <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(entry.action)}`}>
                        {getActionIcon(entry.action)}
                      </div>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(entry.category)}
                        {getDeviceIcon(entry.deviceType)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{entry.resource}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(entry.severity)}`}>
                          {entry.severity}
                        </span>
                        {!entry.success && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Failed
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{entry.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">User:</span> {entry.userName} ({entry.userRole})
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">IP:</span> {entry.ipAddress}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {entry.location || 'Unknown'}
                        </div>
                      </div>
                      
                      {entry.details.duration && (
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Duration:</span> {entry.details.duration}ms
                          {entry.details.affectedRecords > 0 && (
                            <span className="ml-4">
                              <span className="font-medium">Records:</span> {entry.details.affectedRecords}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {filteredEntries.map((entry, index) => (
                  <div key={entry.id} className="relative flex items-start space-x-4">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${getActionColor(entry.action)}`}>
                      {getActionIcon(entry.action)}
                    </div>
                    
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{entry.resource}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{entry.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{entry.userName}</span>
                        <span>•</span>
                        <span>{entry.ipAddress}</span>
                        <span>•</span>
                        <span className="capitalize">{entry.action}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(entry.severity)}`}>
                          {entry.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEntry(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Audit Entry Details</h2>
                  <p className="text-gray-600">{selectedEntry.resource}</p>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Event Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Action:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(selectedEntry.action)}`}>
                        {getActionIcon(selectedEntry.action)}
                        <span className="ml-1 capitalize">{selectedEntry.action}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="font-medium">{new Date(selectedEntry.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resource Type:</span>
                      <span className="font-medium capitalize">{selectedEntry.resourceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severity:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedEntry.severity)}`}>
                        {selectedEntry.severity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{selectedEntry.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEntry.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedEntry.success ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">User & Session</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">User:</span>
                      <span className="font-medium">{selectedEntry.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium">{selectedEntry.userRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IP Address:</span>
                      <span className="font-medium">{selectedEntry.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedEntry.location || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Device:</span>
                      <span className="font-medium capitalize">{selectedEntry.deviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session ID:</span>
                      <span className="font-mono text-xs">{selectedEntry.sessionId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operation Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Operation Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Module:</span>
                      <span className="font-medium ml-2">{selectedEntry.details.module}</span>
                    </div>
                    {selectedEntry.details.subModule && (
                      <div>
                        <span className="text-gray-600">Sub-Module:</span>
                        <span className="font-medium ml-2">{selectedEntry.details.subModule}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Operation:</span>
                      <span className="font-medium ml-2">{selectedEntry.details.operation}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Affected Records:</span>
                      <span className="font-medium ml-2">{selectedEntry.details.affectedRecords}</span>
                    </div>
                    {selectedEntry.details.duration && (
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium ml-2">{selectedEntry.details.duration}ms</span>
                      </div>
                    )}
                    {selectedEntry.details.dataSize && (
                      <div>
                        <span className="text-gray-600">Data Size:</span>
                        <span className="font-medium ml-2">{selectedEntry.details.dataSize}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Changes */}
              {selectedEntry.changes && selectedEntry.changes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Changes Made</h4>
                  <div className="space-y-3">
                    {selectedEntry.changes.map((change, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{change.field}</span>
                          <span className="text-xs text-gray-500 capitalize">{change.fieldType}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Old Value:</span>
                            <div className="bg-red-50 border border-red-200 rounded p-2 mt-1">
                              <span className="text-red-800">{String(change.oldValue)}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">New Value:</span>
                            <div className="bg-green-50 border border-green-200 rounded p-2 mt-1">
                              <span className="text-green-800">{String(change.newValue)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {Object.entries(selectedEntry.metadata).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium ml-2">{String(value)}</span>
                      </div>
                    ))}
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