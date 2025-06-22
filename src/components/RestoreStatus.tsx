import React from 'react';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface RestoreStatusProps {
  module: string;
  status: 'restored' | 'restoring' | 'pending';
  onReturnToDashboard?: () => void;
}

export const RestoreStatus: React.FC<RestoreStatusProps> = ({ 
  module, 
  status = 'restoring', 
  onReturnToDashboard 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'restored':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          message: 'Module has been successfully restored and is fully operational.'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          message: 'Module is scheduled for restoration. Please check back later.'
        };
      default: // restoring
        return {
          icon: AlertCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          message: 'This module is being restored gradually for stability.'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CREO ERP System</h1>
          <p className="text-lg text-gray-600">Welcome to your Real Estate Management Platform</p>
        </div>

        {/* Status Card */}
        <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 mb-6`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Module: {module}
          </h2>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`${config.bgColor} p-2 rounded-full`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-700">System: Online</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`${config.bgColor} p-2 rounded-full`}>
              <Clock className={`w-6 h-6 ${config.color}`} />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">Module: Loading</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Current Tab: {module}</p>
            <p className="text-sm text-gray-500">{config.message}</p>
          </div>
        </div>

        {/* Action Button */}
        {onReturnToDashboard && (
          <button
            onClick={onReturnToDashboard}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* System Info */}
        <div className="mt-6 text-xs text-gray-400 space-y-1">
          <p>System Status: Operational</p>
          <p>Last Updated: {new Date().toLocaleString()}</p>
          <p>Version: 1.0.0</p>
        </div>
      </div>
    </div>
  );
};