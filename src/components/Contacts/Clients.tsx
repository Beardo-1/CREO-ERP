import React, { useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

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

  const mockClients: Client[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      avatar: '/api/placeholder/40/40',
      type: 'buyer',
      status: 'active',
      budget: {
        min: 400000,
        max: 600000
      },
      preferences: {
        propertyTypes: ['apartment', 'condo'],
        locations: ['Downtown', 'Midtown'],
        bedrooms: 2,
        bathrooms: 2
      },
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      joinDate: new Date('2024-01-15'),
      totalTransactions: 0,
      totalValue: 0,
      agent: {
        id: '1',
        name: 'Mike Chen'
      },
      notes: 'Looking for modern apartment with city view. First-time buyer.',
      tags: ['first-time-buyer', 'pre-approved']
    },
    {
      id: '2',
      name: 'Robert Williams',
      email: 'robert.williams@email.com',
      phone: '+1 (555) 234-5678',
      avatar: '/api/placeholder/40/40',
      type: 'seller',
      status: 'active',
      budget: {
        min: 0,
        max: 0
      },
      preferences: {
        propertyTypes: ['house'],
        locations: ['Suburbs'],
        bedrooms: 4,
        bathrooms: 3
      },
      lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      joinDate: new Date('2023-11-20'),
      totalTransactions: 2,
      totalValue: 1200000,
      agent: {
        id: '2',
        name: 'Sarah Johnson'
      },
      notes: 'Selling family home, looking to downsize. Excellent client.',
      tags: ['repeat-client', 'high-value']
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      avatar: '/api/placeholder/40/40',
      type: 'both',
      status: 'prospect',
      budget: {
        min: 300000,
        max: 450000
      },
      preferences: {
        propertyTypes: ['townhouse', 'condo'],
        locations: ['Arts District', 'University Area'],
        bedrooms: 3,
        bathrooms: 2
      },
      lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      joinDate: new Date('2024-02-01'),
      totalTransactions: 0,
      totalValue: 0,
      agent: {
        id: '3',
        name: 'Emily Davis'
      },
      notes: 'Young professional, flexible on timing. Interested in investment properties.',
      tags: ['investor', 'flexible']
    }
  ];

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

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || client.type === filterType;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalClients = mockClients.length;
  const activeClients = mockClients.filter(c => c.status === 'active').length;
  const totalValue = mockClients.reduce((sum, client) => sum + client.totalValue, 0);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.contacts.clients)}</h1>
            <p className="text-gray-600">{filteredClients.length} of {totalClients} {t(appContent.contacts.clients).toLowerCase()}</p>
          </div>
          
          <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>{t(appContent.contacts.addContact)}</span>
          </button>
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
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
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
    </div>
  );
} 