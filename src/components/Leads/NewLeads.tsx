import React, { useState, useEffect } from 'react';
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Plus,
  Search,
  Filter,
  Edit,
  MessageCircle,
  Eye,
  Clock,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  DollarSign,
  X
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { realDataService, Lead } from '../../services/realDataService';

export default function NewLeads() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterInterest, setFilterInterest] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'followUp'>('score');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load real leads data
  useEffect(() => {
    const loadLeads = () => {
      try {
        setLoading(true);
        const leadsData = realDataService.getLeadsByStatus('new');
        setLeads(leadsData);
      } catch (error) {
        console.error('Error loading leads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  // Sample leads for initial data (if no real data exists)
  const sampleLeads: Lead[] = [
    {
      id: '1',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      phone: '+1 (555) 123-4567',
      source: 'website',
      status: 'new',
      score: 85,
      interest: 'buying',
      budget: {
        min: 300000,
        max: 450000
      },
      location: 'Downtown',
      propertyType: ['condo', 'apartment'],
      notes: 'Looking for modern apartment with city view. First-time buyer.',
      createdDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 24 * 60 * 60 * 1000),
      agent: {
        id: '1',
        name: 'Mike Chen'
      },
      tags: ['first-time-buyer', 'high-priority']
    },
    {
      id: '2',
      name: 'David Thompson',
      email: 'david.thompson@email.com',
      phone: '+1 (555) 234-5678',
      source: 'referral',
      status: 'new',
      score: 92,
      interest: 'selling',
      budget: {
        min: 0,
        max: 0
      },
      location: 'Suburbs',
      propertyType: ['house'],
      notes: 'Referred by existing client. Wants to sell family home.',
      createdDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
      lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 12 * 60 * 60 * 1000),
      agent: {
        id: '2',
        name: 'Sarah Johnson'
      },
      tags: ['referral', 'hot-lead']
    },
    {
      id: '3',
      name: 'Lisa Chen',
      email: 'lisa.chen@email.com',
      phone: '+1 (555) 345-6789',
      source: 'social',
      status: 'new',
      score: 78,
      interest: 'investing',
      budget: {
        min: 200000,
        max: 500000
      },
      location: 'Arts District',
      propertyType: ['apartment', 'loft'],
      notes: 'Interested in investment properties. Looking for rental income.',
      createdDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 48 * 60 * 60 * 1000),
      agent: {
        id: '3',
        name: 'Emily Davis'
      },
      tags: ['investor', 'social-media']
    }
  ];

  const getSourceColor = (source: string) => {
    const colors = {
      website: 'bg-blue-100 text-blue-800',
      referral: 'bg-green-100 text-green-800',
      social: 'bg-purple-100 text-purple-800',
      advertising: 'bg-orange-100 text-orange-800',
      'cold-call': 'bg-gray-100 text-gray-800',
      'walk-in': 'bg-amber-100 text-amber-800'
    };
    return colors[source as keyof typeof colors] || colors.website;
  };

  const getInterestColor = (interest: string) => {
    const colors = {
      buying: 'bg-blue-100 text-blue-800',
      selling: 'bg-green-100 text-green-800',
      renting: 'bg-purple-100 text-purple-800',
      investing: 'bg-amber-100 text-amber-800'
    };
    return colors[interest as keyof typeof colors] || colors.buying;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (date: Date | string | undefined) => {
    if (!date) return 'Unknown';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  // Initialize with sample data if no real data exists
  useEffect(() => {
    if (leads.length === 0 && !loading) {
      sampleLeads.forEach(lead => {
        realDataService.addLead({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          source: lead.source,
          status: lead.status,
          score: lead.score,
          interest: lead.interest,
          budget: lead.budget,
          location: lead.location,
          propertyType: lead.propertyType,
          notes: lead.notes,
          lastContact: lead.lastContact,
          nextFollowUp: lead.nextFollowUp,
          agent: lead.agent,
          tags: lead.tags
        });
      });
      // Reload leads after adding sample data
      const leadsData = realDataService.getLeadsByStatus('new');
      setLeads(leadsData);
    }
  }, [leads.length, loading]);

  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    const matchesInterest = filterInterest === 'all' || lead.interest === filterInterest;
    return matchesSearch && matchesSource && matchesInterest;
  });

  const totalLeads = leads.length;
  const highScoreLeads = leads.filter((l: Lead) => l.score >= 80).length;
  const averageScore = leads.length > 0 ? Math.round(leads.reduce((sum: number, lead: Lead) => sum + lead.score, 0) / leads.length) : 0;

  // Lead operations
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'createdDate'>) => {
    try {
      const newLead = realDataService.addLead(leadData);
      setLeads(prev => [...prev, newLead]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    try {
      const updatedLead = realDataService.updateLead(id, updates);
      if (updatedLead) {
        setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteLead = (id: string) => {
    try {
      const success = realDataService.deleteLead(id);
      if (success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleConvertLead = (leadId: string) => {
    try {
      const deal = realDataService.convertLeadToDeal(leadId, {});
      if (deal) {
        // Update lead status to converted
        handleUpdateLead(leadId, { status: 'converted' });
        // Remove from new leads list
        setLeads(prev => prev.filter(l => l.id !== leadId));
      }
    } catch (error) {
      console.error('Error converting lead:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.leads.newLeads)}</h1>
            <p className="text-gray-600">{filteredLeads.length} {t(appContent.leads.newLeadsToReview)}</p>
          </div>
          
          <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>{t(appContent.leads.addLead)}</span>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalLeads}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.leads.totalNewLeads)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{highScoreLeads}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.leads.highScoreLeads)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{averageScore}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.leads.averageScore)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">85%</h3>
            <p className="text-gray-600 text-sm">{t(appContent.leads.conversionRate)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t(appContent.leads.searchLeads)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">{t(appContent.leads.allSources)}</option>
              <option value="website">{t(appContent.leads.website)}</option>
              <option value="referral">{t(appContent.leads.referral)}</option>
              <option value="social">{t(appContent.leads.socialMedia)}</option>
              <option value="advertising">{t(appContent.leads.advertising)}</option>
              <option value="cold-call">{t(appContent.leads.coldCall)}</option>
              <option value="walk-in">{t(appContent.leads.walkIn)}</option>
            </select>
            
            <select
              value={filterInterest}
              onChange={(e) => setFilterInterest(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">{t(appContent.leads.allInterests)}</option>
              <option value="buying">{t(appContent.leads.buying)}</option>
              <option value="selling">{t(appContent.leads.selling)}</option>
              <option value="renting">{t(appContent.leads.renting)}</option>
              <option value="investing">{t(appContent.leads.investing)}</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="score">{t(appContent.leads.sortByScore)}</option>
              <option value="date">{t(appContent.leads.sortByDate)}</option>
              <option value="followUp">{t(appContent.leads.sortByFollowUp)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
            {/* Lead Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{lead.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                    {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInterestColor(lead.interest)}`}>
                    {lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(lead.score)}`}>
                  {lead.score}
                </div>
                <div className="text-xs text-gray-500 mt-1">{t(appContent.leads.score)}</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{lead.location}</span>
              </div>
            </div>

            {/* Budget & Preferences */}
            {lead.interest === 'buying' && (
              <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                <div className="text-sm font-medium text-gray-900 mb-1">{t(appContent.leads.budgetRange)}</div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatPrice(lead.budget.min)} - {formatPrice(lead.budget.max)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {t(appContent.leads.interestedIn)}: {lead.propertyType.join(', ')}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 line-clamp-2">{lead.notes}</div>
            </div>

            {/* Tags */}
            {lead.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="mb-4 text-sm text-gray-600">
              <div className="flex items-center mb-1">
                <Clock className="w-4 h-4 mr-1" />
                <span>{t(appContent.leads.created)}: {formatTime(lead.createdDate)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{t(appContent.leads.followUp)}: {formatTime(lead.nextFollowUp)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {t(appContent.leads.agent)}: {lead.agent.name}
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleConvertLead(lead.id)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Convert to Deal"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleUpdateLead(lead.id, { status: 'contacted', lastContact: new Date() })}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Mark as Contacted"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteLead(lead.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Lead"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(appContent.leads.noLeadsFound)}</h3>
          <p className="text-gray-600 mb-6">{t(appContent.leads.adjustSearchCriteria)}</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg"
          >
            {t(appContent.leads.addYourFirstLead)}
          </button>
        </div>
      )}
    </div>
  );
} 