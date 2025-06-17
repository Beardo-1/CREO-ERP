import React, { useState } from 'react';
import {
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Star,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  TrendingUp,
  MapPin,
  DollarSign,
  Target,
  Users,
  Award
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface FollowUpLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'overdue' | 'due-today' | 'due-soon' | 'scheduled';
  priority: 'high' | 'medium' | 'low';
  lastContact: string;
  nextFollowUp: string;
  daysOverdue?: number;
  leadScore: number;
  interests: string[];
  budget: {
    min: number;
    max: number;
  };
  preferredAreas: string[];
  notes: string;
  contactHistory: {
    date: string;
    type: 'call' | 'email' | 'meeting' | 'text';
    outcome: string;
  }[];
  assignedAgent: string;
}

export default function FollowUpLeads() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('next-followup');

  const followUpLeads: FollowUpLead[] = [
    {
      id: 'FL-001',
      name: 'Michael Thompson',
      email: 'michael.t@email.com',
      phone: '(555) 123-4567',
      source: 'Website Form',
      status: 'overdue',
      priority: 'high',
      lastContact: '2024-01-20',
      nextFollowUp: '2024-01-25',
      daysOverdue: 3,
      leadScore: 85,
      interests: ['Single Family Home', 'Condo'],
      budget: { min: 400000, max: 600000 },
      preferredAreas: ['Downtown', 'Midtown'],
      notes: 'Very interested buyer, pre-approved for mortgage. Looking to move quickly.',
      contactHistory: [
        { date: '2024-01-20', type: 'call', outcome: 'Discussed budget and preferences' },
        { date: '2024-01-18', type: 'email', outcome: 'Sent property listings' },
        { date: '2024-01-15', type: 'meeting', outcome: 'Initial consultation completed' }
      ],
      assignedAgent: 'Sarah Johnson'
    },
    {
      id: 'FL-002',
      name: 'Jennifer Martinez',
      email: 'jennifer.m@email.com',
      phone: '(555) 234-5678',
      source: 'Facebook Ad',
      status: 'due-today',
      priority: 'high',
      lastContact: '2024-01-26',
      nextFollowUp: '2024-01-28',
      leadScore: 78,
      interests: ['Townhouse', 'Single Family Home'],
      budget: { min: 350000, max: 500000 },
      preferredAreas: ['Suburbs', 'Family District'],
      notes: 'First-time buyer, needs guidance through the process. Has good credit.',
      contactHistory: [
        { date: '2024-01-26', type: 'email', outcome: 'Sent first-time buyer guide' },
        { date: '2024-01-24', type: 'call', outcome: 'Discussed financing options' },
        { date: '2024-01-22', type: 'text', outcome: 'Confirmed appointment' }
      ],
      assignedAgent: 'Mike Chen'
    },
    {
      id: 'FL-003',
      name: 'Robert Wilson',
      email: 'robert.w@email.com',
      phone: '(555) 345-6789',
      source: 'Referral',
      status: 'due-soon',
      priority: 'medium',
      lastContact: '2024-01-25',
      nextFollowUp: '2024-01-30',
      leadScore: 65,
      interests: ['Investment Property', 'Condo'],
      budget: { min: 200000, max: 400000 },
      preferredAreas: ['Arts District', 'University Area'],
      notes: 'Looking for rental investment properties. Experienced investor.',
      contactHistory: [
        { date: '2024-01-25', type: 'meeting', outcome: 'Viewed 3 properties' },
        { date: '2024-01-23', type: 'call', outcome: 'Discussed investment strategy' },
        { date: '2024-01-21', type: 'email', outcome: 'Sent market analysis' }
      ],
      assignedAgent: 'Emily Davis'
    },
    {
      id: 'FL-004',
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '(555) 456-7890',
      source: 'Google Ads',
      status: 'scheduled',
      priority: 'low',
      lastContact: '2024-01-27',
      nextFollowUp: '2024-02-02',
      leadScore: 45,
      interests: ['Apartment', 'Condo'],
      budget: { min: 250000, max: 350000 },
      preferredAreas: ['Downtown'],
      notes: 'Still exploring options, not in a rush to buy.',
      contactHistory: [
        { date: '2024-01-27', type: 'email', outcome: 'Sent neighborhood information' },
        { date: '2024-01-24', type: 'call', outcome: 'Initial inquiry call' }
      ],
      assignedAgent: 'Sarah Johnson'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'overdue': 'bg-gradient-to-r from-red-50 to-rose-100 text-rose-700 border border-rose-200',
      'due-today': 'bg-gradient-to-r from-orange-50 to-amber-100 text-amber-700 border border-amber-200',
      'due-soon': 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200',
      'scheduled': 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-gradient-to-r from-red-50 to-rose-100 text-rose-700 border border-rose-200',
      medium: 'bg-gradient-to-r from-yellow-50 to-amber-100 text-amber-700 border border-amber-200',
      low: 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredLeads = followUpLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesAgent = agentFilter === 'all' || lead.assignedAgent === agentFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAgent;
  });

  const overdueCount = filteredLeads.filter(l => l.status === 'overdue').length;
  const dueTodayCount = filteredLeads.filter(l => l.status === 'due-today').length;
  const dueSoonCount = filteredLeads.filter(l => l.status === 'due-soon').length;
  const avgScore = Math.round(filteredLeads.reduce((sum, lead) => sum + lead.leadScore, 0) / filteredLeads.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
                              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {t(appContent.followUpLeads.title)}
                </h1>
                <p className="text-gray-600 text-lg">{filteredLeads.length} {t(appContent.followUpLeads.leadsRequiringFollowUp)}</p>
            </div>
                          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3">
                <Plus className="w-6 h-6" />
                <span>Add Follow-up</span>
              </button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                                      <p className="text-gray-600 text-sm font-medium">{t(appContent.followUpLeads.overdue)}</p>
                  <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-rose-100 p-3 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                                      <p className="text-gray-600 text-sm font-medium">{t(appContent.followUpLeads.dueToday)}</p>
                  <p className="text-2xl font-bold text-amber-600">{dueTodayCount}</p>
                </div>
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                                      <p className="text-gray-600 text-sm font-medium">{t(appContent.followUpLeads.dueSoon)}</p>
                  <p className="text-2xl font-bold text-yellow-600">{dueSoonCount}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t('Avg Score')}</p>
                  <p className="text-2xl font-bold text-gray-900">{avgScore}/100</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t(appContent.followUpLeads.searchLeads)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
            >
              <option value="all">{t(appContent.followUpLeads.allStatus)}</option>
              <option value="overdue">{t(appContent.followUpLeads.overdue)}</option>
              <option value="due-today">{t(appContent.followUpLeads.dueToday)}</option>
              <option value="due-soon">{t(appContent.followUpLeads.dueSoon)}</option>
              <option value="scheduled">{t(appContent.followUpLeads.scheduled)}</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
            >
              <option value="all">{t(appContent.followUpLeads.allPriorities)}</option>
              <option value="high">{t(appContent.sidebar.high)}</option>
              <option value="medium">{t(appContent.sidebar.medium)}</option>
              <option value="low">{t(appContent.sidebar.low)}</option>
            </select>

            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
            >
              <option value="all">{t(appContent.followUpLeads.allAgents)}</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Mike Chen">Mike Chen</option>
              <option value="Emily Davis">Emily Davis</option>
            </select>
          </div>
        </div>

        {/* Enhanced Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.source}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                      {lead.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-2 rounded-xl text-center ${getScoreColor(lead.leadScore)}`}>
                      <p className="text-xs font-medium">{t('Lead Score')}</p>
                      <p className="text-lg font-bold">{lead.leadScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('Next Follow-up')}</p>
                      <p className="font-semibold text-gray-900">{new Date(lead.nextFollowUp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {lead.daysOverdue && (
                      <span className="ml-1 text-xs">({lead.daysOverdue}d)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-lg">
                        <Mail className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{t('Email')}</p>
                        <p className="font-medium text-gray-900">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-2 rounded-lg">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{lead.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-2 rounded-lg">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Budget Range</p>
                        <p className="font-medium text-gray-900">
                          ${lead.budget.min.toLocaleString()} - ${lead.budget.max.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-2 rounded-lg">
                        <Users className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Assigned Agent</p>
                        <p className="font-medium text-gray-900">{lead.assignedAgent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests & Areas */}
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Property Interests</h5>
                    <div className="flex flex-wrap gap-2">
                      {lead.interests.map((interest, index) => (
                        <span key={index} className="bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Preferred Areas</h5>
                    <div className="flex flex-wrap gap-2">
                      {lead.preferredAreas.map((area, index) => (
                        <span key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact History */}
              <div className="p-6 border-b border-gray-100">
                <h5 className="font-semibold text-gray-900 mb-3">Recent Contact History</h5>
                <div className="space-y-3">
                  {lead.contactHistory.slice(0, 3).map((contact, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        contact.type === 'call' ? 'bg-blue-100' :
                        contact.type === 'email' ? 'bg-green-100' :
                        contact.type === 'meeting' ? 'bg-purple-100' :
                        'bg-amber-100'
                      }`}>
                        {contact.type === 'call' ? <Phone className="w-4 h-4 text-blue-600" /> :
                         contact.type === 'email' ? <Mail className="w-4 h-4 text-green-600" /> :
                         contact.type === 'meeting' ? <User className="w-4 h-4 text-purple-600" /> :
                         <MessageCircle className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 capitalize">{contact.type}</p>
                          <p className="text-xs text-gray-600">{new Date(contact.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm text-gray-600">{contact.outcome}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Last Contact: {new Date(lead.lastContact).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {lead.notes && (
                  <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">{lead.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Follow-up Leads Found</h3>
              <p className="text-gray-600 mb-6">No leads match your current filters. Try adjusting your search criteria.</p>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 