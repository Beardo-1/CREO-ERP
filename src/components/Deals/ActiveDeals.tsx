import React, { useState, useEffect } from 'react';
import {
  Handshake,
  DollarSign,
  Calendar,
  Clock,
  User,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  Target,
  FileText,
  Users
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';
import { Deal as DataDeal } from '../../types';

interface Deal {
  id: string;
  title: string;
  property: {
    id: string;
    address: string;
    type: string;
    image: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    type: 'buyer' | 'seller';
  };
  agent: {
    id: string;
    name: string;
    avatar: string;
  };
  value: number;
  commission: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'contract' | 'closing';
  probability: number;
  expectedCloseDate: Date;
  createdDate: Date;
  lastActivity: Date;
  daysInStage: number;
  notes: string;
  nextAction: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function ActiveDeals() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'value' | 'closeDate' | 'probability'>('closeDate');
  const [deals, setDeals] = useState<Deal[]>([]);

  // Load deals from dataService
  useEffect(() => {
    const loadDeals = async () => {
      try {
        const allDeals = await unifiedDataService.getDeals();
        // Ensure we have an array
        const safeDeals = Array.isArray(allDeals) ? allDeals : [];
      // Convert DataDeal to Deal format for display
        const formattedDeals: Deal[] = safeDeals.map(deal => ({
        id: deal.id,
        title: `${deal.type} - ${deal.stage}`,
        property: {
          id: deal.propertyId,
          address: `Property ${deal.propertyId}`,
          type: 'property',
          image: ""
        },
        client: {
          id: deal.clientId,
          name: `Client ${deal.clientId}`,
          email: 'client@example.com',
          phone: '+1 (555) 000-0000',
          avatar: "",
          type: 'buyer'
        },
        agent: {
          id: deal.agentId,
          name: `Agent ${deal.agentId}`,
          avatar: ""
        },
        value: deal.value,
        commission: deal.commission,
        stage: deal.stage.toLowerCase() as Deal['stage'],
        probability: 50, // Default probability
        expectedCloseDate: new Date(deal.expectedCloseDate),
        createdDate: new Date(deal.createdAt),
        lastActivity: new Date(deal.updatedAt),
        daysInStage: Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24)),
        notes: deal.notes,
        nextAction: 'Follow up',
        priority: 'medium'
      }));
      setDeals(formattedDeals);
      } catch (error) {
        console.error('Error loading deals:', error);
        setDeals([]);
      }
    };

    loadDeals();

    // Subscribe to data changes
    const handleDealsChange = (updatedDeals: DataDeal[]) => {
      const safeDeals = Array.isArray(updatedDeals) ? updatedDeals : [];
      const formattedDeals: Deal[] = safeDeals.map(deal => ({
        id: deal.id,
        title: `${deal.type} - ${deal.stage}`,
        property: {
          id: deal.propertyId,
          address: `Property ${deal.propertyId}`,
          type: 'property',
          image: ""
        },
        client: {
          id: deal.clientId,
          name: `Client ${deal.clientId}`,
          email: 'client@example.com',
          phone: '+1 (555) 000-0000',
          avatar: "",
          type: 'buyer'
        },
        agent: {
          id: deal.agentId,
          name: `Agent ${deal.agentId}`,
          avatar: ""
        },
        value: deal.value,
        commission: deal.commission,
        stage: deal.stage.toLowerCase() as Deal['stage'],
        probability: 50,
        expectedCloseDate: new Date(deal.expectedCloseDate),
        createdDate: new Date(deal.createdAt),
        lastActivity: new Date(deal.updatedAt),
        daysInStage: Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24)),
        notes: deal.notes,
        nextAction: 'Follow up',
        priority: 'medium'
      }));
      setDeals(formattedDeals);
    };

    unifiedDataService.subscribe('dealsChanged', handleDealsChange);

    return () => {
      unifiedDataService.unsubscribe('dealsChanged', handleDealsChange);
    };
  }, []);

  const getStageColor = (stage: string) => {
    const colors = {
      lead: 'bg-gray-100 text-gray-800',
      qualified: 'bg-blue-100 text-blue-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-orange-100 text-orange-800',
      contract: 'bg-purple-100 text-purple-800',
      closing: 'bg-green-100 text-green-800'
    };
    return colors[stage as keyof typeof colors] || colors.lead;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const formatPrice = (price: number) => {
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
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 0) return `In ${Math.abs(days)} days`;
    return `${days} days ago`;
  };

  const getStageProgress = (stage: string) => {
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'contract', 'closing'];
    const currentIndex = stages.indexOf(stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || deal.stage === filterStage;
    const matchesPriority = filterPriority === 'all' || deal.priority === filterPriority;
    return matchesSearch && matchesStage && matchesPriority;
  });

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const totalCommission = deals.reduce((sum, deal) => sum + deal.commission, 0);
  const averageProbability = deals.length > 0 ? Math.round(
    deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length
  ) : 0;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.deals.activeDeals)}</h1>
            <p className="text-gray-600">{filteredDeals.length} {t(appContent.deals.dealsInProgress)}</p>
          </div>
          
          <button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>{t(appContent.deals.newDeal)}</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(totalValue)}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.deals.totalPipelineValue)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(totalCommission)}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.deals.expectedCommission)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{averageProbability}%</h3>
            <p className="text-gray-600 text-sm">{t(appContent.deals.averageProbability)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600">
                <Handshake className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{deals.length}</h3>
            <p className="text-gray-600 text-sm">{t(appContent.deals.activeDeals)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t(appContent.deals.searchDeals)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">{t(appContent.deals.allStages)}</option>
              <option value="lead">{t(appContent.deals.lead)}</option>
              <option value="qualified">{t(appContent.deals.qualified)}</option>
              <option value="proposal">{t(appContent.deals.proposal)}</option>
              <option value="negotiation">{t(appContent.deals.negotiation)}</option>
              <option value="contract">{t(appContent.deals.contract)}</option>
              <option value="closing">{t(appContent.deals.closed)}</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">{t(appContent.deals.allPriorities)}</option>
              <option value="urgent">{t(appContent.deals.urgent)}</option>
              <option value="high">{t(appContent.deals.high)}</option>
              <option value="medium">{t(appContent.deals.medium)}</option>
              <option value="low">{t(appContent.deals.low)}</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="closeDate">{t(appContent.deals.sortByCloseDate)}</option>
              <option value="value">{t(appContent.deals.sortByValue)}</option>
              <option value="probability">{t(appContent.deals.sortByProbability)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="space-y-6">
        {filteredDeals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start space-x-6">
              {/* Property Image */}
              <div className="w-24 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={deal.property.image}
                  alt={deal.property.address}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Deal Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{deal.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{deal.property.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                        {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(deal.priority)}`}>
                        {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {formatPrice(deal.value)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {t(appContent.deals.commissionText)} {formatPrice(deal.commission)}
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">{deal.probability}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{t(appContent.deals.dealProgressText)}</span>
                    <span>{Math.round(getStageProgress(deal.stage))}% {t(appContent.deals.completeText)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStageProgress(deal.stage)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Client and Agent Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={deal.client.avatar}
                      alt={deal.client.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{deal.client.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{deal.client.type}</div>
                    </div>
                    <div className="flex items-center space-x-2 ml-auto">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img
                      src={deal.agent.avatar}
                      alt={deal.agent.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{deal.agent.name}</div>
                      <div className="text-sm text-gray-600">{t(appContent.deals.agentText)}</div>
                    </div>
                  </div>
                </div>

                {/* Timeline and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{t(appContent.deals.closeText)} {deal.expectedCloseDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{deal.daysInStage} {t(appContent.deals.daysInStageText)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      <span>{deal.nextAction}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <Handshake className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(appContent.deals.noDealsFound)}</h3>
          <p className="text-gray-600 mb-6">{t(appContent.deals.adjustSearchCriteria)}</p>
          <button
            onClick={() => {
              // Navigate to Deals Pipeline to create a new deal
              // @ts-ignore
              if (window.setActiveTab) window.setActiveTab('deals-pipeline');
            }}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg"
          >
            {t(appContent.deals.createFirstDeal)}
          </button>
        </div>
      )}
    </div>
  );
} 