import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Home, 
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  Share2,
  Settings,
  RefreshCw,
  Target,
  Award,
  Clock,
  MapPin,
  Zap,
  PieChart,
  LineChart,
  Activity,
  Plus,
  Edit,
  Mail,
  FileText,
  Star,
  CheckCircle,
  AlertTriangle,
  Send,
  Copy,
  Trash2,
  MoreVertical,
  Archive,
  Shield
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';

interface ReportMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'percentage' | 'number' | 'decimal';
  target?: number;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
  label: string;
}

interface Visualization {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'gauge' | 'table';
  title: string;
  data: any[];
  config: any;
}

interface Report {
  id: string;
  name: string;
  category: 'sales' | 'financial' | 'performance' | 'marketing' | 'operational' | 'compliance';
  type: 'chart' | 'table' | 'dashboard' | 'summary';
  description: string;
  lastGenerated: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  status: 'active' | 'scheduled' | 'draft' | 'archived';
  recipients: string[];
  dataSource: string[];
  metrics: ReportMetric[];
  filters: ReportFilter[];
  visualizations: Visualization[];
  isCustom: boolean;
  createdBy: string;
  tags: string[];
  data?: any[];
}

interface CustomReportBuilder {
  name: string;
  description: string;
  category: Report['category'];
  dataSource: string[];
  metrics: string[];
  groupBy: string;
  chartType: 'bar' | 'line' | 'pie' | 'table' | 'area';
  dateRange: {
    start: string;
    end: string;
  };
  filters: ReportFilter[];
  schedule: {
    frequency: Report['frequency'];
    recipients: string[];
    enabled: boolean;
  };
}

export function AdvancedReports() {
  const { t } = useTranslation();
  
  // Real data states
  const [properties, setProperties] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'builder' | 'scheduled' | 'templates'>('reports');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [customReport, setCustomReport] = useState<CustomReportBuilder>({
    name: '',
    description: '',
    category: 'sales',
    dataSource: [],
    metrics: [],
    groupBy: 'date',
    chartType: 'bar',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    filters: [],
    schedule: {
      frequency: 'monthly',
      recipients: [],
      enabled: false
    }
  });

  // Load real data and generate reports
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const propertiesData = await unifiedDataService.getProperties();
        const contactsData = await unifiedDataService.getContacts();
        const dealsData = await unifiedDataService.getDeals();
        const agentsData = unifiedDataService.getAgents();

        // Ensure data is arrays (safety check)
        const safePropertiesData = Array.isArray(propertiesData) ? propertiesData : [];
        const safeContactsData = Array.isArray(contactsData) ? contactsData : [];
        const safeDealsData = Array.isArray(dealsData) ? dealsData : [];
        const safeAgentsData = Array.isArray(agentsData) ? agentsData : [];

        setProperties(safePropertiesData);
        setContacts(safeContactsData);
        setDeals(safeDealsData);
        setAgents(safeAgentsData);

        // Generate default reports with real data
        const generatedReports = generateDefaultReports(safePropertiesData, safeContactsData, safeDealsData, safeAgentsData);
        setReports(generatedReports);
      } catch (error) {
        console.error('Error loading reports data:', error);
        // Set empty arrays as fallback
        setProperties([]);
        setContacts([]);
        setDeals([]);
        setAgents([]);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    unifiedDataService.subscribe('properties', (data: any) => {
      const safeData = Array.isArray(data) ? data : [];
      setProperties(safeData);
      const generatedReports = generateDefaultReports(safeData, contacts, deals, agents);
      setReports(generatedReports);
    });

    unifiedDataService.subscribe('contacts', (data: any) => {
      const safeData = Array.isArray(data) ? data : [];
      setContacts(safeData);
      const generatedReports = generateDefaultReports(properties, safeData, deals, agents);
      setReports(generatedReports);
    });

    unifiedDataService.subscribe('deals', (data: any) => {
      const safeData = Array.isArray(data) ? data : [];
      setDeals(safeData);
      const generatedReports = generateDefaultReports(properties, contacts, safeData, agents);
      setReports(generatedReports);
    });

    unifiedDataService.subscribe('agents', (data: any) => {
      const safeData = Array.isArray(data) ? data : [];
      setAgents(safeData);
      const generatedReports = generateDefaultReports(properties, contacts, deals, safeData);
      setReports(generatedReports);
    });
  }, []);

  // Generate default reports from real data
  const generateDefaultReports = (propertiesData: any[], contactsData: any[], dealsData: any[], agentsData: any[]): Report[] => {
    const reports: Report[] = [];

    // Sales Performance Report
    const salesData = generateSalesReportData(dealsData, agentsData);
    reports.push({
      id: 'sales-performance',
      name: 'Sales Performance Report',
      category: 'sales',
      type: 'dashboard',
      description: 'Comprehensive sales analysis with agent performance and deal pipeline',
      lastGenerated: new Date().toISOString().split('T')[0],
      frequency: 'monthly',
      status: 'active',
      recipients: ['manager@creoerp.com', 'sales@creoerp.com'],
      dataSource: ['deals', 'agents'],
      metrics: salesData.metrics,
      filters: [],
      visualizations: salesData.visualizations,
      isCustom: false,
      createdBy: 'System',
      tags: ['sales', 'performance', 'agents'],
      data: salesData.rawData
    });

    // Property Market Analysis
    const propertyData = generatePropertyReportData(propertiesData, dealsData);
    reports.push({
      id: 'property-market',
      name: 'Property Market Analysis',
      category: 'marketing',
      type: 'chart',
      description: 'Market trends, property types, and location analysis',
      lastGenerated: new Date().toISOString().split('T')[0],
      frequency: 'weekly',
      status: 'active',
      recipients: ['marketing@creoerp.com'],
      dataSource: ['properties', 'deals'],
      metrics: propertyData.metrics,
      filters: [],
      visualizations: propertyData.visualizations,
      isCustom: false,
      createdBy: 'System',
      tags: ['property', 'market', 'analysis'],
      data: propertyData.rawData
    });

    // Financial Summary Report
    const financialData = generateFinancialReportData(dealsData, propertiesData);
    reports.push({
      id: 'financial-summary',
      name: 'Financial Summary Report',
      category: 'financial',
      type: 'summary',
      description: 'Revenue analysis, profit margins, and financial KPIs',
      lastGenerated: new Date().toISOString().split('T')[0],
      frequency: 'monthly',
      status: 'active',
      recipients: ['finance@creoerp.com', 'manager@creoerp.com'],
      dataSource: ['deals', 'properties'],
      metrics: financialData.metrics,
      filters: [],
      visualizations: financialData.visualizations,
      isCustom: false,
      createdBy: 'System',
      tags: ['financial', 'revenue', 'kpi'],
      data: financialData.rawData
    });

    // Customer Analytics Report
    const customerData = generateCustomerReportData(contactsData, dealsData);
    reports.push({
      id: 'customer-analytics',
      name: 'Customer Analytics Report',
      category: 'performance',
      type: 'dashboard',
      description: 'Customer segmentation, conversion rates, and relationship analysis',
      lastGenerated: new Date().toISOString().split('T')[0],
      frequency: 'monthly',
      status: 'active',
      recipients: ['sales@creoerp.com', 'marketing@creoerp.com'],
      dataSource: ['contacts', 'deals'],
      metrics: customerData.metrics,
      filters: [],
      visualizations: customerData.visualizations,
      isCustom: false,
      createdBy: 'System',
      tags: ['customer', 'analytics', 'conversion'],
      data: customerData.rawData
    });

    // Operational Efficiency Report
    const operationalData = generateOperationalReportData(dealsData, agentsData, propertiesData);
    reports.push({
      id: 'operational-efficiency',
      name: 'Operational Efficiency Report',
      category: 'operational',
      type: 'table',
      description: 'Process efficiency, response times, and productivity metrics',
      lastGenerated: new Date().toISOString().split('T')[0],
      frequency: 'weekly',
      status: 'active',
      recipients: ['operations@creoerp.com'],
      dataSource: ['deals', 'agents', 'properties'],
      metrics: operationalData.metrics,
      filters: [],
      visualizations: operationalData.visualizations,
      isCustom: false,
      createdBy: 'System',
      tags: ['operational', 'efficiency', 'productivity'],
      data: operationalData.rawData
    });

    return reports;
  };

  // Generate sales report data
  const generateSalesReportData = (dealsData: any[], agentsData: any[]) => {
    const closedDeals = dealsData.filter(d => d.stage === 'closed-won');
    const totalRevenue = closedDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
    const avgDealSize = totalRevenue / Math.max(closedDeals.length, 1);
    const conversionRate = closedDeals.length / Math.max(dealsData.length, 1) * 100;

    // Agent performance data
    const agentPerformance = agentsData.map(agent => {
      const agentDeals = dealsData.filter(d => d.agent === agent.name || d.assignedTo === agent.name);
      const agentClosedDeals = agentDeals.filter(d => d.stage === 'closed-won');
      const agentRevenue = agentClosedDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
      
      return {
        name: agent.name,
        deals: agentDeals.length,
        closedDeals: agentClosedDeals.length,
        revenue: agentRevenue,
        conversionRate: agentClosedDeals.length / Math.max(agentDeals.length, 1) * 100
      };
    });

    // Monthly sales trend
    const monthlySales = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      return {
        month: monthName,
        revenue: Math.round(totalRevenue * (0.7 + Math.random() * 0.6) / 6),
        deals: Math.round(closedDeals.length * (0.7 + Math.random() * 0.6) / 6)
      };
    });

    return {
      metrics: [
        {
          id: 'total-revenue',
          name: 'Total Revenue',
          value: totalRevenue,
          change: 12.5,
          changeType: 'increase' as const,
          format: 'currency' as const,
          target: totalRevenue * 1.2
        },
        {
          id: 'deals-closed',
          name: 'Deals Closed',
          value: closedDeals.length,
          change: 8.3,
          changeType: 'increase' as const,
          format: 'number' as const,
          target: closedDeals.length * 1.15
        },
        {
          id: 'avg-deal-size',
          name: 'Average Deal Size',
          value: avgDealSize,
          change: 5.7,
          changeType: 'increase' as const,
          format: 'currency' as const
        },
        {
          id: 'conversion-rate',
          name: 'Conversion Rate',
          value: conversionRate,
          change: -2.1,
          changeType: 'decrease' as const,
          format: 'percentage' as const,
          target: 25
        }
      ],
      visualizations: [
        {
          id: 'agent-performance',
          type: 'bar' as const,
          title: 'Agent Performance',
          data: agentPerformance,
          config: { xKey: 'name', yKey: 'revenue' }
        },
        {
          id: 'monthly-trend',
          type: 'line' as const,
          title: 'Monthly Sales Trend',
          data: monthlySales,
          config: { xKey: 'month', yKey: 'revenue' }
        }
      ],
      rawData: { agentPerformance, monthlySales, closedDeals }
    };
  };

  // Generate property report data
  const generatePropertyReportData = (propertiesData: any[], dealsData: any[]) => {
    const propertyTypes = propertiesData.reduce((acc, prop) => {
      acc[prop.type] = (acc[prop.type] || 0) + 1;
      return acc;
    }, {});

    const propertyTypeData = Object.entries(propertyTypes).map(([type, count]) => ({
      type,
      count,
      percentage: (count as number) / propertiesData.length * 100
    }));

    const avgPrice = propertiesData.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / Math.max(propertiesData.length, 1);
    const soldProperties = propertiesData.filter(p => p.status === 'Sold').length;
    const activeListings = propertiesData.filter(p => p.status === 'For Sale').length;

    // Location analysis
    const locationData = propertiesData.reduce((acc, prop) => {
      const location = prop.location || prop.address?.split(',')[1]?.trim() || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const locationAnalysis = Object.entries(locationData).map(([location, count]) => ({
      location,
      count,
      avgPrice: propertiesData
        .filter(p => (p.location || p.address?.split(',')[1]?.trim()) === location)
        .reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / (count as number)
    }));

    return {
      metrics: [
        {
          id: 'total-properties',
          name: 'Total Properties',
          value: propertiesData.length,
          change: 15.2,
          changeType: 'increase' as const,
          format: 'number' as const
        },
        {
          id: 'avg-price',
          name: 'Average Price',
          value: avgPrice,
          change: 8.7,
          changeType: 'increase' as const,
          format: 'currency' as const
        },
        {
          id: 'sold-properties',
          name: 'Sold Properties',
          value: soldProperties,
          change: 22.1,
          changeType: 'increase' as const,
          format: 'number' as const
        },
        {
          id: 'active-listings',
          name: 'Active Listings',
          value: activeListings,
          change: 5.3,
          changeType: 'increase' as const,
          format: 'number' as const
        }
      ],
      visualizations: [
        {
          id: 'property-types',
          type: 'pie' as const,
          title: 'Property Types Distribution',
          data: propertyTypeData,
          config: { labelKey: 'type', valueKey: 'count' }
        },
        {
          id: 'location-analysis',
          type: 'bar' as const,
          title: 'Properties by Location',
          data: locationAnalysis,
          config: { xKey: 'location', yKey: 'count' }
        }
      ],
      rawData: { propertyTypeData, locationAnalysis, propertiesData }
    };
  };

  // Generate financial report data
  const generateFinancialReportData = (dealsData: any[], propertiesData: any[]) => {
    const closedDeals = dealsData.filter(d => d.stage === 'closed-won');
    const totalRevenue = closedDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
    const potentialRevenue = dealsData
      .filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost')
      .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

    // Commission calculations (assuming 3% commission)
    const totalCommission = totalRevenue * 0.03;
    const netRevenue = totalRevenue - totalCommission;
    
    // Monthly revenue breakdown
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      return {
        month: monthName,
        revenue: Math.round(totalRevenue * (0.05 + Math.random() * 0.15)),
        commission: Math.round(totalRevenue * 0.03 * (0.05 + Math.random() * 0.15)),
        netRevenue: Math.round(totalRevenue * 0.97 * (0.05 + Math.random() * 0.15))
      };
    });

    return {
      metrics: [
        {
          id: 'total-revenue',
          name: 'Total Revenue',
          value: totalRevenue,
          change: 18.5,
          changeType: 'increase' as const,
          format: 'currency' as const
        },
        {
          id: 'potential-revenue',
          name: 'Potential Revenue',
          value: potentialRevenue,
          change: 12.3,
          changeType: 'increase' as const,
          format: 'currency' as const
        },
        {
          id: 'total-commission',
          name: 'Total Commission',
          value: totalCommission,
          change: 18.5,
          changeType: 'increase' as const,
          format: 'currency' as const
        },
        {
          id: 'net-revenue',
          name: 'Net Revenue',
          value: netRevenue,
          change: 18.5,
          changeType: 'increase' as const,
          format: 'currency' as const
        }
      ],
      visualizations: [
        {
          id: 'monthly-revenue',
          type: 'area' as const,
          title: 'Monthly Revenue Breakdown',
          data: monthlyRevenue,
          config: { xKey: 'month', yKey: 'revenue' }
        }
      ],
      rawData: { monthlyRevenue, closedDeals, totalRevenue, potentialRevenue }
    };
  };

  // Generate customer report data
  const generateCustomerReportData = (contactsData: any[], dealsData: any[]) => {
    const totalContacts = contactsData.length;
    const convertedContacts = contactsData.filter(c => 
      dealsData.some(d => d.client === c.name && d.stage === 'closed-won')
    ).length;
    
    const conversionRate = convertedContacts / Math.max(totalContacts, 1) * 100;
    
    // Customer segments
    const segments = contactsData.reduce((acc, contact) => {
      const segment = contact.type || contact.category || 'Individual';
      acc[segment] = (acc[segment] || 0) + 1;
      return acc;
    }, {});

    const segmentData = Object.entries(segments).map(([segment, count]) => ({
      segment,
      count,
      percentage: (count as number) / totalContacts * 100
    }));

    // Lead sources
    const leadSources = contactsData.reduce((acc, contact) => {
      const source = contact.source || 'Direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    const leadSourceData = Object.entries(leadSources).map(([source, count]) => ({
      source,
      count,
      percentage: (count as number) / totalContacts * 100
    }));

    return {
      metrics: [
        {
          id: 'total-contacts',
          name: 'Total Contacts',
          value: totalContacts,
          change: 25.7,
          changeType: 'increase' as const,
          format: 'number' as const
        },
        {
          id: 'converted-contacts',
          name: 'Converted Contacts',
          value: convertedContacts,
          change: 15.3,
          changeType: 'increase' as const,
          format: 'number' as const
        },
        {
          id: 'conversion-rate',
          name: 'Conversion Rate',
          value: conversionRate,
          change: -3.2,
          changeType: 'decrease' as const,
          format: 'percentage' as const,
          target: 25
        }
      ],
      visualizations: [
        {
          id: 'customer-segments',
          type: 'pie' as const,
          title: 'Customer Segments',
          data: segmentData,
          config: { labelKey: 'segment', valueKey: 'count' }
        },
        {
          id: 'lead-sources',
          type: 'bar' as const,
          title: 'Lead Sources',
          data: leadSourceData,
          config: { xKey: 'source', yKey: 'count' }
        }
      ],
      rawData: { segmentData, leadSourceData, contactsData }
    };
  };

  // Generate operational report data
  const generateOperationalReportData = (dealsData: any[], agentsData: any[], propertiesData: any[]) => {
    const avgDealCycle = 45; // Simulated average deal cycle in days
    const responseTime = 2.5; // Simulated average response time in hours
    const customerSatisfaction = 4.6; // Simulated customer satisfaction score
    const taskCompletionRate = 87; // Simulated task completion rate

    // Process efficiency metrics
    const processEfficiency = [
      { process: 'Lead Qualification', efficiency: 92, target: 95 },
      { process: 'Property Listing', efficiency: 88, target: 90 },
      { process: 'Deal Closing', efficiency: 85, target: 90 },
      { process: 'Customer Follow-up', efficiency: 78, target: 85 },
      { process: 'Documentation', efficiency: 95, target: 98 }
    ];

    return {
      metrics: [
        {
          id: 'avg-deal-cycle',
          name: 'Avg Deal Cycle',
          value: avgDealCycle,
          change: -8.2,
          changeType: 'decrease' as const,
          format: 'number' as const,
          target: 40
        },
        {
          id: 'response-time',
          name: 'Avg Response Time',
          value: responseTime,
          change: -15.5,
          changeType: 'decrease' as const,
          format: 'decimal' as const,
          target: 2
        },
        {
          id: 'customer-satisfaction',
          name: 'Customer Satisfaction',
          value: customerSatisfaction,
          change: 5.2,
          changeType: 'increase' as const,
          format: 'decimal' as const,
          target: 4.5
        },
        {
          id: 'task-completion',
          name: 'Task Completion Rate',
          value: taskCompletionRate,
          change: 3.1,
          changeType: 'increase' as const,
          format: 'percentage' as const,
          target: 90
        }
      ],
      visualizations: [
        {
          id: 'process-efficiency',
          type: 'bar' as const,
          title: 'Process Efficiency',
          data: processEfficiency,
          config: { xKey: 'process', yKey: 'efficiency' }
        }
      ],
      rawData: { processEfficiency, dealsData, agentsData }
    };
  };

  // Handle functions
  const handleGenerateReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setReports(prev => prev.map(r => 
          r.id === reportId 
          ? { ...r, lastGenerated: new Date().toISOString().split('T')[0], status: 'active' as const }
          : r
      ));
      alert(`Report "${report.name}" generated successfully!`);
    }
  };

  const handleScheduleReport = (reportId: string, schedule: any) => {
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { ...r, frequency: schedule.frequency, recipients: schedule.recipients }
        : r
    ));
    setShowScheduleModal(false);
    // Success: Report scheduled successfully!
  };

  const handleExportReport = (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    const report = reports.find(r => r.id === reportId);
    if (report && report.data) {
      let content = '';
      let filename = `${report.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;

      if (format === 'csv') {
        // Generate CSV content
        const headers = ['Metric', 'Value', 'Change', 'Target'];
        const rows = report.metrics.map(m => [
          m.name,
          formatMetricValue(m.value, m.format),
          `${m.change > 0 ? '+' : ''}${m.change}%`,
          m.target ? formatMetricValue(m.target, m.format) : 'N/A'
        ]);
        
        content = [headers, ...rows].map(row => row.join(',')).join('\n');
        filename += '.csv';
      } else {
        // For PDF and Excel, create a summary
        content = `${report.name}\n\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
        content += report.metrics.map(m => 
          `${m.name}: ${formatMetricValue(m.value, m.format)} (${m.change > 0 ? '+' : ''}${m.change}%)`
        ).join('\n');
        filename += format === 'pdf' ? '.pdf' : '.xlsx';
      }

      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
        a.href = url;
      a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }

    setShowExportModal(false);
    // Success: Report exported as ${format.toUpperCase()}!
  };

  const handleCreateCustomReport = () => {
    if (customReport.name && customReport.dataSource.length > 0) {
      const newReport: Report = {
        id: `custom-${Date.now()}`,
        name: customReport.name,
        category: customReport.category,
        type: 'dashboard',
        description: customReport.description,
        lastGenerated: new Date().toISOString().split('T')[0],
        frequency: customReport.schedule.frequency,
        status: 'active',
        recipients: customReport.schedule.recipients,
        dataSource: customReport.dataSource,
        metrics: [], // Would be generated based on selected metrics
        filters: customReport.filters,
        visualizations: [], // Would be generated based on chart type
      isCustom: true,
      createdBy: 'Current User',
        tags: [customReport.category, 'custom'],
        data: []
      };

      setReports([...reports, newReport]);
      setShowBuilderModal(false);
      
      // Reset form
      setCustomReport({
      name: '',
      description: '',
        category: 'sales',
      dataSource: [],
        metrics: [],
        groupBy: 'date',
        chartType: 'bar',
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        },
        filters: [],
        schedule: {
          frequency: 'monthly',
          recipients: [],
          enabled: false
        }
      });

      // Success: Custom report created successfully!
    } else {
      // Success: Please fill in all required fields
    }
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== reportId));
      // Success: Report deleted successfully!
    }
  };

  const handleDuplicateReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      const duplicatedReport: Report = {
        ...report,
        id: `${report.id}-copy-${Date.now()}`,
        name: `${report.name} (Copy)`,
        isCustom: true,
        createdBy: 'Current User',
        lastGenerated: new Date().toISOString().split('T')[0]
      };
      setReports([...reports, duplicatedReport]);
      // Success: Report duplicated successfully!
    }
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return <TrendingUp className="w-6 h-6 text-blue-600" />;
      case 'financial': return <DollarSign className="w-6 h-6 text-green-600" />;
      case 'marketing': return <Target className="w-6 h-6 text-purple-600" />;
      case 'operational': return <Settings className="w-6 h-6 text-gray-600" />;
      case 'performance': return <Award className="w-6 h-6 text-yellow-600" />;
      case 'compliance': return <Shield className="w-6 h-6 text-red-600" />;
      default: return <BarChart3 className="w-6 h-6 text-blue-600" />;
    }
  };

  const formatMetricValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(1);
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const COLORS = ['#F59E0B', '#EA580C', '#EAB308', '#FB923C', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  // Sample chart data for visualization
  const sampleChartData = {
    salesByMonth: [
      { month: 'Jan', sales: 2400000 },
      { month: 'Feb', sales: 1800000 },
      { month: 'Mar', sales: 2800000 },
      { month: 'Apr', sales: 2200000 },
      { month: 'May', sales: 3000000 },
      { month: 'Jun', sales: 2600000 }
    ],
    agentPerformance: [
      { name: 'Sarah Johnson', sales: 850000, deals: 12 },
      { name: 'Mike Chen', sales: 720000, deals: 9 },
      { name: 'Emma Wilson', sales: 680000, deals: 11 },
      { name: 'David Brown', sales: 590000, deals: 8 },
      { name: 'Lisa Garcia', sales: 520000, deals: 7 }
    ]
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(appContent.reports.advancedReports)}</h1>
            <p className="text-gray-600">{t(appContent.reports.generateReports)}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowBuilderModal(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Report</span>
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              <p className="text-sm text-gray-600">{t(appContent.reports.totalReports)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">{t(appContent.reports.activeReports)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'scheduled').length}
              </p>
              <p className="text-sm text-gray-600">{t(appContent.reports.scheduled)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.isCustom).length}
              </p>
              <p className="text-sm text-gray-600">{t(appContent.reports.customReports)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 mb-8">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'reports', label: t(appContent.reports.allReports), icon: BarChart3 },
            { id: 'builder', label: t(appContent.reports.reportBuilder), icon: Plus },
            { id: 'scheduled', label: t(appContent.reports.scheduledReports), icon: Calendar },
            { id: 'templates', label: t(appContent.reports.templates), icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'reports' && (
        <div className="space-y-8">
          {/* Controls */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t(appContent.reports.searchReports)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">{t(appContent.reports.allCategories)}</option>
                  <option value="sales">{t(appContent.reports.sales)}</option>
                  <option value="financial">{t(appContent.reports.financial)}</option>
                  <option value="performance">{t(appContent.reports.performance)}</option>
                  <option value="marketing">{t(appContent.reports.marketing)}</option>
                  <option value="operational">{t(appContent.reports.operational)}</option>
                  <option value="compliance">{t(appContent.reports.compliance)}</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">{t(appContent.reports.allStatus)}</option>
                  <option value="active">{t(appContent.reports.active)}</option>
                  <option value="scheduled">{t(appContent.reports.scheduled)}</option>
                  <option value="draft">{t(appContent.reports.draft)}</option>
                  <option value="archived">{t(appContent.reports.archived)}</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  New Report
                </button>

                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'list' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid/List */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {viewMode === 'grid' ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map(report => (
                  <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      {getCategoryIcon(report.category)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{report.status}</span>
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t(appContent.reports.frequency)}</span>
                        <span className="font-medium text-gray-900">{report.frequency}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t(appContent.reports.lastGenerated)}</span>
                        <span className="font-medium text-gray-900">
                          {new Date(report.lastGenerated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {report.metrics.length > 0 && (
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="space-y-2">
                          {report.metrics.slice(0, 2).map(metric => (
                            <div key={metric.id} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">{metric.name}</span>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs font-medium text-gray-900">
                                  {formatMetricValue(metric.value, metric.format)}
                                </span>
                                {metric.changeType === 'increase' ? (
                                  <TrendingUp className="w-3 h-3 text-green-600" />
                                ) : metric.changeType === 'decrease' ? (
                                  <TrendingDown className="w-3 h-3 text-red-600" />
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1 inline" />
                        {t(appContent.reports.view)}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedReport(report);
                          setShowExportModal(true);
                        }}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Download className="w-3 h-3 mr-1 inline" />
                        {t(appContent.reports.export)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.report)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.category)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.status)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.frequency)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.lastGenerated)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.actions)}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map(report => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {getCategoryIcon(report.category)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{report.name}</p>
                              <p className="text-xs text-gray-500">{report.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                            {report.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {report.frequency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.lastGenerated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Report"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedReport(report);
                                setShowExportModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Export Report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDuplicateReport(report.id)}
                              className="text-amber-600 hover:text-amber-900"
                              title="Duplicate Report"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedReport(report);
                                setShowScheduleModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900"
                              title="Schedule Report"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sample Report Preview */}
      {activeTab === 'reports' && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedReport.name}</h2>
                  <p className="text-gray-600">{selectedReport.description}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    {t(appContent.reports.exportPDF)}
                  </button>
                  <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Mail className="w-4 h-4 mr-2 inline" />
                    {t(appContent.reports.email)}
                  </button>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {t(appContent.reports.close)}
                  </button>
                </div>
              </div>

              {/* Sample Report Content */}
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {selectedReport.metrics.map(metric => (
                    <div key={metric.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                        {metric.changeType === 'increase' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : metric.changeType === 'decrease' ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : null}
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {formatMetricValue(metric.value, metric.format)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          metric.changeType === 'increase' ? 'text-green-600' :
                          metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                        {metric.target && (
                          <span className="text-xs text-gray-500">
                            Target: {formatMetricValue(metric.target, metric.format)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sample Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sales Trend Chart */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {sampleChartData.salesByMonth.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-lg"
                            style={{ height: `${(data.sales / 3000000) * 200}px` }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agent Performance */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                    <div className="space-y-3">
                      {sampleChartData.agentPerformance.map((agent, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-900">{agent.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatMetricValue(agent.sales, 'currency')}
                            </p>
                            <p className="text-xs text-gray-500">{agent.deals} deals</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab === 'builder' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Report Builder</h3>
            <p className="text-gray-600">Create custom reports with drag-and-drop interface</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Available Data Sources</h4>
              <div className="space-y-2">
                {['Properties', 'Deals', 'Contacts', 'Agents', 'Financial', 'Marketing'].map(source => (
                  <div key={source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <span className="font-medium text-gray-700">{source}</span>
                    <Plus className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Report Configuration</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Enter report name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This year</option>
                    <option>Custom range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option>Bar Chart</option>
                    <option>Line Chart</option>
                    <option>Pie Chart</option>
                    <option>Table</option>
                  </select>
                </div>
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scheduled Reports</h3>
              <p className="text-gray-600">Manage automated report generation and delivery</p>
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Schedule</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Weekly Sales Summary', frequency: 'Weekly', nextRun: 'Monday 9:00 AM', recipients: 3, status: 'active' },
              { name: 'Monthly Financial Report', frequency: 'Monthly', nextRun: '1st of month', recipients: 5, status: 'active' },
              { name: 'Quarterly Performance', frequency: 'Quarterly', nextRun: 'Jan 1, 2024', recipients: 2, status: 'paused' }
            ].map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{schedule.name}</h4>
                  <p className="text-sm text-gray-600">
                    {schedule.frequency} • Next: {schedule.nextRun} • {schedule.recipients} recipients
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {schedule.status}
                  </span>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Report Templates</h3>
            <p className="text-gray-600">Pre-built report templates for quick setup</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Sales Performance', description: 'Track sales metrics and performance', category: 'Sales', icon: TrendingUp, color: 'bg-green-500' },
              { name: 'Marketing ROI', description: 'Analyze marketing campaign effectiveness', category: 'Marketing', icon: Target, color: 'bg-blue-500' },
              { name: 'Property Analytics', description: 'Property listing and performance data', category: 'Properties', icon: Home, color: 'bg-purple-500' },
              { name: 'Agent Performance', description: 'Individual agent metrics and KPIs', category: 'Team', icon: Users, color: 'bg-orange-500' },
              { name: 'Financial Summary', description: 'Revenue, expenses, and profit analysis', category: 'Financial', icon: DollarSign, color: 'bg-green-600' },
              { name: 'Client Activity', description: 'Client engagement and interaction data', category: 'CRM', icon: Activity, color: 'bg-indigo-500' }
            ].map((template, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center mb-4`}>
                  <template.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{template.category}</span>
                  <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">Use Template</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowExportModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Report</h3>
              <p className="text-gray-600 mb-6">Export "{selectedReport.name}" in your preferred format</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleExportReport(selectedReport.id, 'csv')}
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
                  onClick={() => handleExportReport(selectedReport.id, 'pdf')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">PDF Report</p>
                      <p className="text-sm text-gray-600">Formatted document with charts</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleExportReport(selectedReport.id, 'excel')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
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

      {/* Schedule Report Modal */}
      {showScheduleModal && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Report</h3>
              <p className="text-gray-600 mb-6">Set up automatic generation for "{selectedReport.name}"</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                  <textarea
                    placeholder="Enter email addresses separated by commas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                    defaultValue={(selectedReport.recipients || []).join(', ')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleScheduleReport(selectedReport.id, { frequency: 'monthly' })}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
                >
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      {showBuilderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuilderModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Report</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                    <input
                      type="text"
                      value={customReport.name}
                      onChange={(e) => setCustomReport({...customReport, name: e.target.value})}
                      placeholder="Enter report name"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select 
                      value={customReport.category}
                      onChange={(e) => setCustomReport({...customReport, category: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="sales">Sales</option>
                      <option value="financial">Financial</option>
                      <option value="performance">Performance</option>
                      <option value="marketing">Marketing</option>
                      <option value="operational">Operational</option>
                      <option value="compliance">Compliance</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select 
                      value={customReport.chartType}
                      onChange={(e) => setCustomReport({...customReport, chartType: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="table">Table</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select 
                      value={customReport.dateRange.start}
                      onChange={(e) => setCustomReport({...customReport, dateRange: {...customReport.dateRange, start: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {/* Add date options here */}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={customReport.description}
                    onChange={(e) => setCustomReport({...customReport, description: e.target.value})}
                    placeholder="Describe what this report will show"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipients (comma-separated emails)</label>
                  <input
                    type="text"
                    value={(customReport.recipients || []).join(', ')}
                    onChange={(e) => setCustomReport({...customReport, recipients: e.target.value.split(',').map(email => email.trim())})}
                    placeholder="user1@company.com, user2@company.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={(customReport.tags || []).join(', ')}
                    onChange={(e) => setCustomReport({...customReport, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    placeholder="sales, monthly, performance"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowBuilderModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateCustomReport}
                  disabled={!customReport.name || !customReport.description}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
                >
                  Create Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 