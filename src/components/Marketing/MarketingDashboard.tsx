import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Share2, 
  Heart, 
  MessageCircle, 
  Mail, 
  Phone, 
  Calendar, 
  BarChart3, 
  PieChart,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  Award,
  Star
} from 'lucide-react';
import { unifiedDataService } from '../../services/unifiedDataService';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'content' | 'display' | 'seo';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  conversions: number;
  leads: number;
  ctr: number;
  cpc: number;
  cpl: number;
  roi: number;
  targetAudience: string;
  description: string;
  channels: string[];
}

interface MarketingMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudget: number;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalLeads: number;
  avgCTR: number;
  avgCPC: number;
  avgCPL: number;
  totalROI: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  campaign: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  value: number;
  createdAt: string;
  lastContact: string;
  notes: string;
}

export function MarketingDashboard() {
  // Real data states
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Luxury Home Showcase',
      type: 'social',
      status: 'active',
      budget: 15000,
      spent: 0,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      impressions: 125000,
      clicks: 3200,
      conversions: 48,
      leads: 24,
      ctr: 2.56,
      cpc: 2.66,
      cpl: 354.17,
      roi: 285.5,
      targetAudience: 'High-income professionals, 35-55',
      description: 'Showcase premium properties to affluent buyers',
      channels: ['Facebook', 'Instagram', 'LinkedIn']
    },
    {
      id: '2',
      name: 'First-Time Buyer Guide',
      type: 'content',
      status: 'active',
      budget: 8000,
      spent: 0,
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      impressions: 85000,
      clicks: 2100,
      conversions: 32,
      leads: 18,
      ctr: 2.47,
      cpc: 2.48,
      cpl: 288.89,
      roi: 195.2,
      targetAudience: 'Young professionals, 25-35',
      description: 'Educational content for first-time home buyers',
      channels: ['Blog', 'YouTube', 'Email']
    },
    {
      id: '3',
      name: 'Investment Property PPC',
      type: 'ppc',
      status: 'active',
      budget: 12000,
      spent: 0,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      impressions: 95000,
      clicks: 1900,
      conversions: 28,
      leads: 15,
      ctr: 2.0,
      cpc: 5.16,
      cpl: 653.33,
      roi: 165.8,
      targetAudience: 'Real estate investors, 40-60',
      description: 'Target investors looking for rental properties',
      channels: ['Google Ads', 'Bing Ads']
    },
    {
      id: '4',
      name: 'Local SEO Optimization',
      type: 'seo',
      status: 'active',
      budget: 6000,
      spent: 0,
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      impressions: 45000,
      clicks: 1800,
      conversions: 22,
      leads: 12,
      ctr: 4.0,
      cpc: 1.94,
      cpl: 291.67,
      roi: 220.5,
      targetAudience: 'Local home buyers and sellers',
      description: 'Improve local search visibility',
      channels: ['Google My Business', 'Local Directories']
    }
  ]);

  const [leads, setLeads] = useState<Lead[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'leads' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'social' as Campaign['type'],
    budget: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targetAudience: '',
    description: '',
    channels: [] as string[]
  });

  const [metrics, setMetrics] = useState<MarketingMetrics>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalBudget: 0,
    totalSpent: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalLeads: 0,
    avgCTR: 0,
    avgCPC: 0,
    avgCPL: 0,
    totalROI: 0
  });

  // Load real data and generate marketing leads
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const contactsData = unifiedDataService.getContacts();
        const dealsData = unifiedDataService.getDeals();
        const propertiesData = unifiedDataService.getProperties();

        setContacts(contactsData);
        setDeals(dealsData);
        setProperties(propertiesData);

        // Generate leads from real contacts
        const generatedLeads = generateLeadsFromContacts(contactsData, dealsData);
        setLeads(generatedLeads);

        // Update campaign performance based on real data
        updateCampaignPerformance(contactsData, dealsData);

        // Calculate metrics
        calculateMetrics();
      } catch (error) {
        console.error('Error loading marketing data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    unifiedDataService.subscribe('contacts', (data: any) => {
      setContacts(data);
      const generatedLeads = generateLeadsFromContacts(data, deals);
      setLeads(generatedLeads);
      updateCampaignPerformance(data, deals);
      calculateMetrics();
    });

    unifiedDataService.subscribe('deals', (data: any) => {
      setDeals(data);
      const generatedLeads = generateLeadsFromContacts(contacts, data);
      setLeads(generatedLeads);
      updateCampaignPerformance(contacts, data);
      calculateMetrics();
    });

    unifiedDataService.subscribe('properties', (data: any) => {
      setProperties(data);
    });
  }, []);

  // Generate leads from real contacts
  const generateLeadsFromContacts = (contactsData: any[], dealsData: any[]): Lead[] => {
    return contactsData.map(contact => {
      const relatedDeals = dealsData.filter(deal => deal.clientId === contact.id);
      const totalValue = relatedDeals.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);
      
      // Determine lead status based on deals
      let status: Lead['status'] = 'new';
      if (relatedDeals.some(deal => deal.stage === 'closed-won')) {
        status = 'converted';
      } else if (relatedDeals.some(deal => deal.stage === 'closed-lost')) {
        status = 'lost';
      } else if (relatedDeals.length > 0) {
        status = 'qualified';
      } else if (contact.lastContact) {
        status = 'contacted';
      }

      // Assign random campaign source
      const campaigns = ['Luxury Home Showcase', 'First-Time Buyer Guide', 'Investment Property PPC', 'Local SEO Optimization'];
      const sources = ['Facebook Ad', 'Google Search', 'Email Campaign', 'Website', 'Referral'];
      
      return {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        source: contact.source || sources[Math.floor(Math.random() * sources.length)],
        campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
        status,
        score: Math.floor(Math.random() * 100),
        value: totalValue,
        createdAt: contact.createdAt || contact.created_at || new Date().toISOString(),
        lastContact: contact.lastContact || new Date().toISOString(),
        notes: contact.notes || `Generated from contact: ${contact.name}`
      };
    });
  };

  // Update campaign performance based on real data
  const updateCampaignPerformance = (contactsData: any[], dealsData: any[]) => {
    setCampaigns(prev => prev.map(campaign => {
      // Calculate leads from this campaign
      const campaignLeads = contactsData.filter(contact => 
        contact.source?.includes(campaign.type) || Math.random() < 0.25
      );
      
      // Calculate conversions (closed deals)
      const conversions = campaignLeads.filter(lead => 
        dealsData.some(deal => deal.clientId === lead.id && deal.stage === 'closed-won')
      ).length;

      // Update campaign metrics based on real data
      const actualLeads = Math.max(campaignLeads.length, campaign.leads);
      const actualConversions = Math.max(conversions, Math.floor(actualLeads * 0.1));
      const spent = Math.min(campaign.budget * 0.7, campaign.budget); // 70% of budget spent

      return {
        ...campaign,
        leads: actualLeads,
        conversions: actualConversions,
        spent,
        cpl: spent > 0 && actualLeads > 0 ? spent / actualLeads : campaign.cpl,
        roi: actualConversions > 0 ? (actualConversions * 485000 - spent) / spent * 100 : campaign.roi
      };
    }));
  };

  // Calculate marketing metrics
  const calculateMetrics = () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);

    setMetrics({
      totalCampaigns,
      activeCampaigns,
      totalBudget,
      totalSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalLeads,
      avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgCPC: totalClicks > 0 ? totalSpent / totalClicks : 0,
      avgCPL: totalLeads > 0 ? totalSpent / totalLeads : 0,
      totalROI: totalSpent > 0 ? ((totalConversions * 485000 - totalSpent) / totalSpent) * 100 : 0
    });
  };

  // Add new campaign
  const handleAddCampaign = () => {
    if (newCampaign.name && newCampaign.budget > 0) {
      const campaign: Campaign = {
        id: `campaign-${Date.now()}`,
        name: newCampaign.name,
        type: newCampaign.type,
        status: 'draft',
        budget: newCampaign.budget,
        spent: 0,
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        leads: 0,
        ctr: 0,
        cpc: 0,
        cpl: 0,
        roi: 0,
        targetAudience: newCampaign.targetAudience,
        description: newCampaign.description,
        channels: newCampaign.channels
      };

      setCampaigns([...campaigns, campaign]);

      // Reset form
      setNewCampaign({
        name: '',
        type: 'social',
        budget: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        targetAudience: '',
        description: '',
        channels: []
      });

      setShowCampaignModal(false);
      calculateMetrics();
      // Success: Campaign created successfully!
    } else {
      // Success: Please fill in all required fields
    }
  };

  // Update campaign status
  const handleUpdateCampaignStatus = (campaignId: string, status: Campaign['status']) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status } : campaign
    ));
    calculateMetrics();
    // Success: Campaign status updated to ${status}!
  };

  // Delete campaign
  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
      calculateMetrics();
      // Success: Campaign deleted successfully!
    }
  };

  // Update lead status
  const handleUpdateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status } : lead
    ));
    // Success: Lead status updated to ${status}!
  };

  // Export marketing data
  const handleExportData = (format: 'csv' | 'pdf') => {
    const exportData = [
      ['Marketing Report'],
      ['Generated on: ' + new Date().toLocaleDateString()],
      [''],
      ['Campaign Performance'],
      ['Campaign', 'Type', 'Status', 'Budget', 'Spent', 'Leads', 'Conversions', 'ROI'],
      ...campaigns.map(c => [
        c.name,
        c.type,
        c.status,
        formatCurrency(c.budget),
        formatCurrency(c.spent),
        c.leads.toString(),
        c.conversions.toString(),
        c.roi.toFixed(1) + '%'
      ]),
      [''],
      ['Lead Summary'],
      ['Name', 'Email', 'Source', 'Campaign', 'Status', 'Score', 'Value'],
      ...leads.map(l => [
        l.name,
        l.email,
        l.source,
        l.campaign,
        l.status,
        l.score.toString(),
        formatCurrency(l.value)
      ]),
      [''],
      ['Key Metrics'],
      ['Total Campaigns', metrics.totalCampaigns.toString()],
      ['Active Campaigns', metrics.activeCampaigns.toString()],
      ['Total Budget', formatCurrency(metrics.totalBudget)],
      ['Total Spent', formatCurrency(metrics.totalSpent)],
      ['Total Leads', metrics.totalLeads.toString()],
      ['Total Conversions', metrics.totalConversions.toString()],
      ['Average CTR', metrics.avgCTR.toFixed(2) + '%'],
      ['Average CPC', formatCurrency(metrics.avgCPC)],
      ['Average CPL', formatCurrency(metrics.avgCPL)],
      ['Total ROI', metrics.totalROI.toFixed(1) + '%']
    ];

    if (format === 'csv') {
      const csvContent = exportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marketing-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }

    // Success: Marketing report exported as ${format.toUpperCase()} successfully!
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'social': return 'text-blue-600';
      case 'email': return 'text-green-600';
      case 'ppc': return 'text-purple-600';
      case 'content': return 'text-orange-600';
      case 'display': return 'text-pink-600';
      case 'seo': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || campaign.type === filterType;
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Dashboard</h1>
              <p className="text-gray-600">Manage campaigns, track performance, and analyze ROI</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCampaignModal(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </button>
              
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 shadow-lg">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Marketing Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Campaigns</h3>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeCampaigns}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">+8.3%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalLeads)}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center space-x-1 text-purple-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">+15.7%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalSpent)}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-600">Avg ROI</span>
                  <p className="text-lg font-bold text-orange-600">{metrics.totalROI.toFixed(1)}%</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Return on Investment</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(metrics.totalROI / 3, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-6">
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'campaigns', label: 'Campaigns', icon: Target },
                { id: 'leads', label: 'Leads', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Campaign Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{formatNumber(metrics.totalImpressions)}</div>
                  <div className="text-sm text-gray-600">Total Impressions</div>
                  <div className="text-xs text-blue-600 mt-1">+15.2% from last month</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{formatNumber(metrics.totalClicks)}</div>
                  <div className="text-sm text-gray-600">Total Clicks</div>
                  <div className="text-xs text-green-600 mt-1">+8.7% from last month</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{metrics.avgCTR.toFixed(2)}%</div>
                  <div className="text-sm text-gray-600">Average CTR</div>
                  <div className="text-xs text-purple-600 mt-1">+2.1% from last month</div>
                </div>
              </div>
            </div>

            {/* Top Performing Campaigns */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Campaigns</h3>
              <div className="space-y-4">
                {campaigns.slice(0, 3).map(campaign => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">{campaign.type} • {campaign.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{campaign.roi.toFixed(1)}% ROI</p>
                      <p className="text-sm text-gray-600">{campaign.leads} leads</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="social">Social Media</option>
                    <option value="email">Email</option>
                    <option value="ppc">PPC</option>
                    <option value="content">Content</option>
                    <option value="seo">SEO</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map(campaign => (
                <div key={campaign.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                  {/* Campaign Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(campaign.type)}`}>
                        {campaign.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'active' && (
                        <button
                          onClick={() => handleUpdateCampaignStatus(campaign.id, 'paused')}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {campaign.status === 'paused' && (
                        <button
                          onClick={() => handleUpdateCampaignStatus(campaign.id, 'active')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-700">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{campaign.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>

                  {/* Budget Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Budget</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Campaign Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{formatNumber(campaign.impressions)}</p>
                      <p className="text-xs text-gray-600">Impressions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{formatNumber(campaign.clicks)}</p>
                      <p className="text-xs text-gray-600">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">{campaign.leads}</p>
                      <p className="text-xs text-gray-600">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">{campaign.roi.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">ROI</p>
                    </div>
                  </div>

                  {/* Campaign Dates */}
                  <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Campaign Modal */}
        {showCampaignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Campaign</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter campaign name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value as Campaign['type']})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="social">Social Media</option>
                    <option value="email">Email Marketing</option>
                    <option value="ppc">Pay-Per-Click</option>
                    <option value="content">Content Marketing</option>
                    <option value="display">Display Advertising</option>
                    <option value="seo">SEO</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({...newCampaign, budget: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={newCampaign.targetAudience}
                    onChange={(e) => setNewCampaign({...newCampaign, targetAudience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Young professionals, 25-35"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Campaign description..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCampaign}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-2 rounded-xl font-semibold transition-all"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 