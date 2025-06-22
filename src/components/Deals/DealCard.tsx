import React from 'react';
import { DollarSign, Calendar, User, Home, TrendingUp, Clock, Target, CheckCircle } from 'lucide-react';
import { Deal } from '../../types';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  const { t } = useTranslation();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'lead':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qualified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'proposal':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'negotiation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contract':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'closing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sale':
        return 'bg-green-100 text-green-800';
      case 'purchase':
        return 'bg-blue-100 text-blue-800';
      case 'rental':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageProgress = (stage: string) => {
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'contract', 'closing', 'closed'];
    const currentIndex = stages.indexOf(stage.toLowerCase());
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getDaysUntilClose = (expectedCloseDate: string) => {
    const today = new Date();
    const closeDate = new Date(expectedCloseDate);
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilClose = getDaysUntilClose(deal.expectedCloseDate);
  const progressPercentage = getStageProgress(deal.stage);

  return (
    <div 
      className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group animate-fade-in"
      onClick={() => onClick(deal)}
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-amber-50 to-orange-50">
        {/* Stage and Type Badges */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStageColor(deal.stage)}`}>
            {t(appContent.deals[deal.stage.toLowerCase() as keyof typeof appContent.deals] || { en: deal.stage, ar: deal.stage })}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(deal.type)}`}>
            {t(appContent.deals[deal.type.toLowerCase() as keyof typeof appContent.deals] || { en: deal.type, ar: deal.type })}
          </span>
        </div>
        
        {/* Deal Value */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
              {formatCurrency(deal.value)}
            </h3>
            <p className="text-gray-600 text-sm">
              {t(appContent.deals.dealValue)}
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>{t(appContent.stats.progress)}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Deal Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t(appContent.deals.propertyIdLabel)}</p>
              <p className="font-semibold text-gray-900">#{deal.propertyId.slice(-6)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t(appContent.deals.clientIdLabel)}</p>
              <p className="font-semibold text-gray-900">#{deal.clientId.slice(-6)}</p>
            </div>
          </div>
        </div>
        
        {/* Commission Info */}
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-800">{t(appContent.deals.commission)}</span>
            </div>
            <span className="text-lg font-bold text-green-700">
              {formatCurrency(deal.commission)}
            </span>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{t(appContent.deals.expectedCloseDateLabel)}</p>
              <p className="font-semibold text-gray-900">
                {new Date(deal.expectedCloseDate).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              daysUntilClose < 0 ? 'bg-red-100 text-red-800' :
              daysUntilClose <= 7 ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {daysUntilClose < 0 ? t(appContent.deals.overdue) : 
               daysUntilClose === 0 ? t(appContent.deals.today) :
               `${daysUntilClose} ${t(appContent.deals.daysLabel)}`}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{t(appContent.deals.createdLabel)}</p>
              <p className="font-semibold text-gray-900">
                {new Date(deal.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        {deal.paymentMethod && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{t(appContent.deals.paymentMethodLabel)}</span>
              <span className="text-sm text-gray-900 font-semibold">{deal.paymentMethod}</span>
            </div>
          </div>
        )}
        
        {/* Notes Preview */}
        {deal.notes && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 line-clamp-2">
              {deal.notes}
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            {t(appContent.deals.viewDetails)}
          </button>
          <button className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors duration-200">
            <Target className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}