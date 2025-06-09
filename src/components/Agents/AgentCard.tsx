import React from 'react';
import { Mail, Phone, Award, TrendingUp, Building } from 'lucide-react';
import { Agent } from '../../types';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-purple-100 text-purple-800';
      case 'Agent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(agent)}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500">
          {agent.profileImage ? (
            <img src={agent.profileImage} alt={`${agent.firstName} ${agent.lastName}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
              {agent.firstName[0]}{agent.lastName[0]}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
            {agent.firstName} {agent.lastName}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(agent.role)}`}>
            {agent.role}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-3 text-gray-400" />
          <span className="text-sm">{agent.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-3 text-gray-400" />
          <span className="text-sm">{agent.phone}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Award className="w-4 h-4 mr-3 text-gray-400" />
          <span className="text-sm">License: {agent.licenseNumber}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${(agent.totalSales / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-600">Total Sales</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{agent.activeListings}</div>
          <div className="text-xs text-gray-600">Active Listings</div>
        </div>
      </div>
      
      <div className="bg-amber-50 rounded-2xl p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-amber-800">${agent.commission.toLocaleString()}</div>
          <div className="text-xs text-amber-600">Commission Earned</div>
        </div>
      </div>
    </div>
  );
}