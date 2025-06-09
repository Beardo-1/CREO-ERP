import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Users, TrendingUp, Eye, MousePointer, Share2, Calendar, Plus, BarChart3 } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'print';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  leads: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Downtown Luxury Condos',
    type: 'email',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    budget: 5000,
    spent: 3200,
    impressions: 45000,
    clicks: 1200,
    conversions: 45,
    leads: 23
  },
  {
    id: '2',
    name: 'First-Time Buyer Program',
    type: 'social',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    budget: 3000,
    spent: 1800,
    impressions: 32000,
    clicks: 890,
    conversions: 32,
    leads: 18
  },
  {
    id: '3',
    name: 'Holiday Open House',
    type: 'print',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    budget: 2000,
    spent: 2000,
    impressions: 15000,
    clicks: 0,
    conversions: 12,
    leads: 8
  }
];

export function MarketingDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      social: Share2,
      print: Eye
    };
    return icons[type as keyof typeof icons] || Mail;
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leads, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Marketing Dashboard</h3>
          <p className="text-gray-600">Manage campaigns and track performance</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+12%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</h4>
          <p className="text-gray-600">Total Budget</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+8%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</h4>
          <p className="text-gray-600">Total Spent</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+15%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">{totalLeads}</h4>
          <p className="text-gray-600">Total Leads</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+22%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">{totalConversions}</h4>
          <p className="text-gray-600">Conversions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900">Active Campaigns</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {campaigns.map((campaign) => {
                const TypeIcon = getTypeIcon(campaign.type);
                const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks * 100).toFixed(1) : '0';
                const cpl = campaign.leads > 0 ? (campaign.spent / campaign.leads).toFixed(0) : '0';
                
                return (
                  <div
                    key={campaign.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900">{campaign.name}</h5>
                          <p className="text-gray-600 capitalize">{campaign.type} Campaign</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Spent</p>
                        <p className="font-semibold">${campaign.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Leads</p>
                        <p className="font-semibold">{campaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CPL</p>
                        <p className="font-semibold">${cpl}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <span>{campaign.impressions.toLocaleString()} impressions</span>
                        <span>{campaign.clicks.toLocaleString()} clicks</span>
                        <span>{conversionRate}% conversion</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {campaign.startDate} - {campaign.endDate}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Budget Usage</span>
                        <span>{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          {selectedCampaign ? (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  {React.createElement(getTypeIcon(selectedCampaign.type), { className: "w-8 h-8 text-white" })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCampaign.name}</h3>
                  <p className="text-gray-600 capitalize">{selectedCampaign.type} Campaign</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCampaign.status)}`}>
                    {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{selectedCampaign.startDate} - {selectedCampaign.endDate}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-semibold">${selectedCampaign.budget.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-semibold">${selectedCampaign.spent.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{selectedCampaign.impressions.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Impressions</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <MousePointer className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{selectedCampaign.clicks.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Clicks</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{selectedCampaign.conversions}</p>
                  <p className="text-sm text-gray-600">Conversions</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{selectedCampaign.leads}</p>
                  <p className="text-sm text-gray-600">Leads</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all">
                  Edit Campaign
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all">
                  View Analytics
                </button>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all">
                  Duplicate Campaign
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Campaign</h3>
              <p className="text-gray-600">Choose a campaign from the list to view detailed analytics and performance metrics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 