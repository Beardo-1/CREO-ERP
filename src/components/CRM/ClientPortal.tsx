import React, { useState } from 'react';
import { 
  User, 
  Home, 
  FileText, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  Download, 
  Upload, 
  Eye, 
  Star, 
  Heart, 
  Share2, 
  Bell, 
  Settings, 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Camera,
  Video,
  Paperclip,
  Send
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'prospect';
  type: 'buyer' | 'seller' | 'renter' | 'investor';
  joinDate: string;
  lastActivity: string;
  preferences: {
    propertyTypes: string[];
    priceRange: { min: number; max: number };
    locations: string[];
    bedrooms: number;
    bathrooms: number;
  };
  savedProperties: string[];
  documents: ClientDocument[];
  communications: Communication[];
  appointments: Appointment[];
}

interface ClientDocument {
  id: string;
  name: string;
  type: 'contract' | 'disclosure' | 'financial' | 'identification' | 'other';
  uploadDate: string;
  size: number;
  status: 'pending' | 'approved' | 'rejected';
  isConfidential: boolean;
}

interface Communication {
  id: string;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'note';
  subject?: string;
  content: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'replied';
}

interface Appointment {
  id: string;
  title: string;
  type: 'showing' | 'consultation' | 'signing' | 'inspection' | 'other';
  date: string;
  time: string;
  duration: number;
  location: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export function ClientPortal() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      status: 'active',
      type: 'buyer',
      joinDate: '2024-01-10',
      lastActivity: '2024-01-16',
      preferences: {
        propertyTypes: ['Single Family', 'Condo'],
        priceRange: { min: 300000, max: 500000 },
        locations: ['Downtown', 'Suburbs'],
        bedrooms: 3,
        bathrooms: 2
      },
      savedProperties: ['prop-1', 'prop-2', 'prop-3'],
      documents: [
        {
          id: 'doc-1',
          name: 'Pre-approval Letter',
          type: 'financial',
          uploadDate: '2024-01-12',
          size: 1024000,
          status: 'approved',
          isConfidential: true
        }
      ],
      communications: [
        {
          id: 'comm-1',
          type: 'email',
          subject: 'New Property Matches',
          content: 'Found 3 new properties matching your criteria...',
          timestamp: '2024-01-16T10:30:00Z',
          direction: 'outbound',
          status: 'read'
        }
      ],
      appointments: [
        {
          id: 'appt-1',
          title: 'Property Showing - 123 Oak Street',
          type: 'showing',
          date: '2024-01-20',
          time: '14:00',
          duration: 60,
          location: '123 Oak Street, Springfield',
          status: 'scheduled'
        }
      ]
    }
  ]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'documents' | 'communications' | 'appointments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buyer': return 'bg-purple-100 text-purple-800';
      case 'seller': return 'bg-orange-100 text-orange-800';
      case 'renter': return 'bg-blue-100 text-blue-800';
      case 'investor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clientStats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    prospects: clients.filter(c => c.status === 'prospect').length,
    buyers: clients.filter(c => c.type === 'buyer').length,
    sellers: clients.filter(c => c.type === 'seller').length
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Client Portal</h1>
        <p className="text-gray-600">Manage client relationships and provide personalized service</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{clientStats.total}</p>
              <p className="text-sm text-gray-600">Total Clients</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{clientStats.active}</p>
              <p className="text-sm text-gray-600">Active Clients</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{clientStats.prospects}</p>
              <p className="text-sm text-gray-600">Prospects</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{clientStats.buyers}</p>
              <p className="text-sm text-gray-600">Active Buyers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Client List */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Clients</h3>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {clients.map(client => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedClient?.id === client.id ? 'bg-amber-50 border-amber-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{client.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(client.type)}`}>
                          {client.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-3">
          {selectedClient ? (
            <div className="space-y-6">
              {/* Client Header */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedClient.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClient.status)}`}>
                          {selectedClient.status}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedClient.type)}`}>
                          {selectedClient.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2 inline" />
                      Message
                    </button>
                    <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
                      <Phone className="w-4 h-4 mr-2 inline" />
                      Call
                    </button>
                    <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors">
                      <Calendar className="w-4 h-4 mr-2 inline" />
                      Schedule
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <p className="text-sm text-gray-500">Contact Information</p>
                    <div className="space-y-1 mt-1">
                      <p className="text-sm text-gray-900">{selectedClient.email}</p>
                      <p className="text-sm text-gray-900">{selectedClient.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Client Since</p>
                    <p className="text-sm text-gray-900 mt-1">{new Date(selectedClient.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Activity</p>
                    <p className="text-sm text-gray-900 mt-1">{new Date(selectedClient.lastActivity).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
                <div className="flex border-b border-gray-200">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'properties', label: 'Properties', icon: Home },
                    { id: 'documents', label: 'Documents', icon: FileText },
                    { id: 'communications', label: 'Communications', icon: MessageCircle },
                    { id: 'appointments', label: 'Appointments', icon: Calendar }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Preferences */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Client Preferences</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Property Types</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedClient.preferences.propertyTypes.map((type, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Price Range</p>
                            <p className="text-sm text-gray-900">
                              ${selectedClient.preferences.priceRange.min.toLocaleString()} - ${selectedClient.preferences.priceRange.max.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Preferred Locations</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedClient.preferences.locations.map((location, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                  {location}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Requirements</p>
                            <p className="text-sm text-gray-900">
                              {selectedClient.preferences.bedrooms} bed, {selectedClient.preferences.bathrooms} bath
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Activity Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{selectedClient.savedProperties.length}</p>
                            <p className="text-sm text-gray-600">Saved Properties</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{selectedClient.documents.length}</p>
                            <p className="text-sm text-gray-600">Documents</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{selectedClient.communications.length}</p>
                            <p className="text-sm text-gray-600">Communications</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{selectedClient.appointments.length}</p>
                            <p className="text-sm text-gray-600">Appointments</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-semibold text-gray-900">Client Documents</h4>
                        <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                          <Upload className="w-4 h-4 mr-2 inline" />
                          Upload Document
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedClient.documents.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-8 h-8 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">{doc.name}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>{doc.type}</span>
                                  <span>{formatFileSize(doc.size)}</span>
                                  <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {doc.status}
                              </span>
                              <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Placeholder for other tabs */}
                  {(activeTab === 'properties' || activeTab === 'communications' || activeTab === 'appointments') && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {activeTab === 'properties' ? (
                          <Home className="w-8 h-8 text-amber-600" />
                        ) : activeTab === 'communications' ? (
                          <MessageCircle className="w-8 h-8 text-amber-600" />
                        ) : (
                          <Calendar className="w-8 h-8 text-amber-600" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {activeTab === 'properties' ? 'Property Management' :
                         activeTab === 'communications' ? 'Communication History' : 'Appointment Scheduling'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {activeTab === 'properties' ? 'Manage saved properties and recommendations' :
                         activeTab === 'communications' ? 'View all client communications and messages' :
                         'Schedule and manage client appointments'}
                      </p>
                      <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
                        Coming Soon
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Client</h3>
              <p className="text-gray-600">Choose a client from the list to view their details and manage their account</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMessageModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="text"
                    value={selectedClient?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200">
                  <Send className="w-4 h-4 mr-2 inline" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 