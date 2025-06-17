import React, { useState } from 'react';
import {
  Mail,
  MessageCircle,
  Globe,
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Plus,
  Filter,
  Search,
  BarChart3,
  Target,
  Send,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'sms' | 'direct-mail';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  objectives: string[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    leads: number;
    cost_per_lead: number;
    roi: number;
  };
  channels: string[];
  createdBy: string;
  lastModified: string;
}

export default function MarketingCampaigns() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('last-modified');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const campaigns: Campaign[] = [
    {
      id: 'CAMP-001',
      name: 'Spring Home Buyers Campaign',
      type: 'email',
      status: 'active',
      budget: 5000,
      spent: 3200,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      targetAudience: 'First-time home buyers aged 25-40',
      objectives: ['Lead Generation', 'Brand Awareness'],
      metrics: {
        impressions: 45000,
        clicks: 2250,
        conversions: 180,
        leads: 45,
        cost_per_lead: 71.11,
        roi: 240
      },
      channels: ['Email', 'Social Media'],
      createdBy: 'Sarah Johnson',
      lastModified: '2024-01-28'
    },
    {
      id: 'CAMP-002',
      name: 'Luxury Property Showcase',
      type: 'social',
      status: 'active',
      budget: 8000,
      spent: 4500,
      startDate: '2024-01-10',
      endDate: '2024-02-28',
      targetAudience: 'High-income professionals 35-55',
      objectives: ['Lead Generation', 'Property Promotion'],
      metrics: {
        impressions: 120000,
        clicks: 3600,
        conversions: 72,
        leads: 18,
        cost_per_lead: 250,
        roi: 180
      },
      channels: ['Facebook', 'Instagram', 'LinkedIn'],
      createdBy: 'Mike Chen',
      lastModified: '2024-01-27'
    },
    {
      id: 'CAMP-003',
      name: 'Downtown Condos PPC',
      type: 'ppc',
      status: 'paused',
      budget: 3000,
      spent: 1800,
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      targetAudience: 'Urban professionals 28-45',
      objectives: ['Lead Generation', 'Property Sales'],
      metrics: {
        impressions: 25000,
        clicks: 1250,
        conversions: 50,
        leads: 12,
        cost_per_lead: 150,
        roi: 120
      },
      channels: ['Google Ads', 'Bing Ads'],
      createdBy: 'Emily Davis',
      lastModified: '2024-01-25'
    },
    {
      id: 'CAMP-004',
      name: 'New Year Property Hunt',
      type: 'sms',
      status: 'completed',
      budget: 2000,
      spent: 1950,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      targetAudience: 'Existing leads and past clients',
      objectives: ['Re-engagement', 'Lead Nurturing'],
      metrics: {
        impressions: 5000,
        clicks: 750,
        conversions: 25,
        leads: 8,
        cost_per_lead: 243.75,
        roi: 95
      },
      channels: ['SMS', 'WhatsApp'],
      createdBy: 'Sarah Johnson',
      lastModified: '2024-01-31'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200',
      active: 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200',
      paused: 'bg-gradient-to-r from-yellow-50 to-amber-100 text-amber-700 border border-amber-200',
      completed: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200',
      scheduled: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      email: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200',
      social: 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 border border-pink-200',
      ppc: 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200',
      sms: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200',
      'direct-mail': 'bg-gradient-to-r from-amber-50 to-orange-100 text-orange-700 border border-orange-200'
    };
    return colors[type as keyof typeof colors] || colors.email;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: Mail,
      social: MessageCircle,
      ppc: Globe,
      sms: MessageCircle,
      'direct-mail': Send
    };
    const Icon = icons[type as keyof typeof icons] || Mail;
    return <Icon className="w-4 h-4" />;
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalBudget = filteredCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = filteredCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalLeads = filteredCampaigns.reduce((sum, campaign) => sum + campaign.metrics.leads, 0);
  const avgROI = Math.round(filteredCampaigns.reduce((sum, campaign) => sum + campaign.metrics.roi, 0) / filteredCampaigns.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {t(appContent.marketing.marketingCampaigns)}
              </h1>
              <p className="text-gray-600 text-lg">{filteredCampaigns.length} {t(appContent.marketing.activeCampaigns)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t(appContent.marketing.gridView)}
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t(appContent.marketing.listView)}
                </button>
              </div>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3">
                <Plus className="w-6 h-6" />
                <span>{t(appContent.marketing.createCampaign)}</span>
              </button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.marketing.totalBudget)}</p>
                  <p className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.marketing.totalSpent)}</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-rose-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.marketing.totalLeads)}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.marketing.avgROI)}</p>
                  <p className="text-2xl font-bold text-gray-900">{avgROI}%</p>
                </div>
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-amber-600" />
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
                  placeholder={t(appContent.marketing.searchCampaigns)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
            >
              <option value="all">{t(appContent.marketing.allTypes)}</option>
              <option value="email">{t(appContent.marketing.campaignEmail)}</option>
              <option value="social">{t(appContent.marketing.campaignSocialMedia)}</option>
              <option value="ppc">{t(appContent.marketing.campaignPPC)}</option>
              <option value="sms">{t(appContent.marketing.campaignSMS)}</option>
              <option value="direct-mail">{t(appContent.marketing.campaignDirectMail)}</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
            >
              <option value="all">{t(appContent.marketing.allCampaignStatus)}</option>
              <option value="draft">{t(appContent.marketing.campaignDraft)}</option>
              <option value="active">{t(appContent.marketing.campaignActive)}</option>
              <option value="paused">{t(appContent.marketing.campaignPaused)}</option>
              <option value="completed">{t(appContent.marketing.campaignCompleted)}</option>
              <option value="scheduled">{t(appContent.marketing.campaignScheduled)}</option>
            </select>
          </div>
        </div>

        {/* Enhanced Campaigns Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'space-y-6'}>
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(campaign.type).replace('text-', 'bg-').replace('border', '').split(' ')[0]}`}>
                        {getTypeIcon(campaign.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(campaign.type)}`}>
                          {campaign.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{t(appContent.marketing.campaignBudget)}</p>
                      <p className="text-lg font-bold text-gray-900">${campaign.budget.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{t(appContent.marketing.campaignSpent)}</p>
                      <p className="text-lg font-bold text-gray-900">${campaign.spent.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{t(appContent.marketing.campaignROI)}</p>
                      <p className={`text-lg font-bold ${campaign.metrics.roi >= 150 ? 'text-green-600' : campaign.metrics.roi >= 100 ? 'text-amber-600' : 'text-red-600'}`}>
                        {campaign.metrics.roi}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Metrics */}
              <div className="p-6 border-b border-gray-100">
                <h5 className="font-semibold text-gray-900 mb-4">{t(appContent.marketing.performanceMetrics)}</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-xl text-center">
                    <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t(appContent.marketing.impressions)}</p>
                    <p className="text-sm font-bold text-blue-700">{campaign.metrics.impressions.toLocaleString()}</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl text-center">
                    <MousePointer className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t(appContent.marketing.clicks)}</p>
                    <p className="text-sm font-bold text-emerald-700">{campaign.metrics.clicks.toLocaleString()}</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl text-center">
                    <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t(appContent.marketing.conversions)}</p>
                    <p className="text-sm font-bold text-purple-700">{campaign.metrics.conversions}</p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl text-center">
                    <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t(appContent.marketing.leads)}</p>
                    <p className="text-sm font-bold text-amber-700">{campaign.metrics.leads}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-600">{t(appContent.marketing.costPerLead)}</p>
                    <p className="text-lg font-bold text-gray-900">${campaign.metrics.cost_per_lead.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-600">{t(appContent.marketing.clickRate)}</p>
                    <p className="text-lg font-bold text-gray-900">{((campaign.metrics.clicks / campaign.metrics.impressions) * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{t(appContent.marketing.targetAudience)}</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{campaign.targetAudience}</p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{t(appContent.marketing.objectives)}</h5>
                    <div className="flex flex-wrap gap-2">
                      {campaign.objectives.map((objective, index) => (
                        <span key={index} className="bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                          {objective}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">{t(appContent.marketing.channels)}</h5>
                  <div className="flex flex-wrap gap-2">
                    {campaign.channels.map((channel, index) => (
                      <span key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {campaign.status === 'active' && (
                      <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200">
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {campaign.status === 'paused' && (
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  {t(appContent.marketing.createdBy)} {campaign.createdBy} • {t(appContent.marketing.lastModified)}: {new Date(campaign.lastModified).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(appContent.marketing.noCampaignsFound)}</h3>
              <p className="text-gray-600 mb-6">{t(appContent.marketing.noCampaignsMatch)}</p>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                {t(appContent.marketing.clearCampaignFilters)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 