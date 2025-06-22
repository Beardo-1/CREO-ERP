import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Award, MapPin, Calendar, Eye, Zap, BarChart3, Filter, Download, RefreshCw, Plus, Settings, Bell, Brain, Activity, Clock, AlertTriangle, CheckCircle, Search, Globe, Smartphone, Monitor, FileText, Lightbulb, Cpu, Database, Wifi, Shield, Heart } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';

const COLORS = ['#F59E0B', '#EA580C', '#EAB308', '#FB923C', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

interface PredictiveModel {
  id: string;
  name: string;
  type: 'revenue' | 'leads' | 'conversion' | 'market' | 'risk';
  accuracy: number;
  lastTrained: Date;
  predictions: any[];
  confidence: number;
}

interface BusinessInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  category: string;
  data: any;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'sales' | 'marketing' | 'operations' | 'finance';
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  metrics: string[];
}

const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'predictive' | 'realtime' | 'insights' | 'ai'>('overview');
  const [dateRange, setDateRange] = useState('last30Days');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedChart, setSelectedChart] = useState('sales');
  const [alertThresholds, setAlertThresholds] = useState({
    leads: 1000,
    conversionRate: 20,
    revenue: 1500000,
    responseTime: 24,
    customerSatisfaction: 4.0
  });

  // Real-time dashboard metrics
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 156,
    todayLeads: 23,
    todayRevenue: 125000,
    systemHealth: 98.5,
    avgResponseTime: 2.3,
    conversionRate: 24.5,
    customerSatisfaction: 4.7,
    activeDeals: 45,
    pendingTasks: 12,
    upcomingMeetings: 8
  });

  // Advanced analytics states
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModel[]>([]);
  const [businessInsights, setBusinessInsights] = useState<BusinessInsight[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [marketTrends, setMarketTrends] = useState<any>({});
  const [competitorAnalysis, setCompetitorAnalysis] = useState<any>({});
  const [customerSegments, setCustomerSegments] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [anomalyDetection, setAnomalyDetection] = useState<any[]>([]);

  // Real data from dataService
  const [properties, setProperties] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real data and generate analytics
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const propertiesData = await unifiedDataService.getProperties();
        const contactsData = await unifiedDataService.getContacts();
        const dealsData = await unifiedDataService.getDeals();
        const agentsData = unifiedDataService.getAgents();

        // Ensure all data is arrays (safety check)
        const safePropertiesData = Array.isArray(propertiesData) ? propertiesData : [];
        const safeContactsData = Array.isArray(contactsData) ? contactsData : [];
        const safeDealsData = Array.isArray(dealsData) ? dealsData : [];
        const safeAgentsData = Array.isArray(agentsData) ? agentsData : [];

        setProperties(safePropertiesData);
        setContacts(safeContactsData);
        setDeals(safeDealsData);
        setAgents(safeAgentsData);

        // Generate advanced analytics
        generatePredictiveModels(safePropertiesData, safeContactsData, safeDealsData, safeAgentsData);
        generateBusinessInsights(safePropertiesData, safeContactsData, safeDealsData, safeAgentsData);
        generateMarketTrends(safePropertiesData, safeDealsData);
        generateCustomerSegments(safeContactsData, safeDealsData);
        generateForecastData(safeDealsData);
        
        // Update real-time metrics
        updateRealTimeMetrics(safePropertiesData, safeContactsData, safeDealsData, safeAgentsData);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    unifiedDataService.subscribe('properties', (data: any) => {
      const safeData = Array.isArray(data) ? data : [];
      setProperties(safeData);
      generatePredictiveModels(safeData, contacts, deals, agents);
      updateRealTimeMetrics(safeData, contacts, deals, agents);
    });
    unifiedDataService.subscribe('contacts', (data: any) => {
      const safeData = Array.isArray(data) ? data : [];
      setContacts(safeData);
      generateBusinessInsights(properties, safeData, deals, agents);
      updateRealTimeMetrics(properties, safeData, deals, agents);
    });
    unifiedDataService.subscribe('deals', (data: any) => {
      const safeData = Array.isArray(data) ? data : [];
      setDeals(safeData);
      generateForecastData(safeData);
      updateRealTimeMetrics(properties, contacts, safeData, agents);
    });
    unifiedDataService.subscribe('agents', (data: any) => {
      const safeData = Array.isArray(data) ? data : [];
      setAgents(safeData);
      updateRealTimeMetrics(properties, contacts, deals, safeData);
    });

    // Set up real-time updates
    const interval = setInterval(() => {
      updateRealTimeMetrics(properties, contacts, deals, agents);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update real-time metrics
  const updateRealTimeMetrics = (propertiesData: any[], contactsData: any[], dealsData: any[], agentsData: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayDeals = dealsData.filter(d => d.created_at?.startsWith(today) || d.createdAt?.startsWith(today));
    const todayContacts = contactsData.filter(c => c.created_at?.startsWith(today) || c.createdAt?.startsWith(today));
    
    const todayRevenue = todayDeals
      .filter(d => d.stage === 'closed-won')
      .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

    const activeDeals = dealsData.filter(d => 
      d.stage !== 'closed-won' && d.stage !== 'closed-lost'
    ).length;

    const conversionRate = dealsData.filter(d => d.stage === 'closed-won').length / 
                          Math.max(contactsData.length, 1) * 100;

    setRealTimeData(prev => ({
      ...prev,
      activeUsers: 150 + Math.floor(Math.random() * 20),
      todayLeads: todayContacts.length,
      todayRevenue,
      systemHealth: 97 + Math.random() * 3,
      avgResponseTime: 2 + Math.random() * 2,
      conversionRate,
      activeDeals,
      pendingTasks: Math.floor(Math.random() * 20) + 5,
      upcomingMeetings: Math.floor(Math.random() * 15) + 3
    }));
  };

  // Generate predictive models
  const generatePredictiveModels = (propertiesData: any[], contactsData: any[], dealsData: any[], agentsData: any[]) => {
    const totalRevenue = dealsData
      .filter(d => d.stage === 'closed-won')
      .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

    const models: PredictiveModel[] = [
      {
        id: 'revenue-forecast',
        name: 'Revenue Forecasting',
        type: 'revenue',
        accuracy: 87.5,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        confidence: 85.2,
        predictions: Array.from({ length: 6 }, (_, i) => ({
          month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
          predicted: Math.round(totalRevenue * (1.1 + i * 0.05) * (0.8 + Math.random() * 0.4)),
          confidence: 80 + Math.random() * 15,
          range: {
            min: Math.round(totalRevenue * (1.0 + i * 0.03)),
            max: Math.round(totalRevenue * (1.2 + i * 0.07))
          }
        }))
      },
      {
        id: 'lead-scoring',
        name: 'Lead Quality Prediction',
        type: 'leads',
        accuracy: 92.3,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        confidence: 91.7,
        predictions: contactsData.slice(0, 10).map((contact, i) => ({
          contactId: contact.id,
          name: contact.name,
          score: Math.round(70 + Math.random() * 30),
          conversionProbability: Math.round(20 + Math.random() * 60),
          expectedValue: Math.round(50000 + Math.random() * 200000),
          timeToConvert: Math.round(15 + Math.random() * 45)
        }))
      },
      {
        id: 'market-trends',
        name: 'Market Trend Analysis',
        type: 'market',
        accuracy: 78.9,
        lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        confidence: 76.4,
        predictions: [
          { trend: 'Luxury Properties', direction: 'up', strength: 85, impact: 'high' },
          { trend: 'Commercial Real Estate', direction: 'stable', strength: 60, impact: 'medium' },
          { trend: 'Residential Market', direction: 'up', strength: 72, impact: 'high' },
          { trend: 'Rental Market', direction: 'down', strength: 45, impact: 'low' }
        ]
      },
      {
        id: 'risk-assessment',
        name: 'Risk Assessment Model',
        type: 'risk',
        accuracy: 84.1,
        lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        confidence: 82.8,
        predictions: [
          { risk: 'Deal Pipeline Risk', level: 'medium', probability: 35, impact: 'high' },
          { risk: 'Market Volatility', level: 'low', probability: 20, impact: 'medium' },
          { risk: 'Competition Risk', level: 'high', probability: 65, impact: 'high' },
          { risk: 'Economic Downturn', level: 'medium', probability: 40, impact: 'high' }
        ]
      }
    ];

    setPredictiveModels(models);
  };

  // Generate business insights
  const generateBusinessInsights = (propertiesData: any[], contactsData: any[], dealsData: any[], agentsData: any[]) => {
    const insights: BusinessInsight[] = [];

    // Revenue insights
    const totalRevenue = dealsData
      .filter(d => d.stage === 'closed-won')
      .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

    if (totalRevenue > 1000000) {
      insights.push({
        id: 'revenue-milestone',
        type: 'opportunity',
        title: 'Revenue Milestone Achieved',
        description: `Congratulations! You've crossed $${(totalRevenue / 1000000).toFixed(1)}M in revenue. This represents a significant business milestone.`,
        impact: 'high',
        confidence: 95,
        actionable: true,
        category: 'financial',
        data: { revenue: totalRevenue, milestone: 1000000 }
      });
    }

    // Lead conversion insights
    const conversionRate = dealsData.filter(d => d.stage === 'closed-won').length / Math.max(contactsData.length, 1) * 100;
    if (conversionRate > 25) {
      insights.push({
        id: 'high-conversion',
        type: 'opportunity',
        title: 'Excellent Lead Conversion',
        description: `Your conversion rate of ${conversionRate.toFixed(1)}% is significantly above industry average (15-20%). Consider scaling your lead generation efforts.`,
        impact: 'high',
        confidence: 88,
        actionable: true,
        category: 'sales',
        data: { conversionRate, industry: 17.5 }
      });
    } else if (conversionRate < 15) {
      insights.push({
        id: 'low-conversion',
        type: 'risk',
        title: 'Low Conversion Rate Alert',
        description: `Conversion rate of ${conversionRate.toFixed(1)}% is below industry standards. Focus on lead qualification and nurturing processes.`,
        impact: 'high',
        confidence: 92,
        actionable: true,
        category: 'sales',
        data: { conversionRate, target: 20 }
      });
    }

    // Property portfolio insights
    const luxuryProperties = propertiesData.filter(p => p.type === 'Luxury').length;
    const totalProperties = propertiesData.length;
    if (luxuryProperties / totalProperties > 0.3) {
      insights.push({
        type: 'info',
        title: 'Luxury Market Focus',
        description: `${((luxuryProperties / totalProperties) * 100).toFixed(1)}% of your portfolio is luxury properties.`,
        action: 'Expand Luxury Marketing',
        priority: 'medium',
        impact: 'neutral'
      });
    }

    // Deal pipeline insights
    const activeDeals = dealsData.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost');
    const pipelineValue = activeDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
    
    insights.push({
      type: 'info',
      title: 'Pipeline Opportunity',
      description: `$${(pipelineValue / 1000000).toFixed(1)}M in active deals. Focus on closing high-value prospects.`,
      action: 'Review Pipeline',
      priority: 'high',
      impact: 'positive'
    });

    // Market timing insights
    const recentDeals = dealsData.filter(d => {
      const dealDate = new Date(d.createdAt || d.created_at);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return dealDate > thirtyDaysAgo;
    });

    if (recentDeals.length > dealsData.length * 0.4) {
      insights.push({
        type: 'success',
        title: 'Strong Recent Activity',
        description: `${recentDeals.length} deals created in the last 30 days. Market momentum is strong.`,
        action: 'Capitalize on Momentum',
        priority: 'medium',
        impact: 'positive'
      });
    }

    insights.push({
      id: 'market-activity',
      type: 'trend',
      title: 'Market Activity Analysis',
      description: `${deals.length} total deals in pipeline. ${activeDeals.length} currently active.`,
      impact: 'medium',
      confidence: 85,
      actionable: true,
      category: 'market',
      data: { totalDeals: deals.length, activeDeals: activeDeals.length }
    });

    if (contacts.length > 50) {
      insights.push({
        id: 'contact-growth',
        type: 'opportunity',
        title: 'Strong Contact Base',
        description: `${contacts.length} contacts in database. Good foundation for lead generation.`,
        impact: 'high',
        confidence: 90,
        actionable: true,
        category: 'sales',
        data: { totalContacts: contacts.length }
      });
    }



    setBusinessInsights(insights);
  };

  // Generate market trends
  const generateMarketTrends = (propertiesData: any[], dealsData: any[]) => {
    const trends = {
      priceMovement: {
        direction: 'up',
        percentage: 12.5,
        period: 'last 6 months'
      },
      demandIndicators: {
        viewsPerProperty: 245,
        averageTimeOnMarket: 28,
        inquiryRate: 18.5
      },
      competitivePosition: {
        marketShare: 15.8,
        ranking: 3,
        strengthAreas: ['Luxury Properties', 'Customer Service', 'Digital Marketing'],
        improvementAreas: ['Response Time', 'Lead Generation', 'Price Competitiveness']
      },
      seasonalPatterns: {
        peakMonths: ['March', 'April', 'May', 'September', 'October'],
        slowMonths: ['December', 'January', 'February'],
        currentTrend: 'Peak Season'
      }
    };

    setMarketTrends(trends);
  };

  // Generate customer segments
  const generateCustomerSegments = (contactsData: any[], dealsData: any[]) => {
    const segments = [
      {
        name: 'High-Value Investors',
        count: Math.floor(contactsData.length * 0.15),
        avgDealSize: 850000,
        conversionRate: 45,
        characteristics: ['Multiple Properties', 'Quick Decisions', 'Cash Buyers'],
        color: '#10B981'
      },
      {
        name: 'First-Time Buyers',
        count: Math.floor(contactsData.length * 0.35),
        avgDealSize: 320000,
        conversionRate: 28,
        characteristics: ['Need Guidance', 'Price Sensitive', 'Long Decision Process'],
        color: '#3B82F6'
      },
      {
        name: 'Luxury Seekers',
        count: Math.floor(contactsData.length * 0.20),
        avgDealSize: 1200000,
        conversionRate: 35,
        characteristics: ['Premium Features', 'Location Focused', 'Quality Driven'],
        color: '#F59E0B'
      },
      {
        name: 'Investment Groups',
        count: Math.floor(contactsData.length * 0.10),
        avgDealSize: 2500000,
        conversionRate: 55,
        characteristics: ['Portfolio Building', 'ROI Focused', 'Bulk Purchases'],
        color: '#8B5CF6'
      },
      {
        name: 'Relocating Families',
        count: Math.floor(contactsData.length * 0.20),
        avgDealSize: 450000,
        conversionRate: 32,
        characteristics: ['School Districts', 'Family Features', 'Timeline Driven'],
        color: '#EC4899'
      }
    ];

    setCustomerSegments(segments);
  };

  // Generate forecast data
  const generateForecastData = (dealsData: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    const forecastData = months.map((month, index) => {
      const isHistorical = index <= currentMonth;
      const baseRevenue = 200000 + Math.random() * 100000;
      
      if (isHistorical) {
        // Use actual data where available
        const monthDeals = dealsData.filter(d => {
          const dealDate = new Date(d.createdAt || d.created_at);
          return dealDate.getMonth() === index;
        });
        
        const actualRevenue = monthDeals
          .filter(d => d.stage === 'closed-won')
          .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
        
        return {
          month,
          actual: actualRevenue || baseRevenue,
          forecast: null,
          confidence: 100,
          type: 'historical'
        };
      } else {
        // Generate forecast
        const seasonalMultiplier = [0.8, 0.85, 1.2, 1.3, 1.25, 1.1, 0.9, 0.95, 1.15, 1.2, 1.0, 0.75][index];
        const forecast = baseRevenue * seasonalMultiplier * (1 + (index - currentMonth) * 0.05);
        
        return {
          month,
          actual: null,
          forecast: Math.round(forecast),
          confidence: Math.max(60, 95 - (index - currentMonth) * 5),
          type: 'forecast'
        };
      }
    });

    setForecastData(forecastData);
  };

  // Generate analytics data from real data
  const generateAnalyticsData = () => {
    const now = new Date();
    
    // Monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthProperties = properties.filter(p => {
        const createdDate = new Date(p.createdAt || p.created_at);
        return createdDate >= monthStart && createdDate <= monthEnd;
      });
      
      const monthDeals = deals.filter(d => {
        const createdDate = new Date(d.createdAt || d.created_at);
        return createdDate >= monthStart && createdDate <= monthEnd;
      });
      
      const monthContacts = contacts.filter(c => {
        const createdDate = new Date(c.createdAt || c.created_at);
        return createdDate >= monthStart && createdDate <= monthEnd;
      });

      const monthRevenue = monthDeals
        .filter(d => d.stage === 'closed-won')
        .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        sales: monthRevenue,
        leads: monthContacts.length,
        conversions: monthDeals.filter(d => d.stage === 'closed-won').length,
        revenue: monthRevenue,
        properties: monthProperties.length,
        avgDealSize: monthRevenue / Math.max(monthDeals.filter(d => d.stage === 'closed-won').length, 1),
        conversionRate: (monthDeals.filter(d => d.stage === 'closed-won').length / Math.max(monthContacts.length, 1)) * 100
      });
    }

    return monthlyData;
  };

  const salesData = generateAnalyticsData();

  // Agent performance data
  const agentPerformanceData = () => {
    const agents = [...new Set(deals.map(d => d.agent || d.assignedTo || 'Unassigned'))];
    
    return agents.map(agent => {
      const agentDeals = deals.filter(d => (d.agent || d.assignedTo) === agent);
      const agentSales = agentDeals
        .filter(d => d.stage === 'closed-won')
        .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
      
      const agentContacts = contacts.filter(c => c.assignedTo === agent);
      const conversionRate = agentDeals.filter(d => d.stage === 'closed-won').length / Math.max(agentContacts.length, 1) * 100;
      
      return {
        name: agent,
        sales: agentSales,
        deals: agentDeals.filter(d => d.stage === 'closed-won').length,
        leads: agentContacts.length,
        conversionRate,
        avgDealSize: agentSales / Math.max(agentDeals.filter(d => d.stage === 'closed-won').length, 1),
        rating: 4.0 + Math.random() * 1.0,
        commission: agentSales * 0.05,
        responseTime: 1 + Math.random() * 4,
        customerSatisfaction: 4.2 + Math.random() * 0.8
      };
    }).filter(agent => agent.sales > 0);
  };

  // Property type distribution
  const propertyTypeData = () => {
    const types = properties.reduce((acc, prop) => {
      const type = prop.type || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(types).map(([name, count], index) => ({
      name,
      value: Math.round((count as number / properties.length) * 100),
      count: count as number,
      color: COLORS[index % COLORS.length],
      avgPrice: properties
        .filter(p => p.type === name)
        .reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / (count as number)
    }));
  };

  // Lead source data
  const leadSourceData = () => {
    const sources = contacts.reduce((acc, contact) => {
      const source = contact.source || 'Direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(sources).map(([source, leads]) => {
      const conversionRate = 0.15 + Math.random() * 0.25;
      const cost = source === 'Referrals' ? 0 : Math.floor(Math.random() * 20000);
      const conversions = Math.floor((leads as number) * conversionRate);
      
      return {
        source,
        leads: leads as number,
        conversions,
        conversionRate: conversionRate * 100,
        cost,
        roi: cost > 0 ? ((conversions * 50000 - cost) / cost * 100) : 0,
        quality: 70 + Math.random() * 30
      };
    });
  };

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 10 - 5)),
        todayLeads: Math.max(0, prev.todayLeads + Math.floor(Math.random() * 3)),
        todayRevenue: Math.max(0, prev.todayRevenue + Math.floor(Math.random() * 5000)),
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5))),
        avgResponseTime: Math.max(1, prev.avgResponseTime + (Math.random() - 0.5) * 0.2),
        conversionRate: Math.max(15, Math.min(35, prev.conversionRate + (Math.random() - 0.5) * 2)),
        customerSatisfaction: Math.max(4.0, Math.min(5.0, prev.customerSatisfaction + (Math.random() - 0.5) * 0.1)),
        activeDeals: Math.max(30, prev.activeDeals + Math.floor(Math.random() * 3 - 1)),
        pendingTasks: Math.max(5, prev.pendingTasks + Math.floor(Math.random() * 3 - 1)),
        upcomingMeetings: Math.max(3, prev.upcomingMeetings + Math.floor(Math.random() * 2 - 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Export data handler
  const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
    const currentSalesData = salesData;
    const currentAgentData = agentPerformanceData();
    const currentLeadData = leadSourceData();

    let csvContent = '';
    
    if (format === 'csv') {
      // Sales data
      csvContent += 'Sales Data\n';
      csvContent += 'Month,Revenue,Leads,Conversions,Properties\n';
      currentSalesData.forEach(row => {
        csvContent += `${row.month},${row.revenue},${row.leads},${row.conversions},${row.properties}\n`;
      });
      
      csvContent += '\nAgent Performance\n';
      csvContent += 'Agent,Sales,Deals,Conversion Rate,Commission\n';
      currentAgentData.forEach(row => {
        csvContent += `${row.name},${row.sales},${row.deals},${row.conversionRate.toFixed(1)}%,${row.commission}\n`;
      });
      
      csvContent += '\nLead Sources\n';
      csvContent += 'Source,Leads,Conversions,Cost,ROI\n';
      currentLeadData.forEach(row => {
        csvContent += `${row.source},${row.leads},${row.conversions},${row.cost},${row.roi.toFixed(1)}%\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
    // Success: Analytics data exported as ${format.toUpperCase()}!
  };

  // Generate comprehensive report
  const handleGenerateReport = (reportType: 'sales' | 'leads' | 'performance' | 'comprehensive' | 'predictive') => {
    const reportData = {
      type: reportType,
      generatedAt: new Date().toISOString(),
      dateRange,
      metrics: getDashboardMetrics(),
      insights: businessInsights,
      recommendations: generateRecommendations()
    };

        setShowReportModal(false);
    // Success: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!
  };

  // Generate recommendations
  const generateRecommendations = () => {
    const recommendations = [];
    const conversionRate = deals.filter(d => d.stage === 'closed-won').length / Math.max(contacts.length, 1) * 100;
    
    if (conversionRate < 20) {
      recommendations.push({
        category: 'Lead Quality',
        priority: 'High',
        action: 'Implement lead scoring system to improve lead quality',
        impact: 'Could increase conversion rate by 15-25%'
      });
    }

    const avgDealSize = deals
      .filter(d => d.stage === 'closed-won')
      .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0) / Math.max(deals.filter(d => d.stage === 'closed-won').length, 1);

    if (avgDealSize < 500000) {
      recommendations.push({
        category: 'Deal Size',
        priority: 'Medium',
        action: 'Focus on higher-value properties and upselling services',
        impact: 'Could increase average deal size by 20-30%'
      });
    }

    recommendations.push({
      category: 'Market Expansion',
      priority: 'Medium',
      action: 'Consider expanding into adjacent luxury markets',
      impact: 'Potential 40% increase in market reach'
    });

    return recommendations;
  };

  // Refresh data handler
  const handleRefreshData = () => {
    setLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      const propertiesData = unifiedDataService.getProperties();
      const contactsData = unifiedDataService.getContacts();
      const dealsData = unifiedDataService.getDeals();
      
      setProperties(propertiesData);
      setContacts(contactsData);
      setDeals(dealsData);
      
      generatePredictiveAnalytics(propertiesData, contactsData, dealsData);
      generateBusinessInsights(propertiesData, contactsData, dealsData);
      
      setLoading(false);
      // Success: Data refreshed successfully!
    }, 1000);
  };

  // Setup alerts handler
  const handleSetupAlerts = () => {
        setShowAlertModal(false);
    // Success: Alert thresholds updated successfully!
  };

  // Get filtered data based on date range
  const getFilteredData = () => {
    // Implementation for date filtering
    return salesData;
  };

  // Get dashboard metrics
  const getDashboardMetrics = () => {
    const totalRevenue = deals
      .filter(d => d.stage === 'closed-won')
      .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

    const totalLeads = contacts.length;
    const totalDeals = deals.filter(d => d.stage === 'closed-won').length;
    const conversionRate = (totalDeals / Math.max(totalLeads, 1)) * 100;
    const avgDealSize = totalRevenue / Math.max(totalDeals, 1);
    const activeDeals = deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length;
    const pipelineValue = deals
      .filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost')
      .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

    return {
      totalRevenue,
      totalLeads,
      totalDeals,
      conversionRate,
      avgDealSize,
      activeDeals,
      pipelineValue,
      growth: {
        revenue: 15.3,
        leads: 8.7,
        deals: 12.1,
        conversion: 2.4
      }
    };
  };

  const metrics = getDashboardMetrics();

  // Enhanced metric card component
  const MetricCard = ({ title, value, change, icon: Icon, trend, gradient, subtitle, onClick }: any) => (
    <div 
      className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white/90 font-medium text-sm">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-200' : trend === 'down' ? 'text-red-200' : 'text-white/70'}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span className="text-sm font-medium">{change}</span>
          </div>
          <div className="w-16 h-1 bg-white/20 rounded-full mt-2">
            <div 
              className="h-full bg-white/60 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.abs(parseFloat(change) || 0), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Real-time status indicator
  const StatusIndicator = ({ label, value, status, icon: Icon }: any) => (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200">
      <div className={`p-2 rounded-lg ${
        status === 'good' ? 'bg-green-100 text-green-600' :
        status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
        'bg-red-100 text-red-600'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${
        status === 'good' ? 'bg-green-500' :
        status === 'warning' ? 'bg-yellow-500' :
        'bg-red-500'
      }`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.analyticsDashboard.title)}</h1>
              <p className="text-gray-600">{t(appContent.analyticsDashboard.subtitle)}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7Days">Last 7 Days</option>
                <option value="last30Days">Last 30 Days</option>
                <option value="last90Days">Last 90 Days</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              
              <button 
                onClick={() => setShowAlertModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
              >
                <Bell className="w-5 h-5" />
                <span>Alerts</span>
              </button>
              
              <button 
                onClick={handleRefreshData}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
              
              <button 
                onClick={() => setShowExportModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export Data</span>
              </button>
              
              <button 
                onClick={() => setShowReportModal(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Status Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-xl font-bold text-gray-900">{realTimeData.activeUsers}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Leads</p>
                <p className="text-xl font-bold text-gray-900">{realTimeData.todayLeads}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-xl">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(realTimeData.todayRevenue)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-xl">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-xl font-bold text-gray-900">{realTimeData.systemHealth.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.analyticsDashboard.totalLeads)}</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalLeads}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.analyticsDashboard.conversionRate)}</p>
                <p className="text-2xl font-bold text-green-600">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-gray-600 text-sm font-medium">{t(appContent.analyticsDashboard.avgDealValue)}</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.avgDealSize)}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-gray-600 text-sm font-medium">Active Deals</p>
                <p className="text-2xl font-bold text-amber-600">{metrics.activeDeals}</p>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Performance Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.analyticsDashboard.salesPerformance)}</h3>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>{t(appContent.analyticsDashboard.last30Days)}</option>
                  <option>{t(appContent.analyticsDashboard.last90Days)}</option>
                  <option>{t(appContent.analyticsDashboard.lastYear)}</option>
                </select>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">{t(appContent.analyticsDashboard.chartPlaceholder)}</p>
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.analyticsDashboard.leadSources)}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.analyticsDashboard.website)}</p>
                  <p className="text-sm text-gray-600">387 {t(appContent.analyticsDashboard.leads)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">31%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '31%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.analyticsDashboard.referrals)}</p>
                  <p className="text-sm text-gray-600">298 {t(appContent.analyticsDashboard.leads)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">24%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.analyticsDashboard.socialMedia)}</p>
                  <p className="text-sm text-gray-600">234 {t(appContent.analyticsDashboard.leads)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">19%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '19%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.analyticsDashboard.advertising)}</p>
                  <p className="text-sm text-gray-600">189 {t(appContent.analyticsDashboard.leads)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-amber-600">15%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t(appContent.analyticsDashboard.agentPerformance)}</h3>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>{t(appContent.analyticsDashboard.refresh)}</span>
              </button>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>{t(appContent.analyticsDashboard.export)}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.agent)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.totalSales)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.commission)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.conversionRate)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.avgDealSize)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.performance)}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">SJ</span>
                      </div>
                      <span className="font-medium text-gray-900">Sarah Johnson</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">$2.4M</td>
                  <td className="py-3 px-4 font-semibold text-green-600">$72K</td>
                  <td className="py-3 px-4 text-gray-900">28.5%</td>
                  <td className="py-3 px-4 text-gray-900">$485K</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.analyticsDashboard.excellent)}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">MC</span>
                      </div>
                      <span className="font-medium text-gray-900">Mike Chen</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">$1.8M</td>
                  <td className="py-3 px-4 font-semibold text-green-600">$54K</td>
                  <td className="py-3 px-4 text-gray-900">22.1%</td>
                  <td className="py-3 px-4 text-gray-900">$420K</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.analyticsDashboard.good)}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">ED</span>
                      </div>
                      <span className="font-medium text-gray-900">Emily Davis</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">$1.5M</td>
                  <td className="py-3 px-4 font-semibold text-green-600">$45K</td>
                  <td className="py-3 px-4 text-gray-900">19.8%</td>
                  <td className="py-3 px-4 text-gray-900">$375K</td>
                  <td className="py-3 px-4">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.analyticsDashboard.average)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t(appContent.analyticsDashboard.marketTrends)}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">+15.2%</p>
              <p className="text-sm text-gray-600">{t(appContent.analyticsDashboard.priceGrowth)}</p>
              <p className="text-xs text-gray-500 mt-1">{t(appContent.analyticsDashboard.yearOverYear)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">28 {t(appContent.analyticsDashboard.days)}</p>
              <p className="text-sm text-gray-600">{t(appContent.analyticsDashboard.avgTimeOnMarket)}</p>
              <p className="text-xs text-gray-500 mt-1">{t(appContent.analyticsDashboard.thisQuarter)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-sm text-gray-600">{t(appContent.analyticsDashboard.inventoryTurnover)}</p>
              <p className="text-xs text-gray-500 mt-1">{t(appContent.analyticsDashboard.lastMonth)}</p>
            </div>
          </div>
        </div>

        {/* Export Data Modal */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowExportModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Analytics Data</h3>
                <p className="text-gray-600 mb-6">Choose the format for your analytics export</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleExportData('csv')}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Download className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">CSV Format</p>
                        <p className="text-sm text-gray-600">Excel compatible spreadsheet</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleExportData('pdf')}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Download className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">PDF Report</p>
                        <p className="text-sm text-gray-600">Formatted document with charts</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleExportData('excel')}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Download className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Excel Workbook</p>
                        <p className="text-sm text-gray-600">Advanced spreadsheet with formulas</p>
                      </div>
                    </div>
                  </button>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Analytics Report</h3>
                <p className="text-gray-600 mb-6">Select the type of report you want to generate</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleGenerateReport('sales')}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Sales Report</p>
                        <p className="text-sm text-gray-600">Revenue, deals, and performance metrics</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleGenerateReport('leads')}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Lead Analysis</p>
                        <p className="text-sm text-gray-600">Lead sources, conversion rates, and quality</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleGenerateReport('performance')}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Agent Performance</p>
                        <p className="text-sm text-gray-600">Individual and team performance metrics</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleGenerateReport('predictive')}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Brain className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Predictive Analytics</p>
                        <p className="text-sm text-gray-600">Forecasts and trend predictions</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleGenerateReport('comprehensive')}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Comprehensive Report</p>
                        <p className="text-sm text-gray-600">Complete business analytics overview</p>
                      </div>
                    </div>
                  </button>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Modal */}
        {showInsightsModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInsightsModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Insights</h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {businessInsights.map((insight, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-l-4 ${
                        insight.type === 'success' ? 'bg-green-50 border-green-500' :
                        insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        insight.type === 'info' ? 'bg-blue-50 border-blue-500' :
                        'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                          <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            <span className={`px-2 py-1 rounded-full ${
                              insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                              insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {insight.priority} priority
                            </span>
                          </div>
                        </div>
                        <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                          {insight.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowInsightsModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowInsightsModal(false);
                      setShowReportModal(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Setup Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAlertModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Alerts</h3>
                <p className="text-gray-600 mb-6">Configure alert thresholds for key metrics</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lead Threshold</label>
                    <input
                      type="number"
                      value={alertThresholds.leads}
                      onChange={(e) => setAlertThresholds(prev => ({ ...prev, leads: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Rate (%)</label>
                    <input
                      type="number"
                      value={alertThresholds.conversionRate}
                      onChange={(e) => setAlertThresholds(prev => ({ ...prev, conversionRate: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Threshold ($)</label>
                    <input
                      type="number"
                      value={alertThresholds.revenue}
                      onChange={(e) => setAlertThresholds(prev => ({ ...prev, revenue: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Response Time (hours)</label>
                    <input
                      type="number"
                      value={alertThresholds.responseTime}
                      onChange={(e) => setAlertThresholds(prev => ({ ...prev, responseTime: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Satisfaction</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={alertThresholds.customerSatisfaction}
                      onChange={(e) => setAlertThresholds(prev => ({ ...prev, customerSatisfaction: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSetupAlerts}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Save Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Analytics Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'predictive', label: 'Predictive Analytics', icon: Brain },
              { id: 'realtime', label: 'Real-time Data', icon: Activity },
              { id: 'reports', label: 'Advanced Reports', icon: FileText },
              { id: 'insights', label: 'Business Insights', icon: Zap }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(metrics.totalRevenue)}
              change="+15.3%"
              icon={DollarSign}
              trend="up"
              gradient="from-green-500 to-emerald-600"
              subtitle="This quarter"
              onClick={() => setShowReportModal(true)}
            />
            <MetricCard
              title="Active Deals"
              value={metrics.activeDeals.toString()}
              change="+12.1%"
              icon={Target}
              trend="up"
              gradient="from-blue-500 to-indigo-600"
              subtitle={formatCurrency(metrics.pipelineValue) + " in pipeline"}
              onClick={() => setShowReportModal(true)}
            />
            <MetricCard
              title="Conversion Rate"
              value={formatPercentage(metrics.conversionRate)}
              change="+2.4%"
              icon={TrendingUp}
              trend="up"
              gradient="from-purple-500 to-violet-600"
              subtitle="Above industry average"
              onClick={() => setShowInsightsModal(true)}
            />
            <MetricCard
              title="Avg Deal Size"
              value={formatCurrency(metrics.avgDealSize)}
              change="+8.7%"
              icon={Award}
              trend="up"
              gradient="from-amber-500 to-orange-600"
              subtitle="Increasing trend"
              onClick={() => setShowReportModal(true)}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trend */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Property Types */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Portfolio</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypeData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {propertyTypeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictive' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Predictive Analytics</h2>
            </div>
            <p className="text-purple-100 mb-8">AI-powered insights and forecasts based on your business data</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Next Month Forecast</h3>
                <p className="text-2xl font-bold">{formatCurrency(predictiveData.nextMonth?.revenue || 0)}</p>
                <p className="text-sm text-purple-200">{predictiveData.nextMonth?.confidence || 0}% confidence</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Lead Quality Score</h3>
                <p className="text-2xl font-bold">{predictiveData.trends?.leadQuality || 0}%</p>
                <p className="text-sm text-purple-200">Improving</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Market Expansion</h3>
                <p className="text-2xl font-bold">{predictiveData.trends?.marketExpansion || 0}%</p>
                <p className="text-sm text-purple-200">Growth potential</p>
              </div>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Forecast</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  value ? formatCurrency(value as number) : 'N/A', 
                  name === 'actual' ? 'Actual' : 'Forecast'
                ]} />
                <Bar dataKey="actual" fill="#3B82F6" name="actual" />
                <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeDasharray="5 5" name="forecast" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              {predictiveData.riskFactors?.map((risk: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">{risk.factor}</h4>
                    <p className="text-sm text-gray-600">{risk.impact}% potential impact</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    risk.risk === 'High' ? 'bg-red-100 text-red-800' :
                    risk.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.risk} Risk
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'realtime' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Real-time Dashboard</h2>
            </div>
            <p className="text-green-100 mb-8">Live data updates and system monitoring</p>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusIndicator
              label="Active Users"
              value={realTimeData.activeUsers}
              status="good"
              icon={Users}
            />
            <StatusIndicator
              label="System Health"
              value={`${realTimeData.systemHealth.toFixed(1)}%`}
              status={realTimeData.systemHealth > 95 ? 'good' : 'warning'}
              icon={Monitor}
            />
            <StatusIndicator
              label="Response Time"
              value={`${realTimeData.avgResponseTime.toFixed(1)}h`}
              status={realTimeData.avgResponseTime < 3 ? 'good' : 'warning'}
              icon={Clock}
            />
            <StatusIndicator
              label="Customer Satisfaction"
              value={realTimeData.customerSatisfaction.toFixed(1)}
              status={realTimeData.customerSatisfaction > 4.5 ? 'good' : 'warning'}
              icon={CheckCircle}
            />
          </div>

          {/* Live Activity Feed */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Activity Feed</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">New lead: John Smith - Luxury Property Inquiry</span>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Deal closed: $750,000 - Downtown Condo</span>
                <span className="text-xs text-gray-500">5 min ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Property viewed: 15 Oak Street - 3 times today</span>
                <span className="text-xs text-gray-500">8 min ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Meeting scheduled: Client consultation tomorrow</span>
                <span className="text-xs text-gray-500">12 min ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Advanced Reports</h2>
                </div>
                <p className="text-indigo-100">Comprehensive business intelligence and detailed analytics</p>
              </div>
              <button
                onClick={() => setShowReportModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>

          {/* Report Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Sales Performance</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Detailed analysis of sales metrics, revenue trends, and performance indicators</p>
              <button 
                onClick={() => handleGenerateReport('sales')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Generate Sales Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Lead Analysis</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Comprehensive lead source analysis, conversion tracking, and quality assessment</p>
              <button 
                onClick={() => handleGenerateReport('leads')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Generate Lead Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Agent Performance</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Individual and team performance metrics with detailed breakdowns</p>
              <button 
                onClick={() => handleGenerateReport('performance')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Generate Performance Report
              </button>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customerSegments.map((segment, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Count:</span>
                      <span className="font-medium">{segment.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Deal:</span>
                      <span className="font-medium">{formatCurrency(segment.avgDealSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversion:</span>
                      <span className="font-medium">{segment.conversionRate}%</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Key Characteristics:</p>
                    <div className="flex flex-wrap gap-1">
                                             {segment.characteristics.map((char: string, charIndex: number) => (
                        <span 
                          key={charIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Business Insights</h2>
                </div>
                <p className="text-amber-100 mb-8">AI-powered recommendations and actionable insights</p>
              </div>
              <button
                onClick={() => setShowInsightsModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                View All Insights
              </button>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
              {businessInsights.slice(0, 3).map((insight, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-xl border-l-4 ${
                    insight.type === 'success' ? 'bg-green-50 border-green-500' :
                    insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    insight.type === 'info' ? 'bg-blue-50 border-blue-500' :
                    'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                      <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className={`px-2 py-1 rounded-full ${
                          insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                          insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {insight.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'success' ? 'bg-green-100 text-green-600' :
                      insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      insight.type === 'info' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {insight.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                       insight.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                       <Eye className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
              {generateRecommendations().map((rec, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{rec.category}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{rec.action}</p>
                  <p className="text-green-600 text-sm font-medium">{rec.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Trends */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {marketTrends.priceMovement?.direction === 'up' ? '+' : ''}{marketTrends.priceMovement?.percentage}%
                </p>
                <p className="text-sm text-gray-600">Price Movement</p>
                <p className="text-xs text-gray-500 mt-1">{marketTrends.priceMovement?.period}</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{marketTrends.demandIndicators?.viewsPerProperty}</p>
                <p className="text-sm text-gray-600">Views per Property</p>
                <p className="text-xs text-gray-500 mt-1">Average monthly</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">{marketTrends.demandIndicators?.averageTimeOnMarket}</p>
                <p className="text-sm text-gray-600">Days on Market</p>
                <p className="text-xs text-gray-500 mt-1">Average time</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-amber-600">{marketTrends.competitivePosition?.marketShare}%</p>
                <p className="text-sm text-gray-600">Market Share</p>
                <p className="text-xs text-gray-500 mt-1">Local market</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;