import React, { useState, useEffect } from 'react';
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Star,
  Plus,
  Search,
  Filter,
  Edit,
  MessageCircle,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  Download,
  Upload,
  FileText,
  X
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';
import { Contact } from '../../types';
import { importContactsFromCSV, downloadCSVTemplate, CSVImportResult } from '../../utils/csvImport';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  type: 'buyer' | 'seller' | 'both';
  status: 'active' | 'inactive' | 'prospect';
  budget: {
    min: number;
    max: number;
  };
  preferences: {
    propertyTypes: string[];
    locations: string[];
    bedrooms: number;
    bathrooms: number;
  };
  lastContact: Date;
  joinDate: Date;
  totalTransactions: number;
  totalValue: number;
  agent: {
    id: string;
    name: string;
  };
  notes: string;
  tags: string[];
}

export default function Clients() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastContact' | 'totalValue'>('lastContact');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  // Load contacts from dataService
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const allContacts = await unifiedDataService.getContacts();
        // Ensure we have an array
        const safeContacts = Array.isArray(allContacts) ? allContacts : [];
      // Filter for clients only (not leads)
        const clientContacts = safeContacts.filter(contact => 
        contact.type === 'Client' || contact.status === 'Converted'
      );
      setContacts(clientContacts);
      } catch (error) {
        console.error('Error loading contacts:', error);
        setContacts([]);
      }
    };

    loadContacts();

    // Subscribe to data changes
    const handleContactsChange = (updatedContacts: Contact[]) => {
      const safeContacts = Array.isArray(updatedContacts) ? updatedContacts : [];
      const clientContacts = safeContacts.filter(contact => 
        contact.type === 'Client' || contact.status === 'Converted'
      );
      setContacts(clientContacts);
    };

    unifiedDataService.subscribe('contactsChanged', handleContactsChange);

    return () => {
      unifiedDataService.unsubscribe('contactsChanged', handleContactsChange);
    };
  }, []);

  // Convert Contact to Client format for display
  const convertToClient = (contact: Contact): Client => {
    return {
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      email: contact.email,
      phone: contact.phone,
      avatar: "",
      type: 'buyer', // Default type
      status: contact.status === 'Converted' ? 'active' : 'prospect',
      budget: contact.budget || { min: 0, max: 0 },
      preferences: {
        propertyTypes: ['apartment'],
        locations: ['City'],
        bedrooms: 2,
        bathrooms: 2
      },
      lastContact: new Date(contact.lastContact),
      joinDate: new Date(contact.createdAt),
      totalTransactions: 0,
      totalValue: 0,
      agent: {
        id: contact.assignedAgent,
        name: 'Agent'
      },
      notes: contact.notes,
      tags: []
    };
  };

  const clients = contacts.map(convertToClient);

  const getTypeColor = (type: string) => {
    const colors = {
      buyer: 'bg-blue-100 text-blue-800',
      seller: 'bg-green-100 text-green-800',
      both: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || colors.buyer;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      prospect: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return t(appContent.contacts.budgetNotSpecified);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return t(appContent.contacts.today);
    if (days === 1) return t(appContent.contacts.yesterday);
    if (days < 7) return `${days} ${t(appContent.contacts.daysAgo)}`;
    if (days < 30) return `${Math.floor(days / 7)} ${t(appContent.contacts.weeksAgo)}`;
    return `${Math.floor(days / 30)} ${t(appContent.contacts.monthsAgo)}`;
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'buyer' as 'buyer' | 'seller' | 'both',
    status: 'prospect' as 'active' | 'inactive' | 'prospect',
    budgetMin: 0,
    budgetMax: 0,
    notes: ''
  });

  // Add new client handler
  const handleAddClient = () => {
    const [firstName, ...lastNameParts] = newClient.name.split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    const newContact: Omit<Contact, 'id'> = {
      firstName,
      lastName,
      email: newClient.email,
      phone: newClient.phone,
      type: 'Client',
      status: 'Converted',
      source: 'Website',
      budget: { min: newClient.budgetMin, max: newClient.budgetMax },
      assignedAgent: 'current-agent',
      lastContact: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      notes: newClient.notes
    };

    unifiedDataService.addContact(newContact as Contact);
    
    // Reset form
    setNewClient({
      name: '',
      email: '',
      phone: '',
      type: 'buyer',
      status: 'prospect',
      budgetMin: 0,
      budgetMax: 0,
      notes: ''
    });
    setShowAddModal(false);
  };

  // Delete client handler
  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        await unifiedDataService.deleteContact(clientId);
        // Success notification could be added here
      } catch (error) {
        console.error('Error deleting client:', error);
        // Error notification could be added here
      }
    }
  };

  // Edit client handler
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone,
      type: client.type,
      status: client.status,
      budgetMin: client.budget.min,
      budgetMax: client.budget.max,
      notes: client.notes
    });
    setShowAddModal(true);
  };

  // Update client handler
  const handleUpdateClient = (updatedClient: Client) => {
    const [firstName, ...lastNameParts] = updatedClient.name.split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    const updatedContact: Partial<Contact> = {
      firstName,
      lastName,
      email: updatedClient.email,
      phone: updatedClient.phone,
      budget: updatedClient.budget,
      notes: updatedClient.notes
    };

    unifiedDataService.updateContact(updatedClient.id, updatedContact);
    setSelectedClient(null);
    setShowAddModal(false);
  };

  // Contact client handler
  const handleContactClient = (client: Client) => {
    // This could open an email client or phone dialer
    window.location.href = `mailto:${client.email}`;
  };

  // View client details
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  // CSV Import functionality
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const result = importContactsFromCSV(csvText);
      
      setImportResult(result);
      
      if (result.success && result.data) {
        // Add imported contacts to dataService
        result.data.forEach((contact: Contact) => {
          unifiedDataService.addContact(contact);
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    downloadCSVTemplate('contacts');
  };

  // Export clients handler
  const handleExportClients = () => {
    const exportData = [
      ['Name', 'Email', 'Phone', 'Type', 'Status', 'Budget Min', 'Budget Max', 'Total Value', 'Join Date'],
      ...clients.map(client => [
        client.name,
        client.email,
        client.phone,
        client.type,
        client.status,
        client.budget.min.toString(),
        client.budget.max.toString(),
        client.totalValue.toString(),
        client.joinDate.toLocaleDateString()
      ])
    ];
    
    const csvContent = exportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `clients-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const processCSVUpload = async () => {
    if (!uploadFile) return;

    setUploadStatus('uploading');
    setUploadMessage('Processing CSV file...');

    try {
      const text = await uploadFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const newContacts: Partial<Contact>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= headers.length && values[0]) {
          const contact: Partial<Contact> = {
            id: `contact_${Date.now()}_${i}`,
            name: values[0] || 'Unnamed Contact',
            email: values[1] || '',
            phone: values[2] || '',
            company: values[3] || '',
            type: (values[4] as any) || 'Client',
            status: (values[5] as any) || 'Active',
            address: values[6] || '',
            city: values[7] || '',
            country: values[8] || 'Saudi Arabia',
            notes: values[9] || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          newContacts.push(contact);
        }
      }

      // Add contacts to the system
      for (const contact of newContacts) {
        await unifiedDataService.addContact(contact as Contact);
      }

      setUploadStatus('success');
      setUploadMessage(`Successfully uploaded ${newContacts.length} contacts!`);
      
      // Reload contacts
      const loadedContacts = await unifiedDataService.getContacts();
      setContacts(Array.isArray(loadedContacts) ? loadedContacts : []);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadStatus('idle');
        setUploadMessage('');
      }, 2000);

    } catch (error) {
      console.error('Error processing CSV:', error);
      setUploadStatus('error');
      setUploadMessage('Error processing CSV file. Please check the format.');
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || client.type === filterType;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalValue = clients.reduce((sum, client) => sum + client.totalValue, 0);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.contacts.clients)}</h1>
            <p className="text-gray-600">{filteredClients.length} of {totalClients} {t(appContent.contacts.clients).toLowerCase()}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDownloadTemplate}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Template</span>
            </button>
            
            <label className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              <span>Import CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
              />
            </label>
            
            <button 
              onClick={handleExportClients}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t(appContent.contacts.addContact)}</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalClients}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.contacts.totalClients)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeClients}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.contacts.activeClients)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(totalValue)}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.contacts.totalClientValue)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">94.2%</h3>
            <p className="text-gray-600 text-sm">{t(appContent.contacts.satisfactionRate)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t(appContent.contacts.searchClients)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">{t(appContent.contacts.allTypes)}</option>
              <option value="buyer">{t(appContent.contacts.buyers)}</option>
              <option value="seller">{t(appContent.contacts.sellers)}</option>
              <option value="both">{t(appContent.contacts.both)}</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">{t(appContent.contacts.allStatus)}</option>
              <option value="active">{t(appContent.contacts.active)}</option>
              <option value="prospect">{t(appContent.contacts.prospect)}</option>
              <option value="inactive">{t(appContent.contacts.inactive)}</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="lastContact">{t(appContent.contacts.sortByLastContact)}</option>
              <option value="name">{t(appContent.contacts.sortByName)}</option>
              <option value="totalValue">{t(appContent.contacts.sortByValue)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
            {/* Client Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(client.type)}`}>
                      {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleContactClient(client)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Contact Client"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleViewClient(client)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="View Client Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditClient(client)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Edit Client"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>{t(appContent.contacts.lastContact)}: {formatTime(client.lastContact)}</span>
              </div>
            </div>

            {/* Budget & Preferences */}
            {client.type !== 'seller' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="text-sm font-medium text-gray-900 mb-2">{t(appContent.contacts.budgetRange)}</div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatPrice(client.budget.min)} - {formatPrice(client.budget.max)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {client.preferences.bedrooms} {t(appContent.contacts.bed)}, {client.preferences.bathrooms} {t(appContent.contacts.bath)}
                </div>
              </div>
            )}

            {/* Transaction History */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-lg font-semibold text-green-600">{client.totalTransactions}</div>
                <div className="text-xs text-gray-600">{t(appContent.contacts.transactions)}</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <div className="text-lg font-semibold text-purple-600">{formatPrice(client.totalValue)}</div>
                <div className="text-xs text-gray-600">{t(appContent.contacts.totalValue)}</div>
              </div>
            </div>

            {/* Tags */}
            {client.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 line-clamp-2">{client.notes}</div>
            </div>

            {/* Agent */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{client.agent.name}</span>
              </div>
              <div className="text-xs text-gray-500">
                {t(appContent.contacts.clientSince)} {client.joinDate.toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(appContent.contacts.noClientsFound)}</h3>
          <p className="text-gray-600 mb-6">{t(appContent.contacts.adjustSearchCriteria)}</p>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg">
            {t(appContent.contacts.addFirstClient)}
          </button>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select 
                    value={newClient.type}
                    onChange={(e) => setNewClient({...newClient, type: e.target.value as 'buyer' | 'seller' | 'both'})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                
                {newClient.type !== 'seller' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <div className="flex space-x-2">
                      <input 
                        type="number" 
                        placeholder="Min Budget"
                        value={newClient.budgetMin || ''}
                        onChange={(e) => setNewClient({...newClient, budgetMin: parseInt(e.target.value) || 0})}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                      <input 
                        type="number" 
                        placeholder="Max Budget"
                        value={newClient.budgetMax || ''}
                        onChange={(e) => setNewClient({...newClient, budgetMax: parseInt(e.target.value) || 0})}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    value={newClient.notes}
                    onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add notes about this client..."
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddClient}
                  disabled={!newClient.name || !newClient.email || !newClient.phone}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Details - {selectedClient.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={selectedClient.name} 
                    onChange={(e) => setSelectedClient({...selectedClient, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={selectedClient.email} 
                    onChange={(e) => setSelectedClient({...selectedClient, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    defaultValue={selectedClient.phone} 
                    onChange={(e) => setSelectedClient({...selectedClient, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select 
                    defaultValue={selectedClient.type} 
                    onChange={(e) => setSelectedClient({...selectedClient, type: e.target.value as 'buyer' | 'seller' | 'both'})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    defaultValue={selectedClient.status} 
                    onChange={(e) => setSelectedClient({...selectedClient, status: e.target.value as 'active' | 'inactive' | 'prospect'})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="prospect">Prospect</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <div className="flex space-x-2">
                    <input 
                      type="number" 
                      defaultValue={selectedClient.budget.min} 
                      placeholder="Min" 
                      onChange={(e) => setSelectedClient({
                        ...selectedClient, 
                        budget: {...selectedClient.budget, min: parseInt(e.target.value) || 0}
                      })}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <input 
                      type="number" 
                      defaultValue={selectedClient.budget.max} 
                      placeholder="Max" 
                      onChange={(e) => setSelectedClient({
                        ...selectedClient, 
                        budget: {...selectedClient.budget, max: parseInt(e.target.value) || 0}
                      })}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    defaultValue={selectedClient.notes} 
                    onChange={(e) => setSelectedClient({...selectedClient, notes: e.target.value})}
                    rows={3} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdateClient(selectedClient)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Result Modal */}
      {importResult && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setImportResult(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                CSV Import Results
              </h3>
              
              <div className={`p-4 rounded-xl mb-4 ${
                importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`flex items-center space-x-2 ${
                  importResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {importResult.success ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{importResult.message}</span>
                </div>
                
                {importResult.success && (
                  <p className="text-green-700 text-sm mt-2">
                    Successfully imported {importResult.importedCount} contacts
                  </p>
                )}
              </div>

              {importResult.errors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <p key={index} className="text-red-700 text-sm">{error}</p>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setImportResult(null)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-xl font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Contacts CSV</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadStatus === 'idle' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Select a CSV file to upload contacts</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors"
                  >
                    Choose CSV File
                  </label>
                </div>

                {uploadFile && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Selected:</strong> {uploadFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processCSVUpload}
                    disabled={!uploadFile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}

            {uploadStatus === 'uploading' && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{uploadMessage}</p>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-green-600 font-medium">{uploadMessage}</p>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 font-medium">{uploadMessage}</p>
                <button
                  onClick={() => {
                    setUploadStatus('idle');
                    setUploadMessage('');
                    setUploadFile(null);
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 