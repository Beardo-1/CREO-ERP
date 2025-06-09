import React from 'react';
import { Calendar, DollarSign, TrendingUp as TrendingRight } from 'lucide-react';
import { Deal } from '../../types';

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead': return 'bg-gray-100 text-gray-800';
      case 'Qualified': return 'bg-blue-100 text-blue-800';
      case 'Proposal': return 'bg-yellow-100 text-yellow-800';
      case 'Negotiation': return 'bg-orange-100 text-orange-800';
      case 'Contract': return 'bg-purple-100 text-purple-800';
      case 'Closing': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-green-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (stage: string) => {
    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Contract', 'Closing', 'Closed'];
    const index = stages.indexOf(stage);
    return ((index + 1) / stages.length) * 100;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(deal)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {deal.type} Deal
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
            {deal.stage}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ${deal.value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Commission: ${deal.commission.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Deal Progress</span>
          <span>{Math.round(getProgressPercentage(deal.stage))}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage(deal.stage)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>Expected close: {new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <TrendingRight className="w-4 h-4 mr-2 text-gray-400" />
          <span>Created: {new Date(deal.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      {deal.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 line-clamp-2">{deal.notes}</p>
        </div>
      )}
    </div>
  );
}