import { unifiedDataService } from './unifiedDataService';
import { Property, Contact, Deal, Agent, Task } from '../types';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'website' | 'referral' | 'social' | 'advertising' | 'cold-call' | 'walk-in';
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  score: number;
  interest: 'buying' | 'selling' | 'renting' | 'investing';
  budget: { min: number; max: number };
  location: string;
  propertyType: string[];
  notes: string;
  createdDate: Date;
  lastContact: Date;
  nextFollowUp: Date;
  agent: { id: string; name: string };
  tags: string[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'other';
  status: 'pending' | 'completed' | 'cancelled';
  tags: string[];
  dealId?: string;
  propertyId?: string;
  contactId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  module: string;
  subModule?: string;
  dataSource: string;
  formula: string;
  visualType: 'card' | 'number' | 'trend' | 'progress-bar' | 'gauge' | 'line-chart' | 'bar-chart' | 'pie-chart' | 'donut-chart';
  target?: number;
  targetType?: 'greater' | 'less' | 'equal';
  refreshRate: number;
  currentValue?: number;
  previousValue?: number;
  trend?: 'up' | 'down' | 'neutral';
  unit: string;
  color: string;
  isActive: boolean;
  position: { row: number; col: number; order: number };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'content' | 'sms';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  description: string;
  channels: string[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    leads: number;
    ctr: number;
    cpc: number;
    cpl: number;
    roi: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

class RealDataService {
  private static instance: RealDataService;

  private constructor() {}

  public static getInstance(): RealDataService {
    if (!RealDataService.instance) {
      RealDataService.instance = new RealDataService();
    }
    return RealDataService.instance;
  }

  // ============= LEADS MANAGEMENT =============
  
  public getLeads(): Lead[] {
    const stored = localStorage.getItem('creo_leads');
    return stored ? JSON.parse(stored) : [];
  }

  public setLeads(leads: Lead[]): void {
    localStorage.setItem('creo_leads', JSON.stringify(leads));
  }

  public addLead(lead: Omit<Lead, 'id' | 'createdDate'>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdDate: new Date()
    };
    leads.push(newLead);
    this.setLeads(leads);
    return newLead;
  }

  public updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const leads = this.getLeads();
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    leads[index] = { ...leads[index], ...updates };
    this.setLeads(leads);
    return leads[index];
  }

  public deleteLead(id: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter(l => l.id !== id);
    if (filtered.length === leads.length) return false;
    
    this.setLeads(filtered);
    return true;
  }

  public getLeadsByStatus(status: Lead['status']): Lead[] {
    return this.getLeads().filter(lead => lead.status === status);
  }

  public getLeadsByAgent(agentId: string): Lead[] {
    return this.getLeads().filter(lead => lead.agent.id === agentId);
  }

  public convertLeadToDeal(leadId: string, dealData: Partial<Deal>): Deal | null {
    const lead = this.getLeads().find(l => l.id === leadId);
    if (!lead) return null;

    // Update lead status
    this.updateLead(leadId, { status: 'converted' });

    // Create new deal from lead
    const newDeal: Deal = {
      id: `deal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Deal for ${lead.name}`,
      value: dealData.value || lead.budget.max || 0,
      stage: 'qualification',
      probability: 25,
      expectedCloseDate: dealData.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      contactId: lead.id,
      contactName: lead.name,
      contactEmail: lead.email,
      contactPhone: lead.phone,
      agentId: lead.agent.id,
      agentName: lead.agent.name,
      propertyId: dealData.propertyId || '',
      propertyAddress: dealData.propertyAddress || '',
      notes: `Converted from lead: ${lead.notes}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...dealData
    };

    // Add to deals using unified service
    unifiedDataService.addDeal(newDeal);
    return newDeal;
  }

  // ============= TRANSACTIONS MANAGEMENT =============
  
  public getTransactions(): Transaction[] {
    const stored = localStorage.getItem('creo_transactions');
    return stored ? JSON.parse(stored) : [];
  }

  public setTransactions(transactions: Transaction[]): void {
    localStorage.setItem('creo_transactions', JSON.stringify(transactions));
  }

  public addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    this.setTransactions(transactions);
    return newTransaction;
  }

  public updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    transactions[index] = { 
      ...transactions[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.setTransactions(transactions);
    return transactions[index];
  }

  public deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    if (filtered.length === transactions.length) return false;
    
    this.setTransactions(filtered);
    return true;
  }

  public getTransactionsByType(type: 'income' | 'expense'): Transaction[] {
    return this.getTransactions().filter(t => t.type === type);
  }

  public getTransactionsByDateRange(startDate: string, endDate: string): Transaction[] {
    return this.getTransactions().filter(t => 
      t.date >= startDate && t.date <= endDate
    );
  }

  public getTotalRevenue(startDate?: string, endDate?: string): number {
    let transactions = this.getTransactionsByType('income');
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => 
        t.date >= startDate && t.date <= endDate
      );
    }
    
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  public getTotalExpenses(startDate?: string, endDate?: string): number {
    let transactions = this.getTransactionsByType('expense');
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => 
        t.date >= startDate && t.date <= endDate
      );
    }
    
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  // ============= KPI MANAGEMENT =============
  
  public getKPIs(): KPI[] {
    const stored = localStorage.getItem('creo_kpis');
    return stored ? JSON.parse(stored) : [];
  }

  public setKPIs(kpis: KPI[]): void {
    localStorage.setItem('creo_kpis', JSON.stringify(kpis));
  }

  public addKPI(kpi: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>): KPI {
    const kpis = this.getKPIs();
    const newKPI: KPI = {
      ...kpi,
      id: `kpi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    kpis.push(newKPI);
    this.setKPIs(kpis);
    return newKPI;
  }

  public updateKPI(id: string, updates: Partial<KPI>): KPI | null {
    const kpis = this.getKPIs();
    const index = kpis.findIndex(k => k.id === id);
    if (index === -1) return null;
    
    kpis[index] = { 
      ...kpis[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.setKPIs(kpis);
    return kpis[index];
  }

  public deleteKPI(id: string): boolean {
    const kpis = this.getKPIs();
    const filtered = kpis.filter(k => k.id !== id);
    if (filtered.length === kpis.length) return false;
    
    this.setKPIs(filtered);
    return true;
  }

  public getKPIsByModule(module: string, subModule?: string): KPI[] {
    return this.getKPIs().filter(kpi => 
      kpi.module === module && 
      (subModule ? kpi.subModule === subModule : !kpi.subModule) &&
      kpi.isActive
    );
  }

  public calculateKPIValue(kpi: KPI): number {
    // Real-time KPI calculation based on actual data
    const properties = unifiedDataService.getProperties();
    const contacts = unifiedDataService.getContacts();
    const deals = unifiedDataService.getDeals();
    const transactions = this.getTransactions();

    switch (kpi.dataSource) {
      case 'properties':
        return this.calculatePropertyKPI(kpi, properties);
      case 'contacts':
        return this.calculateContactKPI(kpi, contacts);
      case 'deals':
        return this.calculateDealKPI(kpi, deals);
      case 'financial':
        return this.calculateFinancialKPI(kpi, transactions, deals);
      case 'leads':
        return this.calculateLeadKPI(kpi, this.getLeads());
      default:
        return kpi.currentValue || 0;
    }
  }

  private calculatePropertyKPI(kpi: KPI, properties: Property[]): number {
    switch (kpi.name.toLowerCase()) {
      case 'active properties':
      case 'active listings':
        return properties.filter(p => p.status === 'active').length;
      case 'sold properties':
        return properties.filter(p => p.status === 'sold').length;
      case 'total properties':
        return properties.length;
      case 'average property value':
        const activeProps = properties.filter(p => p.status === 'active');
        return activeProps.length > 0 
          ? activeProps.reduce((sum, p) => sum + (p.price || 0), 0) / activeProps.length 
          : 0;
      default:
        return 0;
    }
  }

  private calculateContactKPI(kpi: KPI, contacts: Contact[]): number {
    switch (kpi.name.toLowerCase()) {
      case 'total contacts':
        return contacts.length;
      case 'new contacts':
        const today = new Date().toISOString().split('T')[0];
        return contacts.filter(c => c.createdAt?.startsWith(today)).length;
      case 'active clients':
        return contacts.filter(c => c.type === 'client').length;
      case 'prospects':
        return contacts.filter(c => c.type === 'prospect').length;
      default:
        return 0;
    }
  }

  private calculateDealKPI(kpi: KPI, deals: Deal[]): number {
    switch (kpi.name.toLowerCase()) {
      case 'active deals':
        return deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length;
      case 'closed deals':
        return deals.filter(d => d.stage === 'closed-won').length;
      case 'total deal value':
        return deals.filter(d => d.stage === 'closed-won').reduce((sum, d) => sum + (d.value || 0), 0);
      case 'average deal size':
        const closedDeals = deals.filter(d => d.stage === 'closed-won');
        return closedDeals.length > 0 
          ? closedDeals.reduce((sum, d) => sum + (d.value || 0), 0) / closedDeals.length 
          : 0;
      case 'conversion rate':
        const totalLeads = this.getLeads().length;
        const convertedDeals = deals.filter(d => d.stage === 'closed-won').length;
        return totalLeads > 0 ? (convertedDeals / totalLeads) * 100 : 0;
      default:
        return 0;
    }
  }

  private calculateFinancialKPI(kpi: KPI, transactions: Transaction[], deals: Deal[]): number {
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    switch (kpi.name.toLowerCase()) {
      case 'total revenue':
      case 'monthly revenue':
        return transactions
          .filter(t => t.type === 'income' && t.date.startsWith(thisMonth))
          .reduce((sum, t) => sum + t.amount, 0);
      case 'total expenses':
        return transactions
          .filter(t => t.type === 'expense' && t.date.startsWith(thisMonth))
          .reduce((sum, t) => sum + t.amount, 0);
      case 'profit':
        const revenue = this.getTotalRevenue(thisMonth + '-01', thisMonth + '-31');
        const expenses = this.getTotalExpenses(thisMonth + '-01', thisMonth + '-31');
        return revenue - expenses;
      case 'commission earned':
        return deals
          .filter(d => d.stage === 'closed-won' && d.updatedAt?.startsWith(thisMonth))
          .reduce((sum, d) => sum + ((d.value || 0) * 0.03), 0); // 3% commission
      default:
        return 0;
    }
  }

  private calculateLeadKPI(kpi: KPI, leads: Lead[]): number {
    switch (kpi.name.toLowerCase()) {
      case 'new leads':
        const today = new Date().toISOString().split('T')[0];
        return leads.filter(l => l.createdDate.toString().startsWith(today)).length;
      case 'qualified leads':
        return leads.filter(l => l.status === 'qualified').length;
      case 'total leads':
        return leads.length;
      case 'lead score average':
        return leads.length > 0 
          ? leads.reduce((sum, l) => sum + l.score, 0) / leads.length 
          : 0;
      default:
        return 0;
    }
  }

  // ============= CAMPAIGNS MANAGEMENT =============
  
  public getCampaigns(): Campaign[] {
    const stored = localStorage.getItem('creo_campaigns');
    return stored ? JSON.parse(stored) : [];
  }

  public setCampaigns(campaigns: Campaign[]): void {
    localStorage.setItem('creo_campaigns', JSON.stringify(campaigns));
  }

  public addCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
    const campaigns = this.getCampaigns();
    const newCampaign: Campaign = {
      ...campaign,
      id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    campaigns.push(newCampaign);
    this.setCampaigns(campaigns);
    return newCampaign;
  }

  public updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    campaigns[index] = { 
      ...campaigns[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.setCampaigns(campaigns);
    return campaigns[index];
  }

  public deleteCampaign(id: string): boolean {
    const campaigns = this.getCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    if (filtered.length === campaigns.length) return false;
    
    this.setCampaigns(filtered);
    return true;
  }

  // ============= ANALYTICS & REPORTING =============
  
  public generateAnalytics() {
    const properties = unifiedDataService.getProperties();
    const contacts = unifiedDataService.getContacts();
    const deals = unifiedDataService.getDeals();
    const leads = this.getLeads();
    const transactions = this.getTransactions();

    return {
      overview: {
        totalProperties: properties.length,
        activeListings: properties.filter(p => p.status === 'active').length,
        totalContacts: contacts.length,
        totalDeals: deals.length,
        totalRevenue: this.getTotalRevenue(),
        totalExpenses: this.getTotalExpenses()
      },
      trends: {
        propertiesThisMonth: this.getCountByMonth(properties, 'createdAt'),
        dealsThisMonth: this.getCountByMonth(deals, 'createdAt'),
        revenueThisMonth: this.getRevenueByMonth()
      },
      performance: {
        conversionRate: leads.length > 0 ? (deals.filter(d => d.stage === 'closed-won').length / leads.length) * 100 : 0,
        averageDealSize: deals.length > 0 ? deals.reduce((sum, d) => sum + (d.value || 0), 0) / deals.length : 0,
        averagePropertyPrice: properties.length > 0 ? properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length : 0
      }
    };
  }

  private getCountByMonth(items: any[], dateField: string): number {
    const thisMonth = new Date().toISOString().slice(0, 7);
    return items.filter(item => item[dateField]?.startsWith(thisMonth)).length;
  }

  private getRevenueByMonth(): number {
    const thisMonth = new Date().toISOString().slice(0, 7);
    return this.getTotalRevenue(thisMonth + '-01', thisMonth + '-31');
  }

  // ============= DATA MANAGEMENT =============
  
  public exportAllData() {
    return {
      properties: unifiedDataService.getProperties(),
      contacts: unifiedDataService.getContacts(),
      deals: unifiedDataService.getDeals(),
      agents: unifiedDataService.getAgents(),
      tasks: unifiedDataService.getTasks(),
      leads: this.getLeads(),
      transactions: this.getTransactions(),
      kpis: this.getKPIs(),
      campaigns: this.getCampaigns()
    };
  }

  public clearAllData(): void {
    localStorage.removeItem('creo_leads');
    localStorage.removeItem('creo_transactions');
    localStorage.removeItem('creo_kpis');
    localStorage.removeItem('creo_campaigns');
    unifiedDataService.clearAllData();
  }
}

export const realDataService = RealDataService.getInstance(); 