import React, { useState, useEffect } from 'react';
import {
  Clock,
  DollarSign,
  Calendar,
  User,
  Home,
  FileText,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Filter,
  Search,
  Download,
  Plus,
  Star,
  Shield,
  Target,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';

interface PendingSale {
  id: string;
  propertyId: string;
  propertyAddress: string;
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'commercial';
  salePrice: number;
  listPrice: number;
  buyer: {
    name: string;
    email: string;
    phone: string;
    agent?: string;
  };
  seller: {
    name: string;
    email: string;
    phone: string;
  };
  agent: {
    name: string;
    id: string;
  };
  contractDate: string;
  expectedClosing: string;
  status: 'under-contract' | 'pending-inspection' | 'pending-appraisal' | 'pending-financing' | 'pending-final-walkthrough' | 'ready-to-close';
  daysToClosing: number;
  contingencies: string[];
  documents: {
    contract: boolean;
    inspection: boolean;
    appraisal: boolean;
    financing: boolean;
    insurance: boolean;
    title: boolean;
  };
  notes: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function PendingSales() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('closing-date');
  const [pendingSales, setPendingSales] = useState<PendingSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<PendingSale | null>(null);
  const [newSale, setNewSale] = useState({
    propertyAddress: '',
    propertyType: 'house' as PendingSale['propertyType'],
    salePrice: 0,
    listPrice: 0,
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    agentName: '',
    contractDate: '',
    expectedClosing: '',
    status: 'under-contract' as PendingSale['status'],
    contingencies: [] as string[],
    notes: '',
    riskLevel: 'medium' as PendingSale['riskLevel']
  });

  // Load pending sales on component mount
  useEffect(() => {
    loadPendingSales();
  }, []);

  const loadPendingSales = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from API
      const mockData: PendingSale[] = [
        {
          id: 'PS-001',
          propertyId: 'PROP-001',
          propertyAddress: '123 Oak Street, Downtown',
          propertyType: 'house',
          salePrice: 450000,
          listPrice: 465000,
          buyer: {
            name: 'John & Sarah Miller',
            email: 'john.miller@email.com',
            phone: '(555) 123-4567',
            agent: 'Mike Chen'
          },
          seller: {
            name: 'Robert Johnson',
            email: 'robert.j@email.com',
            phone: '(555) 987-6543'
          },
          agent: {
            name: 'Sarah Johnson',
            id: 'AGT-001'
          },
          contractDate: '2024-01-10',
          expectedClosing: '2024-02-15',
          status: 'pending-inspection',
          daysToClosing: 18,
          contingencies: ['Inspection', 'Financing', 'Appraisal'],
          documents: {
            contract: true,
            inspection: false,
            appraisal: false,
            financing: true,
            insurance: false,
            title: false
          },
          notes: 'Buyer requested additional inspection for HVAC system',
          riskLevel: 'medium'
        },
        {
          id: 'PS-002',
          propertyId: 'PROP-002',
          propertyAddress: '456 Pine Avenue, Suburbs',
          propertyType: 'house',
          salePrice: 750000,
          listPrice: 750000,
          buyer: {
            name: 'David & Lisa Chen',
            email: 'david.chen@email.com',
            phone: '(555) 234-5678'
          },
          seller: {
            name: 'Maria Rodriguez',
            email: 'maria.r@email.com',
            phone: '(555) 876-5432'
          },
          agent: {
            name: 'Mike Chen',
            id: 'AGT-002'
          },
          contractDate: '2024-01-05',
          expectedClosing: '2024-02-10',
          status: 'ready-to-close',
          daysToClosing: 13,
          contingencies: [],
          documents: {
            contract: true,
            inspection: true,
            appraisal: true,
            financing: true,
            insurance: true,
            title: true
          },
          notes: 'All contingencies cleared, ready for closing',
          riskLevel: 'low'
        },
        {
          id: 'PS-003',
          propertyId: 'PROP-003',
          propertyAddress: '789 Elm Street, Arts District',
          propertyType: 'apartment',
          salePrice: 320000,
          listPrice: 335000,
          buyer: {
            name: 'Jennifer Wilson',
            email: 'jennifer.w@email.com',
            phone: '(555) 345-6789'
          },
          seller: {
            name: 'Thomas Anderson',
            email: 'thomas.a@email.com',
            phone: '(555) 765-4321'
          },
          agent: {
            name: 'Emily Davis',
            id: 'AGT-003'
          },
          contractDate: '2024-01-15',
          expectedClosing: '2024-02-20',
          status: 'pending-financing',
          daysToClosing: 23,
          contingencies: ['Financing'],
          documents: {
            contract: true,
            inspection: true,
            appraisal: true,
            financing: false,
            insurance: false,
            title: false
          },
          notes: 'Buyer waiting for final loan approval',
          riskLevel: 'high'
        }
      ];
      setPendingSales(mockData);
    } catch (error) {
      console.error('Error loading pending sales:', error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleAddSale = () => {
    if (newSale.propertyAddress && newSale.salePrice > 0) {
      const saleData: PendingSale = {
        id: `PS-${Date.now()}`,
        propertyId: `PROP-${Date.now()}`,
        propertyAddress: newSale.propertyAddress,
        propertyType: newSale.propertyType,
        salePrice: newSale.salePrice,
        listPrice: newSale.listPrice,
        buyer: {
          name: newSale.buyerName,
          email: newSale.buyerEmail,
          phone: newSale.buyerPhone
        },
        seller: {
          name: newSale.sellerName,
          email: newSale.sellerEmail,
          phone: newSale.sellerPhone
        },
        agent: {
          name: newSale.agentName,
          id: `AGT-${Date.now()}`
        },
        contractDate: newSale.contractDate,
        expectedClosing: newSale.expectedClosing,
        status: newSale.status,
        daysToClosing: Math.ceil((new Date(newSale.expectedClosing).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        contingencies: newSale.contingencies,
        documents: {
          contract: false,
          inspection: false,
          appraisal: false,
          financing: false,
          insurance: false,
          title: false
        },
        notes: newSale.notes,
        riskLevel: newSale.riskLevel
      };

      setPendingSales(prev => [...prev, saleData]);
      
      // Reset form
      setNewSale({
        propertyAddress: '',
        propertyType: 'house',
        salePrice: 0,
        listPrice: 0,
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        sellerName: '',
        sellerEmail: '',
        sellerPhone: '',
        agentName: '',
        contractDate: '',
        expectedClosing: '',
        status: 'under-contract',
        contingencies: [],
        notes: '',
        riskLevel: 'medium'
      });
      setShowAddModal(false);
    }
  };

  const handleEditSale = (sale: PendingSale) => {
    setSelectedSale(sale);
    setNewSale({
      propertyAddress: sale.propertyAddress,
      propertyType: sale.propertyType,
      salePrice: sale.salePrice,
      listPrice: sale.listPrice,
      buyerName: sale.buyer.name,
      buyerEmail: sale.buyer.email,
      buyerPhone: sale.buyer.phone,
      sellerName: sale.seller.name,
      sellerEmail: sale.seller.email,
      sellerPhone: sale.seller.phone,
      agentName: sale.agent.name,
      contractDate: sale.contractDate,
      expectedClosing: sale.expectedClosing,
      status: sale.status,
      contingencies: sale.contingencies,
      notes: sale.notes,
      riskLevel: sale.riskLevel
    });
    setShowEditModal(true);
  };

  const handleUpdateSale = () => {
    if (selectedSale && newSale.propertyAddress && newSale.salePrice > 0) {
      const updatedSale: PendingSale = {
        ...selectedSale,
        propertyAddress: newSale.propertyAddress,
        propertyType: newSale.propertyType,
        salePrice: newSale.salePrice,
        listPrice: newSale.listPrice,
        buyer: {
          name: newSale.buyerName,
          email: newSale.buyerEmail,
          phone: newSale.buyerPhone,
          agent: selectedSale.buyer.agent
        },
        seller: {
          name: newSale.sellerName,
          email: newSale.sellerEmail,
          phone: newSale.sellerPhone
        },
        agent: {
          ...selectedSale.agent,
          name: newSale.agentName
        },
        contractDate: newSale.contractDate,
        expectedClosing: newSale.expectedClosing,
        status: newSale.status,
        daysToClosing: Math.ceil((new Date(newSale.expectedClosing).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        contingencies: newSale.contingencies,
        notes: newSale.notes,
        riskLevel: newSale.riskLevel
      };

      setPendingSales(prev => prev.map(sale => sale.id === selectedSale.id ? updatedSale : sale));
      setShowEditModal(false);
      setSelectedSale(null);
    }
  };

  const handleDeleteSale = (saleId: string) => {
    if (window.confirm('Are you sure you want to delete this pending sale? This action cannot be undone.')) {
      setPendingSales(prev => prev.filter(sale => sale.id !== saleId));
      setShowDetailsModal(false);
      setSelectedSale(null);
    }
  };

  const handleViewDetails = (sale: PendingSale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    const csvData = filteredSales.map(sale => ({
      ID: sale.id,
      'Property Address': sale.propertyAddress,
      'Property Type': sale.propertyType,
      'Sale Price': sale.salePrice,
      'List Price': sale.listPrice,
      'Buyer Name': sale.buyer.name,
      'Seller Name': sale.seller.name,
      'Agent': sale.agent.name,
      'Contract Date': sale.contractDate,
      'Expected Closing': sale.expectedClosing,
      'Status': sale.status,
      'Days to Closing': sale.daysToClosing,
      'Risk Level': sale.riskLevel,
      'Notes': sale.notes
    }));
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-sales-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const addContingency = (contingency: string) => {
    if (contingency.trim() && !newSale.contingencies.includes(contingency.trim())) {
      setNewSale(prev => ({
        ...prev,
        contingencies: [...prev.contingencies, contingency.trim()]
      }));
    }
  };

  const removeContingency = (contingency: string) => {
    setNewSale(prev => ({
      ...prev,
      contingencies: prev.contingencies.filter(c => c !== contingency)
    }));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'under-contract': 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200',
      'pending-inspection': 'bg-gradient-to-r from-yellow-50 to-amber-100 text-amber-700 border border-amber-200',
      'pending-appraisal': 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200',
      'pending-financing': 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200',
      'pending-final-walkthrough': 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border border-indigo-200',
      'ready-to-close': 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200'
    };
    return colors[status as keyof typeof colors] || colors['under-contract'];
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700 border border-emerald-200',
      medium: 'bg-gradient-to-r from-yellow-50 to-amber-100 text-amber-700 border border-amber-200',
      high: 'bg-gradient-to-r from-red-50 to-rose-100 text-rose-700 border border-rose-200'
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  const getPropertyTypeColor = (type: string) => {
    const colors = {
      house: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700',
      apartment: 'bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-700',
      condo: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700',
      townhouse: 'bg-gradient-to-r from-amber-50 to-orange-100 text-orange-700',
      commercial: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
    };
    return colors[type as keyof typeof colors] || colors.house;
  };

  const getDocumentProgress = (documents: PendingSale['documents']) => {
    const total = Object.keys(documents).length;
    const completed = Object.values(documents).filter(Boolean).length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const filteredSales = pendingSales.filter(sale => {
    const matchesSearch = sale.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || sale.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const totalValue = filteredSales.reduce((sum, sale) => sum + sale.salePrice, 0);
  const avgDaysToClose = Math.round(filteredSales.reduce((sum, sale) => sum + sale.daysToClosing, 0) / filteredSales.length);
  const highRiskCount = filteredSales.filter(s => s.riskLevel === 'high').length;

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending sales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {t(appContent.pendingSales.pendingSales)}
              </h1>
              <p className="text-gray-600 text-lg">{filteredSales.length} {t(appContent.pendingSales.propertiesInPipeline)}</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3"
            >
              <Plus className="w-6 h-6" />
              <span>{t(appContent.pendingSales.addPendingSale)}</span>
            </button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.pendingSales.totalValue)}</p>
                  <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.pendingSales.avgDaysToClose)}</p>
                  <p className="text-2xl font-bold text-gray-900">{avgDaysToClose}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.pendingSales.highRisk)}</p>
                  <p className="text-2xl font-bold text-gray-900">{highRiskCount}</p>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-rose-100 p-3 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t(appContent.pendingSales.readyToClose)}</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredSales.filter(s => s.status === 'ready-to-close').length}</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t(appContent.pendingSales.searchPlaceholder)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
            >
              <option value="all">{t(appContent.pendingSales.allStatus)}</option>
              <option value="under-contract">{t(appContent.pendingSales.underContract)}</option>
              <option value="pending-inspection">{t(appContent.pendingSales.pendingInspection)}</option>
              <option value="pending-appraisal">{t(appContent.pendingSales.pendingAppraisal)}</option>
              <option value="pending-financing">{t(appContent.pendingSales.pendingFinancing)}</option>
              <option value="pending-final-walkthrough">{t(appContent.pendingSales.finalWalkthrough)}</option>
              <option value="ready-to-close">{t(appContent.pendingSales.readyToClose)}</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 font-medium"
            >
              <option value="all">{t(appContent.pendingSales.allRiskLevels)}</option>
              <option value="low">{t(appContent.pendingSales.lowRisk)}</option>
              <option value="medium">{t(appContent.pendingSales.mediumRisk)}</option>
              <option value="high">{t(appContent.pendingSales.highRisk)}</option>
            </select>

            <button 
              onClick={handleExport}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>{t(appContent.pendingSales.export)}</span>
            </button>
          </div>
        </div>

        {/* Enhanced Sales Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredSales.map((sale) => {
            const docProgress = getDocumentProgress(sale.documents);
            
            return (
              <div key={sale.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-2 rounded-lg">
                          <Home className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{sale.propertyAddress}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPropertyTypeColor(sale.propertyType)}`}>
                            {sale.propertyType.charAt(0).toUpperCase() + sale.propertyType.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(sale.riskLevel)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {sale.riskLevel.toUpperCase()} {t(appContent.pendingSales.risk)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-gray-600">{t(appContent.pendingSales.salePrice)}</p>
                        <p className="text-xl font-bold text-gray-900">${sale.salePrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t(appContent.pendingSales.daysToClose)}</p>
                        <p className={`text-xl font-bold ${sale.daysToClosing <= 7 ? 'text-red-600' : sale.daysToClosing <= 14 ? 'text-amber-600' : 'text-green-600'}`}>
                          {sale.daysToClosing}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                {/* Document Progress */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{t(appContent.pendingSales.documentProgress)}</h4>
                    <span className="text-sm font-medium text-gray-600">{docProgress.completed}/{docProgress.total} {t(appContent.pendingSales.complete)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${docProgress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(sale.documents).map(([doc, completed]) => (
                      <div key={doc} className={`flex items-center space-x-2 p-2 rounded-lg ${completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                        {completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-xs font-medium ${completed ? 'text-green-700' : 'text-gray-600'}`}>
                          {t(appContent.pendingSales[doc as keyof typeof appContent.pendingSales] || { en: doc.charAt(0).toUpperCase() + doc.slice(1), ar: doc.charAt(0).toUpperCase() + doc.slice(1) })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parties Information */}
                <div className="p-6 border-b border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-xl">
                      <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {t(appContent.pendingSales.buyer)}
                      </h5>
                      <p className="font-medium text-blue-800">{sale.buyer.name}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <a href={`mailto:${sale.buyer.email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Mail className="w-4 h-4" />
                        </a>
                        <a href={`tel:${sale.buyer.phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                      <h5 className="font-semibold text-green-900 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {t(appContent.pendingSales.seller)}
                      </h5>
                      <p className="font-medium text-green-800">{sale.seller.name}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <a href={`mailto:${sale.seller.email}`} className="text-green-600 hover:text-green-800 transition-colors">
                          <Mail className="w-4 h-4" />
                        </a>
                        <a href={`tel:${sale.seller.phone}`} className="text-green-600 hover:text-green-800 transition-colors">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contingencies & Notes */}
                <div className="p-6">
                  {sale.contingencies.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{t(appContent.pendingSales.activeContingencies)}</h5>
                      <div className="flex flex-wrap gap-2">
                        {sale.contingencies.map((contingency, index) => (
                          <span key={index} className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium border border-amber-200">
                            {contingency}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sale.notes && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{t(appContent.pendingSales.notes)}</h5>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{sale.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{t(appContent.pendingSales.expectedClose)}: {new Date(sale.expectedClosing).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(sale)}
                        className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditSale(sale)}
                        className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSale(sale.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(appContent.pendingSales.noPendingSalesFound)}</h3>
              <p className="text-gray-600 mb-6">{t(appContent.pendingSales.noSalesMatchFilters)}</p>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                {t(appContent.pendingSales.clearFilters)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 