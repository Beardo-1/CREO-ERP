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
  X,
  UserPlus,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Download,
  Upload,
  FileText
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
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  // Load leads from localStorage
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    try {
      setLoading(true);
      setError(null);
      
      const leadsData = realDataService.getLeadsByStatus('new');
      setLeads(leadsData);
      
      // If no leads exist, add some sample data
      if (leadsData.length === 0) {
        addSampleLeads();
      }
    } catch (err) {
      console.error('Error loading leads:', err);
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const addSampleLeads = () => {
    const sampleLeads = [
      {
        name: 'أحمد محمد',
        email: 'ahmed.mohammed@email.com',
        phone: '+966501234567',
        source: 'website' as const,
        status: 'new' as const,
        score: 85,
        interest: 'buying' as const,
        budget: { min: 800000, max: 1200000 },
        location: 'الرياض',
        propertyType: ['residential'],
        notes: 'مهتم بشقة 3 غرف في حي الملز',
        lastContact: new Date(),
        nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        agent: { id: 'agent1', name: 'سارة أحمد' },
        tags: ['hot-lead', 'first-time-buyer']
      },
      {
        name: 'فاطمة علي',
        email: 'fatima.ali@email.com',
        phone: '+966507654321',
        source: 'referral' as const,
        status: 'new' as const,
        score: 92,
        interest: 'investing' as const,
        budget: { min: 1500000, max: 2500000 },
        location: 'جدة',
        propertyType: ['commercial', 'residential'],
        notes: 'مستثمرة تبحث عن عقارات للاستثمار',
        lastContact: new Date(),
        nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        agent: { id: 'agent2', name: 'محمد خالد' },
        tags: ['investor', 'high-value']
      }
    ];

    try {
      sampleLeads.forEach(leadData => {
        realDataService.addLead(leadData);
      });
      // Reload leads after adding sample data
      const updatedLeads = realDataService.getLeadsByStatus('new');
      setLeads(updatedLeads);
    } catch (error) {
      console.error('Error adding sample leads:', error);
    }
  };

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
      setError('Failed to add lead');
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
      setError('Failed to update lead');
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
      setError('Failed to delete lead');
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
      setError('Failed to convert lead');
    }
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
      
      const newLeads = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= headers.length && values[0]) {
          const leadData = {
            name: values[0] || 'Unnamed Lead',
            email: values[1] || '',
            phone: values[2] || '',
            source: (values[3] as any) || 'website',
            status: 'new' as const,
            score: parseInt(values[4]) || 75,
            interest: (values[5] as any) || 'buying',
            budget: { 
              min: parseInt(values[6]) || 100000, 
              max: parseInt(values[7]) || 500000 
            },
            location: values[8] || '',
            propertyType: [values[9] || 'residential'],
            notes: values[10] || '',
            lastContact: new Date(),
            nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            agent: { id: 'agent1', name: 'Agent' },
            tags: values[11] ? values[11].split(';') : []
          };
          newLeads.push(leadData);
        }
      }

      // Add leads to the system
      for (const leadData of newLeads) {
        realDataService.addLead(leadData);
      }

      setUploadStatus('success');
      setUploadMessage(`Successfully uploaded ${newLeads.length} leads!`);
      
      // Reload leads
      const updatedLeads = realDataService.getLeadsByStatus('new');
      setLeads(updatedLeads);
      
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

  const downloadTemplate = () => {
    const csvContent = `Name,Email,Phone,Source,Score,Interest,Budget Min,Budget Max,Location,Property Type,Notes,Tags
Ahmed Al-Rashid,ahmed.rashid@email.com,+966501234567,website,85,buying,800000,1200000,Riyadh,residential,Interested in luxury villa,hot-lead;first-time-buyer
Sarah Al-Mahmoud,sarah.mahmoud@email.com,+966507654321,referral,92,investing,1500000,2500000,Jeddah,commercial,Looking for investment opportunities,investor;high-value
Mohammed Al-Harbi,mohammed.harbi@email.com,+966512345678,social,78,renting,50000,80000,Dammam,residential,Needs family apartment,family;urgent`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Leads</h1>
          <p className="text-gray-600">Manage and nurture your new leads</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>
          <button
            onClick={downloadTemplate}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Template</span>
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Leads CSV</h3>
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
                  <p className="text-gray-600 mb-4">Select a CSV file to upload leads</p>
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
                  {t(appContent.leads.interestedIn)}: {(lead.propertyType || []).join(', ')}
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