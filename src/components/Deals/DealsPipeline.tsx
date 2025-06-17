import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  User,
  Calendar,
  Eye,
  Edit,
  ArrowRight,
  Plus,
  Filter,
  Search,
  BarChart3,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface Deal {
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

export default function DealsPipeline() {
  const { t } = useTranslation();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');

  const stages = [
    { id: 'lead', name: t(appContent.deals.pipelineLead), color: 'bg-gray-500' },
    { id: 'qualified', name: t(appContent.deals.pipelineQualified), color: 'bg-blue-500' },
    { id: 'proposal', name: t(appContent.deals.pipelineProposal), color: 'bg-yellow-500' },
    { id: 'negotiation', name: t(appContent.deals.pipelineNegotiation), color: 'bg-orange-500' },
    { id: 'closing', name: t(appContent.deals.pipelineClosing), color: 'bg-purple-500' },
    { id: 'won', name: t(appContent.deals.pipelineWon), color: 'bg-green-500' },
    { id: 'lost', name: t(appContent.deals.pipelineLost), color: 'bg-red-500' }
  ];

  const deals: Deal[] = [
    {
      id: 'DEAL-001',
      title: 'Downtown Condo Sale',
      client: 'John & Sarah Miller',
      value: 450000,
      stage: 'negotiation',
      probability: 75,
      expectedClose: '2024-02-15',
      daysInStage: 5,
      agent: 'Sarah Johnson',
      property: '123 Oak Street',
      lastActivity: '2024-01-28',
      notes: 'Buyer interested but negotiating on price'
    },
    {
      id: 'DEAL-002',
      title: 'Luxury Home Purchase',
      client: 'David Chen',
      value: 750000,
      stage: 'closing',
      probability: 90,
      expectedClose: '2024-02-10',
      daysInStage: 12,
      agent: 'Mike Chen',
      property: '456 Pine Avenue',
      lastActivity: '2024-01-27',
      notes: 'All contingencies cleared, waiting for final paperwork'
    },
    {
      id: 'DEAL-003',
      title: 'Investment Property',
      client: 'Jennifer Wilson',
      value: 320000,
      stage: 'proposal',
      probability: 60,
      expectedClose: '2024-02-20',
      daysInStage: 8,
      agent: 'Emily Davis',
      property: '789 Elm Street',
      lastActivity: '2024-01-26',
      notes: 'Preparing offer for investment property'
    },
    {
      id: 'DEAL-004',
      title: 'First Time Buyer',
      client: 'Maria Rodriguez',
      value: 380000,
      stage: 'qualified',
      probability: 50,
      expectedClose: '2024-03-01',
      daysInStage: 3,
      agent: 'Sarah Johnson',
      property: '321 Maple Drive',
      lastActivity: '2024-01-25',
      notes: 'Pre-approved and actively looking'
    },
    {
      id: 'DEAL-005',
      title: 'Corporate Relocation',
      client: 'Tech Corp Employee',
      value: 520000,
      stage: 'lead',
      probability: 30,
      expectedClose: '2024-03-15',
      daysInStage: 2,
      agent: 'Mike Chen',
      property: 'TBD',
      lastActivity: '2024-01-28',
      notes: 'Initial inquiry from corporate relocation'
    }
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
  const avgProbability = Math.round(filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / filteredDeals.length);
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
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{t(appContent.deals.pipelineAddDeal)}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.pipelineTotalPipeline)}</p>
                  <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.pipelineWeightedValue)}</p>
                  <p className="text-2xl font-bold text-gray-900">${Math.round(weightedValue).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.pipelineAvgProbability)}</p>
                  <p className={`text-2xl font-bold ${getProbabilityColor(avgProbability)}`}>{avgProbability}%</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.deals.pipelineActiveDeals)}</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredDeals.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
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
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Mike Chen">Mike Chen</option>
                <option value="Emily Davis">Emily Davis</option>
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
                  <div className="text-sm text-gray-600">{stage.count} {t('deals.pipelineDeals')}</div>
                  <div className="text-sm font-medium text-gray-900">${stage.value.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Deals List */}
        <div className="space-y-6">
          {filteredDeals.map((deal) => (
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
                    <span>{t('deals.pipelineAgent')}: {deal.agent}</span>
                    <span>{t('deals.pipelineProperty')}: {deal.property}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${deal.value.toLocaleString()}</div>
                  <div className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
                    {deal.probability}% {t('deals.pipelineProbability')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('deals.pipelineTimeline')}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('deals.pipelineExpectedClose')}:</span>
                      <span className="font-medium text-gray-900">{deal.expectedClose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('deals.pipelineDaysInStage')}:</span>
                      <span className="font-medium text-gray-900">{deal.daysInStage} {t('deals.pipelineDays')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t('deals.pipelineProgress')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('deals.pipelineProbability')}:</span>
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
                    {t('deals.pipelineValue')}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('deals.pipelineDealValue')}:</span>
                      <span className="font-medium text-gray-900">${deal.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('deals.pipelineWeighted')}:</span>
                      <span className="font-medium text-gray-900">${Math.round(deal.value * deal.probability / 100).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {t('deals.pipelineActivity')}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('deals.pipelineLastActivity')}:</span>
                      <span className="font-medium text-gray-900">{deal.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {deal.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t('deals.pipelineNotes')}</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{deal.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>{t('deals.pipelineView')}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm font-medium transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>{t('deals.pipelineEdit')}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors">
                    <ArrowRight className="w-4 h-4" />
                    <span>{t('deals.pipelineMoveStage')}</span>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {t('deals.pipelineDealID')}: {deal.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 