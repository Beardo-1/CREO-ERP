import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Scale, 
  Eye,
  Download,
  Upload,
  Bell,
  Calendar,
  User,
  Building,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Award,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Lock,
  Unlock,
  Star,
  Flag,
  Target,
  Database,
  Mail,
  Phone
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  title: string;
  category: 'license' | 'disclosure' | 'contract' | 'regulation' | 'certification' | 'legal' | 'financial' | 'operational' | 'safety' | 'environmental' | 'data';
  status: 'compliant' | 'warning' | 'violation' | 'pending' | 'non-compliant' | 'expired';
  priority: 'high' | 'medium' | 'low' | 'critical';
  dueDate: Date;
  lastReviewed: Date;
  assignedTo: string;
  description: string;
  requirements: string[];
  documents: ComplianceDocument[];
  actions: ComplianceAction[];
  riskLevel: number;
  completionPercentage: number;
  nextReviewDate: string;
  regulatoryBody: string;
  penalties?: string;
}

interface ComplianceDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  expiryDate?: Date;
  status: 'valid' | 'expiring' | 'expired';
}

interface ComplianceAction {
  id: string;
  action: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  assignedTo: string;
}

interface LegalUpdate {
  id: string;
  title: string;
  category: string;
  date: Date;
  impact: 'high' | 'medium' | 'low';
  summary: string;
  source: string;
  actionRequired: boolean;
}

interface ComplianceAudit {
  id: string;
  date: string;
  auditor: string;
  type: 'internal' | 'external' | 'regulatory';
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed';
  score: number;
  findings: AuditFinding[];
  recommendations: string[];
}

interface AuditFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  remediation: string;
  status: 'open' | 'in-progress' | 'resolved';
  dueDate: string;
}

export function ComplianceDashboard() {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [legalUpdates, setLegalUpdates] = useState<LegalUpdate[]>([]);
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'calendar'>('overview');
  const [audits, setAudits] = useState<ComplianceAudit[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'audits' | 'training' | 'reports'>('overview');

  useEffect(() => {
    // Mock data - in real app, this would come from compliance management APIs
    const mockComplianceItems: ComplianceItem[] = [
      {
        id: '1',
        title: 'Real Estate License Renewal',
        category: 'license',
        status: 'warning',
        priority: 'high',
        dueDate: new Date(2024, 11, 30),
        lastReviewed: new Date(2024, 10, 15),
        assignedTo: 'John Smith',
        description: 'Annual real estate license renewal required for continued practice',
        requirements: [
          'Complete 45 hours of continuing education',
          'Submit renewal application',
          'Pay renewal fees ($350)',
          'Background check clearance'
        ],
        documents: [
          {
            id: 'd1',
            name: 'Current License Certificate',
            type: 'PDF',
            uploadDate: new Date(2023, 11, 15),
            expiryDate: new Date(2024, 11, 30),
            status: 'expiring'
          },
          {
            id: 'd2',
            name: 'Continuing Education Certificate',
            type: 'PDF',
            uploadDate: new Date(2024, 10, 20),
            status: 'valid'
          }
        ],
        actions: [
          {
            id: 'a1',
            action: 'Complete remaining 15 hours of CE',
            dueDate: new Date(2024, 11, 20),
            status: 'pending',
            assignedTo: 'John Smith'
          },
          {
            id: 'a2',
            action: 'Submit renewal application',
            dueDate: new Date(2024, 11, 25),
            status: 'pending',
            assignedTo: 'John Smith'
          }
        ],
        riskLevel: 8,
        completionPercentage: 60,
        nextReviewDate: '2024-02-15',
        regulatoryBody: 'State Real Estate Commission',
        penalties: 'License suspension, $5,000 fine'
      },
      {
        id: '2',
        title: 'Property Disclosure Compliance',
        category: 'disclosure',
        status: 'compliant',
        priority: 'medium',
        dueDate: new Date(2025, 2, 15),
        lastReviewed: new Date(2024, 11, 10),
        assignedTo: 'Sarah Wilson',
        description: 'Ensure all property disclosures meet state requirements',
        requirements: [
          'Lead-based paint disclosure for pre-1978 properties',
          'Natural hazard disclosure statements',
          'HOA disclosure documents',
          'Property condition disclosures'
        ],
        documents: [
          {
            id: 'd3',
            name: 'Lead Disclosure Template',
            type: 'PDF',
            uploadDate: new Date(2024, 9, 1),
            status: 'valid'
          },
          {
            id: 'd4',
            name: 'Natural Hazard Disclosure Form',
            type: 'PDF',
            uploadDate: new Date(2024, 9, 1),
            status: 'valid'
          }
        ],
        actions: [
          {
            id: 'a3',
            action: 'Review updated disclosure requirements',
            dueDate: new Date(2025, 1, 1),
            status: 'pending',
            assignedTo: 'Sarah Wilson'
          }
        ],
        riskLevel: 6,
        completionPercentage: 100,
        nextReviewDate: '2024-06-01',
        regulatoryBody: 'HUD',
        penalties: 'Fines up to $100,000, legal action'
      },
      {
        id: '3',
        title: 'Fair Housing Training',
        category: 'certification',
        status: 'violation',
        priority: 'high',
        dueDate: new Date(2024, 11, 15),
        lastReviewed: new Date(2024, 8, 20),
        assignedTo: 'All Agents',
        description: 'Mandatory fair housing training for all real estate professionals',
        requirements: [
          'Complete 4-hour fair housing course',
          'Pass certification exam (80% minimum)',
          'Submit completion certificate',
          'Annual refresher training'
        ],
        documents: [
          {
            id: 'd5',
            name: 'Fair Housing Training Materials',
            type: 'PDF',
            uploadDate: new Date(2024, 0, 15),
            expiryDate: new Date(2024, 11, 15),
            status: 'expired'
          }
        ],
        actions: [
          {
            id: 'a4',
            action: 'Schedule team training session',
            dueDate: new Date(2024, 11, 12),
            status: 'overdue',
            assignedTo: 'HR Manager'
          },
          {
            id: 'a5',
            action: 'Update training materials',
            dueDate: new Date(2024, 11, 10),
            status: 'overdue',
            assignedTo: 'Compliance Officer'
          }
        ],
        riskLevel: 9,
        completionPercentage: 40,
        nextReviewDate: '2024-02-01',
        regulatoryBody: 'Data Protection Authority',
        penalties: 'Fines up to 4% of annual revenue'
      }
    ];

    const mockLegalUpdates: LegalUpdate[] = [
      {
        id: '1',
        title: 'New Disclosure Requirements for Climate Risk',
        category: 'Environmental Law',
        date: new Date(2024, 11, 5),
        impact: 'high',
        summary: 'New state law requires disclosure of climate-related risks including flood zones, wildfire areas, and earthquake fault lines.',
        source: 'State Real Estate Commission',
        actionRequired: true
      },
      {
        id: '2',
        title: 'Updated Fair Housing Guidelines',
        category: 'Fair Housing',
        date: new Date(2024, 10, 28),
        impact: 'medium',
        summary: 'HUD has updated guidelines for advertising and marketing practices to ensure compliance with fair housing laws.',
        source: 'HUD',
        actionRequired: true
      },
      {
        id: '3',
        title: 'Digital Signature Law Changes',
        category: 'Contract Law',
        date: new Date(2024, 10, 20),
        impact: 'low',
        summary: 'Minor updates to digital signature requirements for real estate contracts.',
        source: 'State Legislature',
        actionRequired: false
      }
    ];

    const mockAudits: ComplianceAudit[] = [
      {
        id: '1',
        date: '2024-01-15',
        auditor: 'External Compliance Firm',
        type: 'external',
        status: 'completed',
        score: 85,
        findings: [
          {
            id: 'f1',
            severity: 'medium',
            category: 'Documentation',
            description: 'Missing signatures on 3 client agreements',
            remediation: 'Obtain missing signatures within 30 days',
            status: 'in-progress',
            dueDate: '2024-02-15'
          }
        ],
        recommendations: ['Implement digital signature workflow', 'Regular document audits']
      },
      {
        id: '2',
        date: '2024-02-01',
        auditor: 'Internal Audit Team',
        type: 'internal',
        status: 'scheduled',
        score: 0,
        findings: [],
        recommendations: []
      }
    ];

    setComplianceItems(mockComplianceItems);
    setLegalUpdates(mockLegalUpdates);
    setAudits(mockAudits);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'violation': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'non-compliant': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'violation': return AlertCircle;
      case 'pending': return Clock;
      case 'non-compliant': return AlertTriangle;
      case 'expired': return Clock;
      default: return Shield;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'license': return Award;
      case 'disclosure': return FileText;
      case 'contract': return Scale;
      case 'regulation': return Shield;
      case 'certification': return BookOpen;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 8) return 'text-red-600 bg-red-100';
    if (riskLevel >= 6) return 'text-orange-600 bg-orange-100';
    if (riskLevel >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const complianceStats = {
    total: complianceItems.length,
    compliant: complianceItems.filter(item => item.status === 'compliant').length,
    warning: complianceItems.filter(item => item.status === 'warning').length,
    violation: complianceItems.filter(item => item.status === 'violation').length,
    pending: complianceItems.filter(item => item.status === 'pending').length,
    nonCompliant: complianceItems.filter(item => item.status === 'non-compliant').length,
    overdue: complianceItems.filter(item => new Date(item.dueDate) < new Date()).length,
    highRisk: complianceItems.filter(item => item.riskLevel >= 7).length
  };

  const complianceScore = Math.round((complianceStats.compliant / complianceStats.total) * 100);

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance & Legal</h1>
            <p className="text-gray-600">Stay compliant with regulations and legal requirements</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Compliance Item</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Check Updates</span>
            </button>
          </div>
        </div>

        {/* Compliance Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{complianceStats.total}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{complianceStats.compliant}</div>
                <div className="text-sm text-gray-600">Compliant</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{complianceStats.warning}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{complianceStats.violation}</div>
                <div className="text-sm text-gray-600">Violations</div>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{complianceStats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search compliance items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Status</option>
            <option value="compliant">Compliant</option>
            <option value="warning">Warning</option>
            <option value="violation">Violation</option>
            <option value="pending">Pending</option>
            <option value="non-compliant">Non-Compliant</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="license">License</option>
            <option value="disclosure">Disclosure</option>
            <option value="contract">Contract</option>
            <option value="regulation">Regulation</option>
            <option value="certification">Certification</option>
            <option value="legal">Legal</option>
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="safety">Safety</option>
            <option value="environmental">Environmental</option>
            <option value="data">Data Privacy</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance Items */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Items</h2>
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const StatusIcon = getStatusIcon(item.status);
              const CategoryIcon = getCategoryIcon(item.category);
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <CategoryIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="capitalize">{item.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Due Date:</span>
                      <div className="font-medium">{item.dueDate.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Assigned To:</span>
                      <div className="font-medium">{item.assignedTo}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <div className={`font-medium capitalize ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </div>
                    </div>
                  </div>

                  {item.actions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600 mb-2">Pending Actions:</div>
                      <div className="space-y-1">
                        {item.actions.slice(0, 2).map((action) => (
                          <div key={action.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{action.action}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              action.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              action.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {action.status}
                            </span>
                          </div>
                        ))}
                        {item.actions.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{item.actions.length - 2} more actions
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal Updates Sidebar */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Legal Updates</h2>
          <div className="space-y-4">
            {legalUpdates.map((update) => (
              <div
                key={update.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    update.impact === 'high' ? 'bg-red-100 text-red-800' :
                    update.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {update.impact.toUpperCase()} IMPACT
                  </div>
                  {update.actionRequired && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">Action Required</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{update.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{update.summary}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{update.source}</span>
                  <span>{update.date.toLocaleDateString()}</span>
                </div>
                
                <button className="mt-3 flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                  <ExternalLink className="w-4 h-4" />
                  <span>Read Full Update</span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload Document</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <Calendar className="w-5 h-5" />
                <span>Schedule Review</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                <BookOpen className="w-5 h-5" />
                <span>Training Resources</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
                <Bell className="w-5 h-5" />
                <span>Set Reminder</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedItem.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Documents</h3>
                  <div className="space-y-3">
                    {selectedItem.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900">{doc.name}</div>
                            <div className="text-sm text-gray-600">
                              {doc.type} • {doc.uploadDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            doc.status === 'valid' ? 'bg-green-100 text-green-800' :
                            doc.status === 'expiring' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {doc.status}
                          </span>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
                  <div className="space-y-3">
                    {selectedItem.actions.map((action) => (
                      <div key={action.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{action.action}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            action.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            action.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {action.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Due: {action.dueDate.toLocaleDateString()}</div>
                          <div>Assigned to: {action.assignedTo}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">{selectedItem.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`font-medium capitalize ${getPriorityColor(selectedItem.priority)}`}>
                          {selectedItem.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium">{selectedItem.dueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Reviewed:</span>
                        <span className="font-medium">{selectedItem.lastReviewed.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assigned To:</span>
                        <span className="font-medium">{selectedItem.assignedTo}</span>
                      </div>
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