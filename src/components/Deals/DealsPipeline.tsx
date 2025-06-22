import React, { useState, useEffect } from 'react';
import { DealCard } from './DealCard';
import { Deal as DealType, Property, Contact } from '../../types';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  BarChart3,
  X
} from 'lucide-react';
import { unifiedDataService } from '../../services/unifiedDataService';

interface PipelineDeal {
  id: string;
  title: string;
  client: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  probability: number;
  expectedClose: string;
  daysInStage: number;
  agent: string;
  property: string;
  lastActivity: string;
  notes: string;
}

interface NewDeal {
  title: string;
  client: string;
  property: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  expectedClose: string;
  notes: string;
}

export default function DealsPipeline() {
  const { t } = useTranslation();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<PipelineDeal | null>(null);
  const [deals, setDeals] = useState<PipelineDeal[]>([]);
  const [newDeal, setNewDeal] = useState<NewDeal>({
    title: '',
    client: '',
    property: '',
    value: 0,
    stage: 'lead',
    expectedClose: '',
    notes: ''
  });

  // Load deals from dataService
  useEffect(() => {
    const loadDeals = async () => {
      try {
        const dataDeals = await unifiedDataService.getDeals();
        if (Array.isArray(dataDeals)) {
          const formattedDeals: PipelineDeal[] = dataDeals.map(deal => ({
        id: deal.id,
            title: `${deal.type || 'Deal'} - ${deal.stage}`,
            client: `Client ${deal.clientId || deal.id}`,
            value: deal.value || 0,
            stage: deal.stage.toLowerCase() as PipelineDeal['stage'],
        probability: calculateProbability(deal.stage),
            expectedClose: deal.expectedCloseDate || '',
            daysInStage: Math.floor((Date.now() - new Date(deal.updatedAt || deal.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            agent: `Agent ${deal.agentId || deal.id}`,
            property: `Property ${deal.propertyId || deal.id}`,
            lastActivity: new Date(deal.updatedAt || deal.createdAt).toLocaleDateString(),
            notes: deal.notes || ''
      }));
      setDeals(formattedDeals);
        }
      } catch (error) {
        console.error('Failed to load deals:', error);
        setDeals([]);
      }
    };

    loadDeals();

    // Subscribe to deal changes
    const handleDealChange = (updatedDeals: DealType[]) => {
      if (Array.isArray(updatedDeals)) {
        const formattedDeals: PipelineDeal[] = updatedDeals.map(deal => ({
        id: deal.id,
          title: `${deal.type || 'Deal'} - ${deal.stage}`,
          client: `Client ${deal.clientId || deal.id}`,
          value: deal.value || 0,
          stage: deal.stage.toLowerCase() as PipelineDeal['stage'],
        probability: calculateProbability(deal.stage),
          expectedClose: deal.expectedCloseDate || '',
          daysInStage: Math.floor((Date.now() - new Date(deal.updatedAt || deal.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
          agent: `Agent ${deal.agentId || deal.id}`,
          property: `Property ${deal.propertyId || deal.id}`,
          lastActivity: new Date(deal.updatedAt || deal.createdAt).toLocaleDateString(),
          notes: deal.notes || ''
      }));
      setDeals(formattedDeals);
      }
    };

    unifiedDataService.subscribe('dealsChanged', handleDealChange);

    return () => {
      unifiedDataService.unsubscribe('dealsChanged', handleDealChange);
    };
  }, []);

  const calculateProbability = (stage: string): number => {
    const probabilities = {
      'Lead': 20,
      'Qualified': 40,
      'Proposal': 60,
      'Negotiation': 75,
      'Contract': 85,
      'Closing': 95,
      'Closed': 100
    };
    return probabilities[stage as keyof typeof probabilities] || 20;
  };

  const stages = [
    { id: 'lead', name: t(appContent.deals.pipelineLead), color: 'bg-gray-500' },
    { id: 'qualified', name: t(appContent.deals.pipelineQualified), color: 'bg-blue-500' },
    { id: 'proposal', name: t(appContent.deals.pipelineProposal), color: 'bg-yellow-500' },
    { id: 'negotiation', name: t(appContent.deals.pipelineNegotiation), color: 'bg-orange-500' },
    { id: 'closing', name: t(appContent.deals.pipelineClosing), color: 'bg-purple-500' },
    { id: 'won', name: t(appContent.deals.pipelineWon), color: 'bg-green-500' },
    { id: 'lost', name: t(appContent.deals.pipelineLost), color: 'bg-red-500' }
  ];

  const getStageColor = (stage: string) => {
    const stageInfo = stages.find(s => s.id === stage);
    return stageInfo?.color || 'bg-gray-500';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgent = agentFilter === 'all' || deal.agent === agentFilter;
    const matchesStage = !selectedStage || deal.stage === selectedStage;
    return matchesSearch && matchesAgent && matchesStage;
  });

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgProbability = Math.round(filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / filteredDeals.length) || 0;
  const weightedValue = filteredDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  const stageStats = stages.map(stage => {
    const stageDeals = filteredDeals.filter(deal => deal.stage === stage.id);
    const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    return {
      ...stage,
      count: stageDeals.length,
      value: stageValue,
      deals: stageDeals
    };
  });

  // Functional handlers
  const handleAddDeal = () => {
    setShowAddModal(true);
  };

  const handleCreateDeal = async () => {
    if (newDeal.title && newDeal.client && newDeal.value > 0) {
      try {
        const deal: Omit<DealType, 'id'> = {
          propertyId: 'property-1', // Default property ID
          clientId: 'client-1', // Default client ID
          agentId: 'agent-1', // Default agent ID
          type: 'Sale',
          stage: newDeal.stage.charAt(0).toUpperCase() + newDeal.stage.slice(1) as DealType['stage'],
          value: newDeal.value,
          commission: newDeal.value * 0.06, // 6% commission
          expectedCloseDate: newDeal.expectedClose,
          notes: newDeal.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paymentMethod: 'Bank Transfer'
        };

        unifiedDataService.addDeal(deal as DealType);

        // Reset form
        setNewDeal({
          title: '',
          client: '',
          property: '',
          value: 0,
          stage: 'lead',
          expectedClose: '',
          notes: ''
        });
        setShowAddModal(false);
        // Success: Deal created successfully!
      } catch (error) {
        console.error('Error creating deal:', error);
        // Success: Error creating deal. Please try again.
      }
    } else {
      // Success: Please fill in all required fields
    }
  };

  const handleStageChange = (dealId: string, newStage: PipelineDeal['stage']) => {
    try {
      const deal = deals.find(d => d.id === dealId);
      if (deal) {
        const updatedDeal: Partial<DealType> = {
          stage: newStage.charAt(0).toUpperCase() + newStage.slice(1) as DealType['stage'],
          updatedAt: new Date().toISOString()
        };
        
        unifiedDataService.updateDeal(dealId, updatedDeal);
        // Success: Deal moved to ${newStage} stage successfully!
      }
    } catch (error) {
      console.error('Error updating deal stage:', error);
      // Success: Error updating deal stage. Please try again.
    }
  };

  const handleEditDeal = (deal: PipelineDeal) => {
    setSelectedDeal(deal);
    setNewDeal({
      title: deal.title,
      client: deal.client,
      property: deal.property,
      value: deal.value,
      stage: deal.stage,
      expectedClose: deal.expectedClose,
      notes: deal.notes
    });
    setShowEditModal(true);
  };

  const handleUpdateDeal = async () => {
    if (selectedDeal && newDeal.title && newDeal.client && newDeal.value > 0) {
      try {
        const updatedDeal: Partial<DealType> = {
          type: 'Sale',
          stage: newDeal.stage.charAt(0).toUpperCase() + newDeal.stage.slice(1) as DealType['stage'],
          value: newDeal.value,
          commission: newDeal.value * 0.06,
          expectedCloseDate: newDeal.expectedClose,
          notes: newDeal.notes,
          updatedAt: new Date().toISOString()
        };

        unifiedDataService.updateDeal(selectedDeal.id, updatedDeal);
        setShowEditModal(false);
        setSelectedDeal(null);
        // Success: Deal updated successfully!
      } catch (error) {
        console.error('Error updating deal:', error);
        // Success: Error updating deal. Please try again.
      }
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        unifiedDataService.deleteDeal(dealId);
        // Success: Deal deleted successfully!
      } catch (error) {
        console.error('Error deleting deal:', error);
        // Success: Error deleting deal. Please try again.
      }
    }
  };

  const handleDealClick = (deal: PipelineDeal) => {
    setSelectedDeal(deal);
    // Could open a deal detail modal here
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.deals.pipelineTitle)}</h1>
              <p className="text-gray-600">{filteredDeals.length} {t(appContent.deals.pipelineDealsCount)}</p>
            </div>
            <button 
              onClick={handleAddDeal}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t(appContent.deals.pipelineAddDeal)}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">${totalValue.toLocaleString()}</h3>
              <p className="text-gray-600 text-sm">{t(appContent.deals.pipelineTotalValue)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">${Math.round(weightedValue).toLocaleString()}</h3>
              <p className="text-gray-600 text-sm">{t(appContent.deals.pipelineWeightedValue)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{avgProbability}%</h3>
              <p className="text-gray-600 text-sm">{t(appContent.deals.pipelineAvgProbability)}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t(appContent.deals.pipelineSearchPlaceholder)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">{t(appContent.deals.pipelineAllAgents)}</option>
                <option value="Agent agent-1">Agent 1</option>
                <option value="Agent agent-2">Agent 2</option>
                <option value="Agent agent-3">Agent 3</option>
              </select>
              <button
                onClick={() => setSelectedStage(null)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  !selectedStage 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {t(appContent.deals.pipelineAllStages)}
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {stageStats.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all ${
                  selectedStage === stage.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className={`w-4 h-4 ${stage.color} rounded-full mx-auto mb-2`}></div>
                  <div className="font-semibold text-gray-900">{stage.name}</div>
                  <div className="text-sm text-gray-600">{stage.count} deals</div>
                  <div className="text-sm font-medium text-gray-900">${stage.value.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Deals List */}
        <div className="space-y-6">
          {filteredDeals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters, or add a new deal.</p>
              <button 
                onClick={handleAddDeal}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all"
              >
                Add New Deal
              </button>
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full text-white ${getStageColor(deal.stage)}`}>
                        {stages.find(s => s.id === deal.stage)?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {deal.client}
                      </span>
                      <span>Agent: {deal.agent}</span>
                      <span>Property: {deal.property}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${deal.value.toLocaleString()}</div>
                    <div className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
                      {deal.probability}% probability
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Progress
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Probability:</span>
                        <span className={`font-medium ${getProbabilityColor(deal.probability)}`}>{deal.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Value
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deal Value:</span>
                        <span className="font-medium text-gray-900">${deal.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weighted:</span>
                        <span className="font-medium text-gray-900">${Math.round(deal.value * deal.probability / 100).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Activity
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Activity:</span>
                        <span className="font-medium text-gray-900">{deal.lastActivity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Days in Stage:</span>
                        <span className="font-medium text-gray-900">{deal.daysInStage}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {deal.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{deal.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDealClick(deal)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button 
                      onClick={() => handleEditDeal(deal)}
                      className="flex items-center space-x-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <div className="relative">
                      <select
                        onChange={(e) => handleStageChange(deal.id, e.target.value as PipelineDeal['stage'])}
                        value={deal.stage}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors appearance-none pr-8"
                      >
                        <option value="lead">Lead</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="closing">Closing</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                      <ArrowRight className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Deal ID: {deal.id}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Deal</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Title *</label>
                  <input 
                    type="text"
                    value={newDeal.title}
                    onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter deal title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <input 
                    type="text"
                    value={newDeal.client}
                    onChange={(e) => setNewDeal({...newDeal, client: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Client name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
                  <input 
                    type="text"
                    value={newDeal.property}
                    onChange={(e) => setNewDeal({...newDeal, property: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Property address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Value *</label>
                  <input 
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({...newDeal, value: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select 
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({...newDeal, stage: e.target.value as NewDeal['stage']})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="lead">Lead</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closing">Closing</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Close Date</label>
                  <input 
                    type="date"
                    value={newDeal.expectedClose}
                    onChange={(e) => setNewDeal({...newDeal, expectedClose: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Add any notes about this deal..."
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateDeal}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                >
                  Create Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {showEditModal && selectedDeal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Deal</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Title *</label>
                  <input 
                    type="text"
                    value={newDeal.title}
                    onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Value *</label>
                  <input 
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({...newDeal, value: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select 
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({...newDeal, stage: e.target.value as NewDeal['stage']})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="lead">Lead</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closing">Closing</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Close Date</label>
                  <input 
                    type="date"
                    value={newDeal.expectedClose}
                    onChange={(e) => setNewDeal({...newDeal, expectedClose: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateDeal}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                >
                  Update Deal
                </button>
                <button 
                  onClick={() => handleDeleteDeal(selectedDeal.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 