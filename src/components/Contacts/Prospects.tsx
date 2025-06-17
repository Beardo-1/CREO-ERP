import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  Clock,
  DollarSign,
  MessageCircle,
  Target,
  Award
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'interested' | 'not-interested';
  score: number;
  budget: {
    min: number;
    max: number;
  };
  propertyType: string[];
  preferredAreas: string[];
  timeline: string;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  assignedAgent: string;
  createdDate: string;
}

export default function Prospects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const { t } = useTranslation();

  const prospects: Prospect[] = [
    {
      id: 'PROS-001',
      name: 'Alex Thompson',
      email: 'alex.thompson@email.com',
      phone: '(555) 123-4567',
      source: 'Website Form',
      status: 'qualified',
      score: 85,
      budget: { min: 400000, max: 600000 },
      propertyType: ['House', 'Townhouse'],
      preferredAreas: ['Downtown', 'Midtown'],
      timeline: '3-6 months',
      lastContact: '2024-01-26',
      nextFollowUp: '2024-01-30',
      notes: 'Pre-approved for mortgage, looking for move-in ready homes',
      assignedAgent: 'Sarah Johnson',
      createdDate: '2024-01-15'
    },
    {
      id: 'PROS-002',
      name: 'Maria Rodriguez',
      email: 'maria.r@email.com',
      phone: '(555) 234-5678',
      source: 'Facebook Ad',
      status: 'interested',
      score: 72,
      budget: { min: 250000, max: 400000 },
      propertyType: ['Apartment', 'Condo'],
      preferredAreas: ['Arts District', 'University Area'],
      timeline: '6-12 months',
      lastContact: '2024-01-24',
      nextFollowUp: '2024-01-31',
      notes: 'First-time buyer, needs education on the process',
      assignedAgent: 'Mike Chen',
      createdDate: '2024-01-12'
    },
    {
      id: 'PROS-003',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '(555) 345-6789',
      source: 'Referral',
      status: 'contacted',
      score: 68,
      budget: { min: 500000, max: 800000 },
      propertyType: ['House'],
      preferredAreas: ['Suburbs', 'Family District'],
      timeline: '1-3 months',
      lastContact: '2024-01-25',
      nextFollowUp: '2024-01-29',
      notes: 'Looking for family home with good schools nearby',
      assignedAgent: 'Emily Davis',
      createdDate: '2024-01-18'
    },
    {
      id: 'PROS-004',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@email.com',
      phone: '(555) 456-7890',
      source: 'Google Ads',
      status: 'new',
      score: 45,
      budget: { min: 300000, max: 450000 },
      propertyType: ['Condo', 'Apartment'],
      preferredAreas: ['Downtown'],
      timeline: '12+ months',
      lastContact: '2024-01-27',
      nextFollowUp: '2024-02-03',
      notes: 'Still exploring options, not urgent',
      assignedAgent: 'Sarah Johnson',
      createdDate: '2024-01-27'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'interested': 'bg-purple-100 text-purple-800',
      'not-interested': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || prospect.source === sourceFilter;
    const matchesAgent = agentFilter === 'all' || prospect.assignedAgent === agentFilter;
    return matchesSearch && matchesStatus && matchesSource && matchesAgent;
  });

  const totalProspects = filteredProspects.length;
  const qualifiedProspects = filteredProspects.filter(p => p.status === 'qualified').length;
  const avgScore = Math.round(filteredProspects.reduce((sum, p) => sum + p.score, 0) / filteredProspects.length);
  const totalBudget = filteredProspects.reduce((sum, p) => sum + p.budget.max, 0);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.prospects.prospects)}</h1>
              <p className="text-gray-600">{totalProspects} {t(appContent.prospects.potentialClients)}</p>
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{t(appContent.prospects.addProspect)}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.prospects.totalProspects)}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProspects}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.prospects.qualified)}</p>
                  <p className="text-2xl font-bold text-gray-900">{qualifiedProspects}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.prospects.avgScore)}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.prospects.totalBudget)}</p>
                  <p className="text-2xl font-bold text-gray-900">${(totalBudget / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t(appContent.prospects.searchProspects)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">{t(appContent.prospects.allStatus)}</option>
                <option value="new">{t(appContent.prospects.new)}</option>
                <option value="contacted">{t(appContent.prospects.contacted)}</option>
                <option value="qualified">{t(appContent.prospects.qualified)}</option>
                <option value="interested">{t(appContent.prospects.interested)}</option>
                <option value="not-interested">{t(appContent.prospects.notInterested)}</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">{t(appContent.prospects.allSources)}</option>
                <option value="Website Form">{t(appContent.prospects.websiteForm)}</option>
                <option value="Facebook Ad">{t(appContent.prospects.facebookAd)}</option>
                <option value="Google Ads">{t(appContent.prospects.googleAds)}</option>
                <option value="Referral">{t(appContent.prospects.referral)}</option>
              </select>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">{t(appContent.deals.allAgents)}</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Mike Chen">Mike Chen</option>
                <option value="Emily Davis">Emily Davis</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="score">{t(appContent.prospects.sortByScore)}</option>
                <option value="created">{t(appContent.prospects.sortByCreatedDate)}</option>
                <option value="budget">{t(appContent.prospects.sortByBudget)}</option>
                <option value="timeline">{t(appContent.prospects.sortByTimeline)}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prospects List */}
        <div className="space-y-6">
          {filteredProspects.map((prospect) => (
            <div key={prospect.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{prospect.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prospect.status)}`}>
                      {prospect.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {prospect.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {prospect.phone}
                    </span>
                    <span>{t(appContent.prospects.source)}: {prospect.source}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(prospect.score)}`}>{prospect.score}</div>
                  <div className="text-sm text-gray-500">{t(appContent.prospects.leadScore)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {/* Budget & Preferences */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {t(appContent.prospects.budgetPreferences)}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">{t(appContent.prospects.budget)}:</span>
                      <div className="font-medium text-gray-900">
                        ${prospect.budget.min.toLocaleString()} - ${prospect.budget.max.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">{t(appContent.prospects.propertyTypes)}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prospect.propertyType.map((type, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">{t(appContent.prospects.timeline)}:</span>
                      <div className="font-medium text-gray-900">{prospect.timeline}</div>
                    </div>
                  </div>
                </div>

                {/* Location Preferences */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t(appContent.prospects.preferredAreas)}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {prospect.preferredAreas.map((area, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Timeline */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {t(appContent.prospects.contactTimeline)}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.prospects.lastContact)}:</span>
                      <span className="font-medium text-gray-900">{prospect.lastContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.prospects.nextFollowUp)}:</span>
                      <span className="font-medium text-gray-900">{prospect.nextFollowUp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t(appContent.deals.agent)}:</span>
                      <span className="font-medium text-gray-900">{prospect.assignedAgent}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {prospect.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t(appContent.deals.dealNotes)}</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{prospect.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>{t(appContent.prospects.call)}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>{t(appContent.prospects.email)}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>{t(appContent.prospects.schedule)}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm font-medium transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>{t(appContent.prospects.edit)}</span>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {t(appContent.prospects.created)}: {prospect.createdDate} • ID: {prospect.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 