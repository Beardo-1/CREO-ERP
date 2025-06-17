import React from 'react';
import { Mail, Phone, Star, Award, Home, TrendingUp, Calendar, MapPin, MessageCircle, User } from 'lucide-react';
import { Agent } from '../../types';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'agent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceLevel = (totalSales: number) => {
    if (totalSales >= 1000000) return { level: 'Elite', color: 'from-yellow-400 to-yellow-600', stars: 5 };
    if (totalSales >= 500000) return { level: 'Senior', color: 'from-purple-400 to-purple-600', stars: 4 };
    if (totalSales >= 250000) return { level: 'Professional', color: 'from-blue-400 to-blue-600', stars: 3 };
    if (totalSales >= 100000) return { level: 'Associate', color: 'from-green-400 to-green-600', stars: 2 };
    return { level: 'Junior', color: 'from-gray-400 to-gray-600', stars: 1 };
  };

  const performance = getPerformanceLevel(agent.totalSales);
  const yearsOfExperience = new Date().getFullYear() - new Date(agent.joinDate).getFullYear();

  return (
    <div 
      className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group animate-fade-in"
      onClick={() => onClick(agent)}
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-amber-50 to-orange-50">
        {/* Role Badge */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(agent.role)}`}>
            {agent.role}
          </span>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${performance.color} text-white`}>
            {performance.level}
          </div>
        </div>
        
        {/* Agent Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {agent.profileImage ? (
              <img
                src={agent.profileImage}
                alt={`${agent.firstName} ${agent.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
              </div>
            )}
            
            {/* Performance Stars */}
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
              <div className="flex space-x-0.5">
                {[...Array(performance.stars)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
              {agent.firstName} {agent.lastName}
            </h3>
            <p className="text-gray-600 text-sm">
              License #{agent.licenseNumber}
            </p>
            <p className="text-gray-500 text-xs">
              {yearsOfExperience} years experience
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Sales</p>
              <p className="font-bold text-gray-900">{formatCurrency(agent.totalSales)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Listings</p>
              <p className="font-bold text-gray-900">{agent.activeListings}</p>
            </div>
          </div>
        </div>
        
        {/* Commission Rate */}
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <Award className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-amber-800">Commission Rate</span>
            </div>
            <span className="text-lg font-bold text-amber-700">
              {agent.commission}%
            </span>
          </div>
        </div>
        
        {/* Contact Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900 truncate">{agent.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{agent.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium text-gray-900">
                {new Date(agent.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Sales Target Progress</span>
              <span className="text-xs font-semibold text-gray-900">
                {Math.min(Math.round((agent.totalSales / 1000000) * 100), 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min((agent.totalSales / 1000000) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            View Profile
          </button>
          <button className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors duration-200">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </button>
          <button className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors duration-200">
            <Phone className="w-5 h-5 text-green-600" />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">{agent.activeListings}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {Math.round(agent.totalSales / 1000)}K
              </p>
              <p className="text-xs text-gray-500">Sales</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{performance.stars}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}