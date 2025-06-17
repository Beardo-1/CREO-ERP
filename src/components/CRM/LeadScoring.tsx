import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Star, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  Award, 
  Zap, 
  Filter, 
  Search, 
  Eye, 
  Edit, 
  Plus,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Settings,
  Trash2
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  status: 'new' | 'contacted' | 'qualified' | 'nurturing' | 'converted' | 'lost';
  budget: number;
  timeline: string;
  propertyType: string;
  location: string;
  lastActivity: string;
  assignedTo: string;
  createdDate: string;
  factors: ScoreFactor[];
  activities: LeadActivity[];
}

interface ScoreFactor {
  id: string;
  name: string;
  value: number;
  weight: number;
  score: number;
  category: 'demographic' | 'behavioral' | 'engagement' | 'intent';
}

interface LeadActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  impact: number;
}

interface ScoringRule {
  id: string;
  name: string;
  category: string;
  condition: string;
  points: number;
  weight: number;
  isActive: boolean;
}

export function LeadScoring() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@email.com',
      phone: '(555) 123-4567',
      source: 'Website Form',
      score: 85,
      grade: 'A',
      status: 'qualified',
      budget: 650000,
      timeline: '3-6 months',
      propertyType: 'Single Family',
      location: 'North Chicago',
      lastActivity: '2024-01-20',
      assignedTo: 'Sarah Johnson',
      createdDate: '2024-01-15',
      factors: [
        { id: 'f1', name: 'Budget Range', value: 650000, weight: 25, score: 20, category: 'demographic' },
        { id: 'f2', name: 'Timeline Urgency', value: 6, weight: 20, score: 15, category: 'intent' },
        { id: 'f3', name: 'Email Engagement', value: 80, weight: 15, score: 12, category: 'engagement' },
        { id: 'f4', name: 'Website Activity', value: 90, weight: 20, score: 18, category: 'behavioral' },
        { id: 'f5', name: 'Location Match', value: 100, weight: 20, score: 20, category: 'demographic' }
      ],
      activities: [
        { id: 'a1', type: 'Email Open', description: 'Opened property listing email', date: '2024-01-20', impact: 5 },
        { id: 'a2', type: 'Website Visit', description: 'Viewed 3 property listings', date: '2024-01-19', impact: 10 },
        { id: 'a3', type: 'Form Submit', description: 'Requested property tour', date: '2024-01-18', impact: 15 }
      ]
    },
    {
      id: '2',
      name: 'Robert Chen',
      email: 'robert.chen@email.com',
      phone: '(555) 987-6543',
      source: 'Social Media',
      score: 72,
      grade: 'B',
      status: 'contacted',
      budget: 450000,
      timeline: '6-12 months',
      propertyType: 'Condo',
      location: 'Downtown',
      lastActivity: '2024-01-19',
      assignedTo: 'Mike Wilson',
      createdDate: '2024-01-12',
      factors: [
        { id: 'f6', name: 'Budget Range', value: 450000, weight: 25, score: 15, category: 'demographic' },
        { id: 'f7', name: 'Timeline Urgency', value: 12, weight: 20, score: 10, category: 'intent' },
        { id: 'f8', name: 'Email Engagement', value: 60, weight: 15, score: 9, category: 'engagement' },
        { id: 'f9', name: 'Website Activity', value: 75, weight: 20, score: 15, category: 'behavioral' },
        { id: 'f10', name: 'Location Match', value: 85, weight: 20, score: 17, category: 'demographic' }
      ],
      activities: [
        { id: 'a4', type: 'Phone Call', description: 'Initial qualification call', date: '2024-01-19', impact: 20 },
        { id: 'a5', type: 'Email Click', description: 'Clicked property link', date: '2024-01-17', impact: 8 }
      ]
    }
  ]);

  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
    { id: 'r1', name: 'High Budget (>$500k)', category: 'Budget', condition: 'budget > 500000', points: 20, weight: 25, isActive: true },
    { id: 'r2', name: 'Urgent Timeline (<6 months)', category: 'Timeline', condition: 'timeline < 6', points: 15, weight: 20, isActive: true },
    { id: 'r3', name: 'High Email Engagement (>70%)', category: 'Engagement', condition: 'email_engagement > 70', points: 12, weight: 15, isActive: true },
    { id: 'r4', name: 'Multiple Property Views', category: 'Behavior', condition: 'property_views > 3', points: 10, weight: 20, isActive: true },
    { id: 'r5', name: 'Preferred Location Match', category: 'Demographics', condition: 'location_match = true', points: 18, weight: 20, isActive: true }
  ]);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'leads' | 'rules' | 'analytics'>('leads');

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'nurturing': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || lead.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const leadStats = {
    total: leads.length,
    gradeA: leads.filter(l => l.grade === 'A').length,
    gradeB: leads.filter(l => l.grade === 'B').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    avgScore: Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lead Scoring</h1>
        <p className="text-gray-600">Automated lead qualification and scoring system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{leadStats.total}</p>
              <p className="text-sm text-gray-600">Total Leads</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{leadStats.gradeA}</p>
              <p className="text-sm text-gray-600">Grade A</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{leadStats.qualified}</p>
              <p className="text-sm text-gray-600">Qualified</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{leadStats.avgScore}</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{leadStats.gradeB}</p>
              <p className="text-sm text-gray-600">Grade B</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex border border-gray-300 rounded-xl overflow-hidden">
            {[
              { id: 'leads', label: 'Scored Leads', icon: Target },
              { id: 'rules', label: 'Scoring Rules', icon: Settings },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    viewMode === tab.id 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {viewMode === 'leads' && (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Grades</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="D">Grade D</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="nurturing">Nurturing</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'leads' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredLeads.map(lead => (
              <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(lead.grade)}`}>
                        Grade {lead.grade}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Lead Score</p>
                        <div className="flex items-center space-x-2">
                          <p className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</p>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-medium text-gray-900">${lead.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Timeline</p>
                        <p className="font-medium text-gray-900">{lead.timeline}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Property Type</p>
                        <p className="font-medium text-gray-900">{lead.propertyType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{lead.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Assigned to {lead.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Last activity {new Date(lead.lastActivity).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'rules' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Scoring Rules</h3>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Rule
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {scoringRules.map(rule => (
              <div key={rule.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium text-gray-900">{rule.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Condition</p>
                        <p className="font-medium text-gray-900 font-mono text-xs">{rule.condition}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Points</p>
                        <p className="font-medium text-gray-900">{rule.points}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="font-medium text-gray-900">{rule.weight}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Lead Scoring Analytics</h3>
          <p className="text-gray-600">Detailed analytics and performance metrics coming soon</p>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h2>
                  <p className="text-gray-600">Lead Score: {selectedLead.score}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Score Breakdown */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Score Breakdown</h4>
                <div className="space-y-3">
                  {selectedLead.factors.map(factor => (
                    <div key={factor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{factor.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{factor.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{factor.score} pts</p>
                        <p className="text-sm text-gray-600">Weight: {factor.weight}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Activities</h4>
                <div className="space-y-3">
                  {selectedLead.activities.map(activity => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">+{activity.impact} pts</p>
                        <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 