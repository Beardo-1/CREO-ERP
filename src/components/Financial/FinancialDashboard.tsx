import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Calendar, 
  Download, 
  Upload, 
  Eye, 
  Filter, 
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  CreditCard,
  Wallet,
  Building,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Banknote,
  Calculator
} from 'lucide-react';
import { unifiedDataService } from '../../services/unifiedDataService';
import { realDataService, Transaction } from '../../services/realDataService';

interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
  averageTransactionValue: number;
  transactionCount: number;
}

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  color: string;
}

export function FinancialDashboard() {
  // Real data states
  const [deals, setDeals] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    {
      id: '1',
      name: 'Marketing',
      budgeted: 8000,
      spent: 0,
      remaining: 8000,
      percentage: 0,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Office Expenses',
      budgeted: 5000,
      spent: 0,
      remaining: 5000,
      percentage: 0,
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Professional Services',
      budgeted: 3000,
      spent: 0,
      remaining: 3000,
      percentage: 0,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: 'Travel',
      budgeted: 2000,
      spent: 0,
      remaining: 2000,
      percentage: 0,
      color: 'bg-yellow-500'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budget' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('month');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer' as Transaction['paymentMethod'],
    tags: [] as string[]
  });

  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    monthlyGrowth: 0,
    yearlyGrowth: 0,
    averageTransactionValue: 0,
    transactionCount: 0
  });

  // Load real data and transactions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load real data
        const dealsData = await unifiedDataService.getDeals();
        const propertiesData = await unifiedDataService.getProperties();
        const contactsData = await unifiedDataService.getContacts();

        setDeals(dealsData);
        setProperties(propertiesData);
        setContacts(contactsData);

        // Load real transactions
        const realTransactions = realDataService.getTransactions();
        
        // If no transactions exist, generate some from deals data
        if (realTransactions.length === 0) {
          generateInitialTransactions(dealsData);
        } else {
          setTransactions(realTransactions);
        }

        // Calculate metrics
        const currentTransactions = realTransactions.length > 0 ? realTransactions : realDataService.getTransactions();
        const calculatedMetrics = calculateMetrics(currentTransactions);
        setMetrics(calculatedMetrics);

        // Update budget spending based on transactions
        updateBudgetSpending(currentTransactions);
      } catch (error) {
        console.error('Error loading financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    unifiedDataService.subscribe('deals', (data: any) => {
      setDeals(data);
      const generatedTransactions = generateTransactionsFromData(data, properties, contacts);
      setTransactions(generatedTransactions);
      setMetrics(calculateMetrics(generatedTransactions));
      updateBudgetSpending(generatedTransactions);
    });

    unifiedDataService.subscribe('properties', (data: any) => {
      setProperties(data);
    });

    unifiedDataService.subscribe('contacts', (data: any) => {
      setContacts(data);
    });
  }, []);

  // Generate transactions from real data
  const generateTransactionsFromData = (dealsData: any[], propertiesData: any[], contactsData: any[]): Transaction[] => {
    const transactions: Transaction[] = [];

    // Generate income from closed deals
    dealsData
      .filter(deal => deal.stage === 'closed-won')
      .forEach(deal => {
        const commission = parseFloat(deal.value) * 0.05; // 5% commission
        transactions.push({
          id: `deal-${deal.id}`,
          type: 'income',
          category: 'Commission',
          amount: commission,
          description: `Sale commission - ${deal.title}`,
          date: deal.updatedAt || deal.created_at || new Date().toISOString().split('T')[0],
          status: 'completed',
          clientId: deal.clientId,
          propertyId: deal.propertyId,
          invoiceNumber: `INV-${deal.id}`,
          paymentMethod: 'bank_transfer',
          tags: ['Commission', 'Sale', deal.stage]
        });
      });

    // Generate rental income from properties
    propertiesData
      .filter(prop => prop.type === 'Rental' || prop.status === 'Rented')
      .forEach(prop => {
        const monthlyRent = parseFloat(prop.price) * 0.003; // 0.3% of property value as monthly rent
        transactions.push({
          id: `rent-${prop.id}`,
          type: 'income',
          category: 'Rental',
          amount: monthlyRent,
          description: `Monthly rental income - ${prop.title}`,
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
          propertyId: prop.id,
          paymentMethod: 'bank_transfer',
          tags: ['Rental', 'Monthly', prop.type]
        });
      });

    // Generate some operating expenses
    const expenses = [
      { category: 'Marketing', amount: 2500, description: 'Digital advertising campaign' },
      { category: 'Office', amount: 1200, description: 'Office rent and utilities' },
      { category: 'Professional Services', amount: 800, description: 'Legal and accounting services' },
      { category: 'Travel', amount: 450, description: 'Client meeting travel expenses' }
    ];

    expenses.forEach((expense, index) => {
      transactions.push({
        id: `expense-${index + 1}`,
        type: 'expense',
        category: expense.category,
        amount: expense.amount,
        description: expense.description,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'completed',
        paymentMethod: index % 2 === 0 ? 'card' : 'bank_transfer',
        tags: [expense.category]
      });
    });

    return transactions;
  };

  // Calculate financial metrics
  const calculateMetrics = (transactionsData: Transaction[]): FinancialMetrics => {
    const completedTransactions = transactionsData.filter(t => t.status === 'completed');
    
    const totalRevenue = completedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = completedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      monthlyGrowth: 15.2, // Simulated
      yearlyGrowth: 28.5, // Simulated
      averageTransactionValue: completedTransactions.length > 0 ? 
        completedTransactions.reduce((sum, t) => sum + t.amount, 0) / completedTransactions.length : 0,
      transactionCount: completedTransactions.length
    };
  };

  // Update budget spending based on transactions
  const updateBudgetSpending = (transactionsData: Transaction[]) => {
    setBudgetCategories(prev => prev.map(category => {
      const spent = transactionsData
        .filter(t => t.type === 'expense' && t.category === category.name && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const remaining = Math.max(0, category.budgeted - spent);
      const percentage = category.budgeted > 0 ? (spent / category.budgeted) * 100 : 0;
      
      return {
        ...category,
        spent,
        remaining,
        percentage
      };
    }));
  };

  // Add new transaction
  const handleAddTransaction = () => {
    if (newTransaction.category && newTransaction.amount > 0) {
      const transaction: Transaction = {
        id: `custom-${Date.now()}`,
        type: newTransaction.type,
        category: newTransaction.category,
        amount: newTransaction.amount,
        description: newTransaction.description,
        date: newTransaction.date,
        status: 'completed',
        paymentMethod: newTransaction.paymentMethod,
        tags: newTransaction.tags
      };

      const updatedTransactions = [...transactions, transaction];
      setTransactions(updatedTransactions);
      setMetrics(calculateMetrics(updatedTransactions));
      updateBudgetSpending(updatedTransactions);

      // Reset form
      setNewTransaction({
        type: 'income',
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'bank_transfer',
        tags: []
      });

      setShowTransactionModal(false);
      // Success: Transaction added successfully!
    } else {
      // Success: Please fill in all required fields
    }
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      setMetrics(calculateMetrics(updatedTransactions));
      updateBudgetSpending(updatedTransactions);
      // Success: Transaction deleted successfully!
    }
  };

  // Export financial data
  const handleExportData = (format: 'csv' | 'pdf') => {
    const exportData = [
      ['Financial Report'],
      ['Generated on: ' + new Date().toLocaleDateString()],
      [''],
      ['Summary'],
      ['Total Revenue', formatCurrency(metrics.totalRevenue)],
      ['Total Expenses', formatCurrency(metrics.totalExpenses)],
      ['Net Profit', formatCurrency(metrics.netProfit)],
      ['Profit Margin', metrics.profitMargin.toFixed(1) + '%'],
      [''],
      ['Transactions'],
      ['Date', 'Type', 'Category', 'Description', 'Amount', 'Status'],
      ...transactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.description,
        formatCurrency(t.amount),
        t.status
      ]),
      [''],
      ['Budget Summary'],
      ['Category', 'Budgeted', 'Spent', 'Remaining', 'Percentage'],
      ...budgetCategories.map(b => [
        b.name,
        formatCurrency(b.budgeted),
        formatCurrency(b.spent),
        formatCurrency(b.remaining),
        b.percentage.toFixed(1) + '%'
      ])
    ];

    if (format === 'csv') {
      const csvContent = exportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }

    // Success: Financial report exported as ${format.toUpperCase()} successfully!
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
              <p className="text-gray-600">Track revenue, expenses, and financial performance</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTransactionModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
              
              <button
                onClick={() => setShowBudgetModal(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 shadow-lg"
              >
                <Target className="w-4 h-4" />
                <span>Manage Budget</span>
              </button>
              
              <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 shadow-lg">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">+{metrics.monthlyGrowth}%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex items-center space-x-1 text-red-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm font-medium">-8.2%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalExpenses)}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">+{metrics.yearlyGrowth}%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.netProfit)}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Calculator className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-600">Margin</span>
                  <p className="text-lg font-bold text-purple-600">{metrics.profitMargin.toFixed(1)}%</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Profit Margin</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(metrics.profitMargin, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-6">
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'transactions', label: 'Transactions', icon: Receipt },
                { id: 'budget', label: 'Budget', icon: Target },
                { id: 'reports', label: 'Reports', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Revenue vs Expenses Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Revenue vs Expenses</h3>
              <div className="h-64 flex items-end justify-around bg-gradient-to-t from-gray-50 to-transparent rounded-xl p-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                  <div key={month} className="flex flex-col items-center space-y-2">
                    <div className="flex flex-col space-y-1">
                      <div 
                        className="bg-gradient-to-t from-green-500 to-green-400 rounded-t w-8"
                        style={{ height: `${120 + (index * 20)}px` }}
                      ></div>
                      <div 
                        className="bg-gradient-to-t from-red-500 to-red-400 w-8"
                        style={{ height: `${80 + (index * 15)}px` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Budget Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgetCategories.map(category => (
                  <div key={category.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <span className="text-sm text-gray-600">{category.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`${category.color} h-2 rounded-full`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Spent: {formatCurrency(category.spent)}</span>
                      <span>Budget: {formatCurrency(category.budgeted)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map(transaction => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.invoiceNumber && (
                              <p className="text-xs text-gray-500">Invoice: {transaction.invoiceNumber}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={getTypeColor(transaction.type)}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedTransaction(transaction)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add Transaction Modal */}
        {showTransactionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Transaction</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'income' | 'expense'})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Commission, Marketing, Office"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Transaction description..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTransaction}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-all"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}