import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { 
  FileText, 
  Plus, 
  Edit, 
  Eye, 
  Download, 
  Share2, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter, 
  PenTool, 
  Send, 
  Archive, 
  Trash2,
  Copy,
  ExternalLink,
  Shield,
  Lock,
  Unlock,
  Star,
  Tag,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  type: 'purchase' | 'listing' | 'lease' | 'management' | 'service' | 'employment';
  status: 'draft' | 'pending' | 'signed' | 'executed' | 'expired' | 'terminated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  propertyId?: string;
  propertyAddress?: string;
  parties: ContractParty[];
  value: number;
  currency: string;
  startDate: string;
  endDate?: string;
  signedDate?: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  terms: ContractTerm[];
  clauses: ContractClause[];
  attachments: string[];
  signatures: ContractSignature[];
  reminders: ContractReminder[];
  isTemplate: boolean;
  templateId?: string;
  version: number;
  previousVersions: string[];
}

interface ContractParty {
  id: string;
  name: string;
  role: 'buyer' | 'seller' | 'landlord' | 'tenant' | 'agent' | 'broker' | 'attorney' | 'other';
  email: string;
  phone: string;
  address: string;
  signatureRequired: boolean;
  signedDate?: string;
  signatureMethod?: 'electronic' | 'physical' | 'witnessed';
}

interface ContractTerm {
  id: string;
  category: 'financial' | 'timeline' | 'conditions' | 'responsibilities' | 'penalties';
  title: string;
  description: string;
  value?: number;
  dueDate?: string;
  isNegotiable: boolean;
  status: 'pending' | 'agreed' | 'disputed' | 'modified';
}

interface ContractClause {
  id: string;
  type: 'standard' | 'custom' | 'conditional' | 'addendum';
  title: string;
  content: string;
  isRequired: boolean;
  order: number;
}

interface ContractSignature {
  id: string;
  partyId: string;
  signedDate: string;
  signatureType: 'electronic' | 'physical' | 'witnessed';
  ipAddress?: string;
  location?: string;
  witnessName?: string;
  isValid: boolean;
}

interface ContractReminder {
  id: string;
  type: 'signature' | 'renewal' | 'payment' | 'milestone' | 'expiration';
  message: string;
  dueDate: string;
  recipients: string[];
  sent: boolean;
  sentDate?: string;
}

export function ContractManager() {
  const { t } = useTranslation();
  
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Purchase Agreement - 123 Oak Street',
      type: 'purchase',
      status: 'pending',
      priority: 'high',
      propertyId: 'prop-123',
      propertyAddress: '123 Oak Street, Springfield',
      parties: [
        {
          id: 'p1',
          name: 'John Smith',
          role: 'buyer',
          email: 'john.smith@email.com',
          phone: '(555) 123-4567',
          address: '456 Pine Ave, Springfield',
          signatureRequired: true
        },
        {
          id: 'p2',
          name: 'Sarah Johnson',
          role: 'seller',
          email: 'sarah.johnson@email.com',
          phone: '(555) 987-6543',
          address: '123 Oak Street, Springfield',
          signatureRequired: true,
          signedDate: '2024-01-15',
          signatureMethod: 'electronic'
        }
      ],
      value: 450000,
      currency: 'USD',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      createdBy: 'Agent Mike Wilson',
      createdDate: '2024-01-10',
      lastModified: '2024-01-16',
      terms: [
        {
          id: 't1',
          category: 'financial',
          title: 'Purchase Price',
          description: 'Total purchase price for the property',
          value: 450000,
          isNegotiable: false,
          status: 'agreed'
        },
        {
          id: 't2',
          category: 'timeline',
          title: 'Closing Date',
          description: 'Expected closing date',
          dueDate: '2024-03-15',
          isNegotiable: true,
          status: 'pending'
        }
      ],
      clauses: [
        {
          id: 'c1',
          type: 'standard',
          title: 'Inspection Contingency',
          content: 'Buyer has 10 days to complete property inspection',
          isRequired: true,
          order: 1
        }
      ],
      attachments: ['property-disclosure.pdf', 'inspection-report.pdf'],
      signatures: [
        {
          id: 's1',
          partyId: 'p2',
          signedDate: '2024-01-15',
          signatureType: 'electronic',
          ipAddress: '192.168.1.100',
          location: 'Springfield, IL',
          isValid: true
        }
      ],
      reminders: [
        {
          id: 'r1',
          type: 'signature',
          message: 'Buyer signature required for purchase agreement',
          dueDate: '2024-01-20',
          recipients: ['john.smith@email.com'],
          sent: true,
          sentDate: '2024-01-16'
        }
      ],
      isTemplate: false,
      version: 1,
      previousVersions: []
    }
  ]);

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'terms' | 'parties' | 'signatures' | 'history'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showContractModal, setShowContractModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'signed': return 'bg-blue-100 text-blue-800';
      case 'executed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'signed': return <PenTool className="w-3 h-3" />;
      case 'executed': return <CheckCircle className="w-3 h-3" />;
      case 'expired': return <AlertTriangle className="w-3 h-3" />;
      case 'terminated': return <Trash2 className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '🏠';
      case 'listing': return '📋';
      case 'lease': return '🔑';
      case 'management': return '🏢';
      case 'service': return '🔧';
      case 'employment': return '👥';
      default: return '📄';
    }
  };

  const contractStats = {
    total: contracts.length,
    pending: contracts.filter(c => c.status === 'pending').length,
    signed: contracts.filter(c => c.status === 'signed').length,
    executed: contracts.filter(c => c.status === 'executed').length,
    expiringSoon: contracts.filter(c => {
      if (!c.endDate) return false;
      const endDate = new Date(c.endDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.parties.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || contract.type === filterType;
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(appContent.contractManager.contractManagement)}</h1>
        <p className="text-gray-600">{t(appContent.contractManager.manageContracts)}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contractStats.total}</p>
              <p className="text-sm text-gray-600">{t(appContent.contractManager.totalContracts)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contractStats.pending}</p>
              <p className="text-sm text-gray-600">{t(appContent.contractManager.pendingSignatures)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contractStats.executed}</p>
              <p className="text-sm text-gray-600">{t(appContent.documents.approved)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contractStats.expiringSoon}</p>
                              <p className="text-sm text-gray-600">{t(appContent.documents.expiringSoon)}</p>
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
                placeholder={t(appContent.contractManager.searchContracts)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">{t(appContent.contractManager.allTypes)}</option>
              <option value="purchase">{t(appContent.contractManager.purchase)}</option>
              <option value="listing">{t(appContent.contractManager.listing)}</option>
              <option value="lease">{t(appContent.contractManager.lease)}</option>
              <option value="management">{t(appContent.contractManager.management)}</option>
              <option value="service">{t(appContent.contractManager.service)}</option>
              <option value="employment">{t(appContent.contractManager.employment)}</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">{t(appContent.contractManager.allStatus)}</option>
              <option value="draft">{t(appContent.documents.draft)}</option>
              <option value="pending">{t(appContent.documents.pending)}</option>
              <option value="signed">{t(appContent.documents.signed)}</option>
              <option value="executed">{t(appContent.documents.approved)}</option>
              <option value="expired">{t(appContent.documents.expired)}</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-medium transition-colors">
              <FileText className="w-4 h-4 mr-2 inline" />
              {t(appContent.documents.templates)}
            </button>
            <button
              onClick={() => setShowContractModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              {t(appContent.contractManager.newContract)}
            </button>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredContracts.map(contract => (
            <div key={contract.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(contract.type)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{contract.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {getStatusIcon(contract.status)}
                      <span className="ml-1">{contract.status}</span>
                    </span>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(contract.priority)}`} />
                  </div>
                  
                  {contract.propertyAddress && (
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{contract.propertyAddress}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">{t(appContent.contractManager.value)}</p>
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: contract.currency }).format(contract.value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t(appContent.contractManager.startDate)}</p>
                      <p className="font-medium text-gray-900">{new Date(contract.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t(appContent.contractManager.endDate)}</p>
                      <p className="font-medium text-gray-900">
                        {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t(appContent.documents.pendingSignatures)}</p>
                      <p className="font-medium text-gray-900">
                        {contract.signatures.length} / {contract.parties.filter(p => p.signatureRequired).length}
                      </p>
                    </div>
                  </div>
                  
                  {/* Parties */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">{t(appContent.contractManager.parties)}</p>
                    <div className="flex flex-wrap gap-2">
                      {contract.parties.map(party => (
                        <div key={party.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{party.name}</span>
                          <span className="text-xs text-gray-600">({party.role})</span>
                          {party.signedDate && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reminders */}
                  {contract.reminders.filter(r => !r.sent).length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{contract.reminders.filter(r => !r.sent).length} pending reminder(s)</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedContract(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedContract.title}</h2>
                  <p className="text-gray-600">Contract Details</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download
                  </button>
                  <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Send className="w-4 h-4 mr-2 inline" />
                    Send for Signature
                  </button>
                  <button
                    onClick={() => setSelectedContract(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Contract Detail Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'terms', label: 'Terms & Conditions' },
                    { id: 'parties', label: 'Parties' },
                    { id: 'signatures', label: 'Signatures' },
                    { id: 'history', label: 'History' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Contract Information</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium text-gray-900 capitalize">{selectedContract.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContract.status)}`}>
                            {getStatusIcon(selectedContract.status)}
                            <span className="ml-1">{selectedContract.status}</span>
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Value</p>
                          <p className="font-medium text-gray-900">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedContract.currency }).format(selectedContract.value)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Created</p>
                          <p className="font-medium text-gray-900">{new Date(selectedContract.createdDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="font-medium text-gray-900">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                        </div>
                        {selectedContract.endDate && (
                          <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-medium text-gray-900">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Contract Terms</h4>
                  {selectedContract.terms.map(term => (
                    <div key={term.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{term.title}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          term.status === 'agreed' ? 'bg-green-100 text-green-800' :
                          term.status === 'disputed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {term.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{term.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Category: {term.category}</span>
                        {term.value && <span>Value: ${term.value.toLocaleString()}</span>}
                        {term.dueDate && <span>Due: {new Date(term.dueDate).toLocaleDateString()}</span>}
                        <span>{term.isNegotiable ? 'Negotiable' : 'Fixed'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'parties' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Contract Parties</h4>
                  {selectedContract.parties.map(party => (
                    <div key={party.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {party.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{party.name}</h5>
                            <p className="text-sm text-gray-600 capitalize">{party.role}</p>
                          </div>
                        </div>
                        {party.signedDate && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Signed</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{party.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{party.phone}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{party.address}</span>
                          </div>
                        </div>
                      </div>
                      
                      {party.signedDate && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Signed: {new Date(party.signedDate).toLocaleDateString()}</span>
                            <span>Method: {party.signatureMethod}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(activeTab === 'signatures' || activeTab === 'history') && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {activeTab === 'signatures' ? 'Signature Management' : 'Contract History'}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'signatures' 
                      ? 'Electronic signature tracking and management'
                      : 'Version history and audit trail'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 