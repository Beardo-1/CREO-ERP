import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  MessageCircle, 
  Calendar, 
  Download, 
  Upload, 
  Star, 
  Heart, 
  Gift, 
  TrendingUp,
  Bell,
  Search,
  Filter,
  Eye,
  Share2,
  Lock,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  DollarSign
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'prospect' | 'past-client';
  preferences: {
    propertyType: string[];
    priceRange: { min: number; max: number };
    location: string[];
    bedrooms: number;
    bathrooms: number;
    features: string[];
  };
  communicationHistory: CommunicationRecord[];
  documents: ClientDocument[];
  referrals: Referral[];
  satisfactionScore: number;
  lastContact: Date;
  nextFollowUp: Date;
  totalTransactions: number;
  totalValue: number;
  source: string;
  tags: string[];
}

interface CommunicationRecord {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'text' | 'portal';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  timestamp: Date;
  attachments?: string[];
  followUpRequired: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface ClientDocument {
  id: string;
  name: string;
  type: 'contract' | 'disclosure' | 'inspection' | 'financial' | 'other';
  size: number;
  uploadDate: Date;
  status: 'pending' | 'signed' | 'expired' | 'draft';
  sharedWith: string[];
  downloadCount: number;
  lastAccessed?: Date;
  requiresSignature: boolean;
  expirationDate?: Date;
}

interface Referral {
  id: string;
  referredName: string;
  referredEmail: string;
  referredPhone: string;
  status: 'pending' | 'contacted' | 'converted' | 'declined';
  referralDate: Date;
  conversionDate?: Date;
  rewardEarned: number;
  notes: string;
}

export function ClientPortal() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'communications' | 'documents' | 'referrals' | 'preferences'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  // Mock data
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        preferences: {
          propertyType: ['Single Family', 'Condo'],
          priceRange: { min: 300000, max: 500000 },
          location: ['Downtown', 'Suburbs'],
          bedrooms: 3,
          bathrooms: 2,
          features: ['Garage', 'Garden', 'Modern Kitchen']
        },
        communicationHistory: [
          {
            id: '1',
            type: 'email',
            direction: 'outbound',
            subject: 'New Property Matches Your Criteria',
            content: 'Hi Sarah, I found 3 new properties that match your requirements...',
            timestamp: new Date(2024, 11, 10),
            followUpRequired: true,
            sentiment: 'positive'
          },
          {
            id: '2',
            type: 'phone',
            direction: 'inbound',
            subject: 'Property Viewing Request',
            content: 'Client called to schedule viewing for 123 Oak Street',
            timestamp: new Date(2024, 11, 8),
            followUpRequired: false,
            sentiment: 'positive'
          }
        ],
        documents: [
          {
            id: '1',
            name: 'Purchase Agreement - 123 Oak St.pdf',
            type: 'contract',
            size: 2048576,
            uploadDate: new Date(2024, 11, 5),
            status: 'pending',
            sharedWith: ['sarah.johnson@email.com'],
            downloadCount: 3,
            requiresSignature: true,
            expirationDate: new Date(2024, 11, 20)
          }
        ],
        referrals: [
          {
            id: '1',
            referredName: 'Mike Wilson',
            referredEmail: 'mike.wilson@email.com',
            referredPhone: '+1 (555) 987-6543',
            status: 'converted',
            referralDate: new Date(2024, 10, 15),
            conversionDate: new Date(2024, 11, 1),
            rewardEarned: 500,
            notes: 'Referred by Sarah for home purchase'
          }
        ],
        satisfactionScore: 4.8,
        lastContact: new Date(2024, 11, 10),
        nextFollowUp: new Date(2024, 11, 15),
        totalTransactions: 2,
        totalValue: 850000,
        source: 'Website',
        tags: ['VIP', 'Repeat Client', 'Referral Source']
      }
    ];
    setClients(mockClients);
    setSelectedClient(mockClients[0]);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      prospect: 'bg-blue-100 text-blue-800',
      'past-client': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.prospect;
  };

  const getDocumentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: 'text-green-600',
      neutral: 'text-gray-600',
      negative: 'text-red-600'
    };
    return colors[sentiment as keyof typeof colors] || colors.neutral;
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (!selectedClient) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Client Portal</h1>
        <p className="text-gray-600">Manage client relationships and communications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Client List */}
        <div className="lg:col-span-1">
          <div className="card-gradient rounded-xl p-6 shadow-lg">
            <div className="mb-4">
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Clients</option>
                <option value="active">Active</option>
                <option value="prospect">Prospects</option>
                <option value="past-client">Past Clients</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredClients.map(client => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedClient.id === client.id 
                      ? 'bg-orange-50 border-2 border-orange-200' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-3">
          <div className="card-gradient rounded-xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                  <p className="text-gray-600">{selectedClient.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClient.status)}`}>
                      {selectedClient.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{selectedClient.satisfactionScore}/5.0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-xl font-bold text-gray-900">{selectedClient.totalTransactions}</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-xl font-bold text-gray-900">${selectedClient.totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Referrals</p>
                    <p className="text-xl font-bold text-gray-900">{selectedClient.referrals.length}</p>
                  </div>
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Last Contact</p>
                    <p className="text-sm font-medium text-gray-900">{selectedClient.lastContact.toLocaleDateString()}</p>
                  </div>
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'communications', label: 'Communications', icon: MessageCircle },
                  { id: 'documents', label: 'Documents', icon: FileText },
                  { id: 'referrals', label: 'Referrals', icon: Gift },
                  { id: 'preferences', label: 'Preferences', icon: Star }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
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
          </div>

          {/* Tab Content */}
          <div className="card-gradient rounded-xl p-6 shadow-lg">
            {activeTab === 'communications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Communication History</h3>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    New Message
                  </button>
                </div>
                {selectedClient.communicationHistory.map(comm => (
                  <div key={comm.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{comm.subject}</span>
                          <span className={`text-sm ${getSentimentColor(comm.sentiment)}`}>
                            {comm.sentiment}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comm.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{comm.type} • {comm.direction}</span>
                          <span>{comm.timestamp.toLocaleDateString()}</span>
                          {comm.followUpRequired && (
                            <span className="text-orange-600 font-medium">Follow-up required</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Document</span>
                  </button>
                </div>
                {selectedClient.documents.map(doc => (
                  <div key={doc.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{(doc.size / 1024 / 1024).toFixed(1)} MB</span>
                            <span>Uploaded {doc.uploadDate.toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Referral Program</h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Rewards Earned</p>
                    <p className="text-xl font-bold text-green-600">
                      ${selectedClient.referrals.reduce((sum, ref) => sum + ref.rewardEarned, 0)}
                    </p>
                  </div>
                </div>
                {selectedClient.referrals.map(referral => (
                  <div key={referral.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{referral.referredName}</h4>
                        <p className="text-sm text-gray-600">{referral.referredEmail}</p>
                        <p className="text-sm text-gray-500">Referred on {referral.referralDate.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          referral.status === 'converted' ? 'bg-green-100 text-green-800' :
                          referral.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {referral.status}
                        </span>
                        <p className="text-sm text-green-600 font-medium mt-1">${referral.rewardEarned}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Client Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Property Type</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.preferences.propertyType.map(type => (
                        <span key={type} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <p className="text-gray-700">
                      ${selectedClient.preferences.priceRange.min.toLocaleString()} - ${selectedClient.preferences.priceRange.max.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Preferred Locations</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.preferences.location.map(loc => (
                        <span key={loc} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
                    <div className="space-y-2">
                      <p className="text-gray-700">Bedrooms: {selectedClient.preferences.bedrooms}+</p>
                      <p className="text-gray-700">Bathrooms: {selectedClient.preferences.bathrooms}+</p>
                    </div>
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