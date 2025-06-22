import React, { useState, useEffect } from 'react';
import { 
  User, Users, Phone, Mail, Calendar, MessageCircle, 
  FileText, Star, TrendingUp, Clock, MapPin, Send,
  Plus, Search, Filter, MoreVertical, Edit, Trash2,
  Eye, Download, Upload, Bell, Settings
} from 'lucide-react';

// Interface definitions
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
  totalValue: number;
  lifetimeValue: number;
  satisfactionScore: number;
  referrals: number;
  preferences: {
    propertyTypes: string[];
    priceRange: { min: number; max: number };
    locations: string[];
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
  };
  savedProperties: string[];
  documents: ClientDocument[];
  communications: Communication[];
  appointments: Appointment[];
  notes: ClientNote[];
  tags: string[];
}

interface ClientDocument {
  id: string;
  name: string;
  type: 'contract' | 'disclosure' | 'financial' | 'identification' | 'other';
  uploadDate: string;
  size: number;
  status: 'pending' | 'approved' | 'rejected';
  isConfidential: boolean;
  downloadCount: number;
  expiryDate?: string;
}

interface Communication {
  id: string;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'note';
  subject?: string;
  content: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  followUpDate?: string;
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
  attendees: string[];
  reminders: boolean;
}

interface ClientNote {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  isPrivate: boolean;
  category: 'general' | 'preference' | 'concern' | 'follow-up';
}

export function ClientPortal() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'communications' | 'documents' | 'appointments' | 'notes'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'buyer' as Client['type'],
    status: 'prospect' as Client['status']
  });

  const [newMessage, setNewMessage] = useState({
    content: '',
    type: 'email' as Communication['type'],
    priority: 'medium' as Communication['priority']
  });

  const [newAppointment, setNewAppointment] = useState({
    title: '',
    type: 'consultation' as Appointment['type'],
    date: '',
    time: '',
    location: '',
    duration: 60,
    notes: ''
  });

  // Sample data
  useEffect(() => {
    const sampleClients: Client[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        avatar: "",
        status: 'active',
        type: 'buyer',
        joinDate: '2024-01-15',
        lastActivity: '2024-03-10',
        totalValue: 750000,
        lifetimeValue: 750000,
        satisfactionScore: 4.8,
        referrals: 3,
        preferences: {
          propertyTypes: ['apartment', 'villa'],
          priceRange: { min: 500000, max: 1000000 },
          locations: ['Downtown', 'Marina'],
          bedrooms: 3,
          bathrooms: 2,
          amenities: ['parking', 'gym', 'pool']
        },
        savedProperties: ['prop1', 'prop2'],
        documents: [],
        communications: [],
        appointments: [],
        notes: [],
        tags: ['VIP', 'First-time buyer']
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 987-6543',
        status: 'prospect',
        type: 'investor',
        joinDate: '2024-02-20',
        lastActivity: '2024-03-08',
        totalValue: 2500000,
        lifetimeValue: 2500000,
        satisfactionScore: 4.9,
        referrals: 1,
        preferences: {
          propertyTypes: ['commercial', 'office'],
          priceRange: { min: 1000000, max: 5000000 },
          locations: ['Business District', 'Financial Center'],
          bedrooms: 0,
          bathrooms: 0,
          amenities: ['parking', 'security']
        },
        savedProperties: ['prop3', 'prop4'],
        documents: [],
        communications: [],
        appointments: [],
        notes: [],
        tags: ['Investor', 'High-value']
      }
    ];

    setClients(sampleClients);
    setSelectedClient(sampleClients[0]);
  }, []);

  const handleAddClient = () => {
    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      totalValue: 0,
      lifetimeValue: 0,
      satisfactionScore: 0,
      referrals: 0,
      preferences: {
        propertyTypes: [],
        priceRange: { min: 0, max: 0 },
        locations: [],
        bedrooms: 0,
        bathrooms: 0,
        amenities: []
      },
      savedProperties: [],
      documents: [],
      communications: [],
      appointments: [],
      notes: [],
      tags: []
    };

    setClients([...clients, client]);
    setNewClient({ name: '', email: '', phone: '', type: 'buyer', status: 'prospect' });
    setShowAddClientModal(false);
  };

  const handleSendMessage = () => {
    if (!selectedClient) return;

    const message: Communication = {
      id: Date.now().toString(),
      ...newMessage,
      timestamp: new Date().toISOString(),
      direction: 'outbound',
      status: 'sent'
    };

    const updatedClient = {
      ...selectedClient,
      communications: [...selectedClient.communications, message]
    };

    setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
    setSelectedClient(updatedClient);
    setNewMessage({ content: '', type: 'email', priority: 'medium' });
    setShowMessageModal(false);
  };

  const handleScheduleAppointment = () => {
    if (!selectedClient) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      status: 'scheduled',
      attendees: [selectedClient.id],
      reminders: true
    };

    const updatedClient = {
      ...selectedClient,
      appointments: [...selectedClient.appointments, appointment]
    };

    setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
    setSelectedClient(updatedClient);
    setNewAppointment({
      title: '',
      type: 'consultation',
      date: '',
      time: '',
      location: '',
      duration: 60,
      notes: ''
    });
    setShowAppointmentModal(false);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesType = filterType === 'all' || client.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Portal</h1>
          <p className="text-gray-600">Manage your client relationships and communications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Clients</h2>
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-all"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Add Client
                </button>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="prospect">Prospect</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="renter">Renter</option>
                    <option value="investor">Investor</option>
                  </select>
                </div>
              </div>

              {/* Client List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedClient?.id === client.id
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {client.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{client.name}</p>
                        <p className="text-sm text-gray-500 truncate">{client.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            client.status === 'active' ? 'bg-green-100 text-green-800' :
                            client.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {client.status}
                          </span>
                          <span className="text-xs text-gray-500">{client.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="lg:col-span-2">
            {selectedClient ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                {/* Client Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {selectedClient.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                      <p className="text-gray-600">{selectedClient.email}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          selectedClient.status === 'active' ? 'bg-green-100 text-green-800' :
                          selectedClient.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedClient.status}
                        </span>
                        <span className="text-sm text-gray-500">{selectedClient.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all"
                    >
                      <MessageCircle className="w-4 h-4 mr-2 inline" />
                      Message
                    </button>
                    <button
                      onClick={() => setShowAppointmentModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all"
                    >
                      <Calendar className="w-4 h-4 mr-2 inline" />
                      Schedule
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview', icon: User },
                      { id: 'communications', label: 'Communications', icon: MessageCircle },
                      { id: 'documents', label: 'Documents', icon: FileText },
                      { id: 'appointments', label: 'Appointments', icon: Calendar },
                      { id: 'notes', label: 'Notes', icon: Edit }
                    ].map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'border-amber-500 text-amber-600'
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

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">${selectedClient.totalValue.toLocaleString()}</div>
                        <div className="text-sm text-green-700">Total Value</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{selectedClient.satisfactionScore.toFixed(1)}</div>
                        <div className="text-sm text-blue-700">Satisfaction</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{selectedClient.referrals}</div>
                        <div className="text-sm text-purple-700">Referrals</div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-orange-600">{selectedClient.savedProperties.length}</div>
                        <div className="text-sm text-orange-700">Saved Properties</div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">{selectedClient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">{selectedClient.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">Client since {selectedClient.joinDate}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">Last activity {selectedClient.lastActivity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Budget Range</h4>
                          <p className="text-gray-600">
                            ${selectedClient.preferences.priceRange.min.toLocaleString()} - ${selectedClient.preferences.priceRange.max.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Property Types</h4>
                          <p className="text-gray-600">
                            {selectedClient.preferences.propertyTypes.join(', ') || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Preferred Locations</h4>
                          <p className="text-gray-600">
                            {selectedClient.preferences.locations.join(', ') || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Requirements</h4>
                          <p className="text-gray-600">
                            {selectedClient.preferences.bedrooms} bed, {selectedClient.preferences.bathrooms} bath
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other tab contents would go here */}
                {activeTab !== 'overview' && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                    <p className="text-gray-600">This section is under development</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Client</h3>
                <p className="text-gray-600">Choose a client from the list to view their details and manage their account</p>
              </div>
            )}
          </div>
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
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
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
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.content}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  <Send className="w-4 h-4 mr-2 inline" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddClientModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Client</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter client name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
                    <select
                      value={newClient.type}
                      onChange={(e) => setNewClient({...newClient, type: e.target.value as Client['type']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="renter">Renter</option>
                      <option value="investor">Investor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newClient.status}
                      onChange={(e) => setNewClient({...newClient, status: e.target.value as Client['status']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddClientModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddClient}
                  disabled={!newClient.name || !newClient.email || !newClient.phone}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAppointmentModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Appointment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Enter appointment title"
                    value={newAppointment.title}
                    onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value as Appointment['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="showing">Property Showing</option>
                    <option value="consultation">Consultation</option>
                    <option value="signing">Document Signing</option>
                    <option value="inspection">Inspection</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    placeholder="Add any notes..."
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleScheduleAppointment}
                  disabled={!newAppointment.title || !newAppointment.date || !newAppointment.time}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 