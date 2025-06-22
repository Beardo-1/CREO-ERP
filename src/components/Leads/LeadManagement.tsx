import React, { useState } from 'react';
import { Phone, Mail, Calendar, MapPin, Star, Plus, Filter, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high';
  budget: string;
  location: string;
  propertyType: string;
  notes: string;
  assignedAgent: string;
  createdAt: string;
  lastContact: string;
}



export function LeadManagement() {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{t(appContent.leads.leadMgmtTitle)}</h3>
          <p className="text-gray-600">{filteredLeads.length} {t(appContent.leads.leadMgmtFound)}</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t(appContent.leads.searchLeads)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
          >
            <option value="all">{t(appContent.leads.leadMgmtAllStatus)}</option>
            <option value="new">{t(appContent.leads.leadMgmtNew)}</option>
            <option value="contacted">{t(appContent.leads.leadMgmtContacted)}</option>
            <option value="qualified">{t(appContent.leads.leadMgmtQualified)}</option>
            <option value="converted">{t(appContent.leads.leadMgmtConverted)}</option>
            <option value="lost">{t(appContent.leads.leadMgmtLost)}</option>
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{t(appContent.leads.addLead)}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {(lead.name || '').split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{lead.name}</h4>
                    <p className="text-gray-600">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                  <Star className={`w-5 h-5 ${getPriorityColor(lead.priority)}`} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{lead.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{lead.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t(appContent.leads.leadMgmtBudget)}: <span className="font-semibold">{lead.budget}</span></p>
                  <p className="text-sm text-gray-600">{t(appContent.leads.leadMgmtType)}: <span className="font-semibold">{lead.propertyType}</span></p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Details Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          {selectedLead ? (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {(selectedLead.name || '').split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedLead.name}</h3>
                  <p className="text-gray-600">{selectedLead.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.leads.leadMgmtStatus)}:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.leads.leadMgmtPriority)}:</span>
                  <Star className={`w-5 h-5 ${getPriorityColor(selectedLead.priority)}`} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.leads.leadMgmtPhone)}:</span>
                  <span className="font-semibold">{selectedLead.phone}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.leads.leadMgmtBudget)}:</span>
                  <span className="font-semibold">{selectedLead.budget}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.leads.leadMgmtLocation)}:</span>
                  <span className="font-semibold">{selectedLead.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.leads.leadMgmtPropertyType)}:</span>
                  <span className="font-semibold">{selectedLead.propertyType}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.leads.leadMgmtSource)}:</span>
                  <span className="font-semibold">{selectedLead.source}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t(appContent.leads.leadMgmtAgent)}:</span>
                  <span className="font-semibold">{selectedLead.assignedAgent}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{t(appContent.leads.leadMgmtNotes)}</h4>
                <p className="text-gray-600 text-sm">{selectedLead.notes}</p>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>{t(appContent.leads.leadMgmtCall)}</span>
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>{t(appContent.leads.leadMgmtEmail)}</span>
                </button>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{t(appContent.leads.leadMgmtMeeting)}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(appContent.leads.leadMgmtSelect)}</h3>
              <p className="text-gray-600">{t(appContent.leads.leadMgmtSelectMsg)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 