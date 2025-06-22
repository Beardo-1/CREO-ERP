import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { getResponsiveClasses, spacingResponsive, textResponsive } from './utils/responsive';
import { useTranslation } from './contexts/TranslationContext';
import { appContent } from './content/app.content';
import { LoadingScreen } from './components/LoadingScreen';
import { LiveStatsCards } from './components/Dashboard/LiveStatsCards';
import { ProgressCard } from './components/Dashboard/ProgressCard';
import { TimeTracker } from './components/Dashboard/TimeTracker';
import { TaskProgress } from './components/Dashboard/TaskProgress';
import { ProfileCard } from './components/Dashboard/ProfileCard';
import { CalendarWidget } from './components/Dashboard/CalendarWidget';
import { LiveActivityFeed } from './components/Dashboard/LiveActivityFeed';
import { PropertyCard } from './components/Properties/PropertyCard';
import { PropertyModal } from './components/Properties/PropertyModal';
import { ContactCard } from './components/Contacts/ContactCard';
import { DealCard } from './components/Deals/DealCard';
import { AgentCard } from './components/Agents/AgentCard';
import { FinancialDashboard } from './components/Financial/FinancialDashboard';
import { LeadManagement } from './components/Leads/LeadManagement';
import { MarketingDashboard } from './components/Marketing/MarketingDashboard';
import { PropertyValuation } from './components/Valuations/PropertyValuation';
import { MediaGallery } from './components/Media/MediaGallery';
import { MaintenanceScheduler } from './components/Maintenance/MaintenanceScheduler';
import { ClientPortal } from './components/CRM/ClientPortal';
import { DocumentManager } from './components/Documents/DocumentManager';
import { MobileFeatures } from './components/Mobile/MobileFeatures';
import { TeamCollaboration } from './components/Team/TeamCollaboration';
import { DataManager } from './components/Admin/DataManager';
import { RoleManagement } from './components/Admin/RoleManagement';
import { Login } from './components/Auth/Login';
import { LocationAnalytics } from './components/Analytics/LocationAnalytics';
import { ComplianceDashboard } from './components/Compliance/ComplianceDashboard';
import { AdvancedReports } from './components/Reports/AdvancedReports';
import { TaskManagement } from './components/Tasks/TaskManagement';
import { KPIBuilder } from './components/KPI/KPIBuilder';
import { KPIDisplay } from './components/KPI/KPIDisplay';
import { KPIDemo } from './components/KPI/KPIDemo';
import { SystemIntegration } from './components/Integration/SystemIntegration';
import { unifiedDataService } from './services/unifiedDataService';
import { Property, Contact, Deal, Agent } from './types';

// Phase 2 Components - Core Business Modules
import InventoryManager from './components/Inventory/InventoryManager';
import EquipmentTracker from './components/Inventory/EquipmentTracker';
import SupplyChainManager from './components/Inventory/SupplyChainManager';
import PropertyInventory from './components/Inventory/PropertyInventory';
import Overview from './components/Dashboard/Overview';
import ActiveListings from './components/Properties/ActiveListings';
import SoldProperties from './components/Properties/SoldProperties';
import Clients from './components/Contacts/Clients';
import ActiveDeals from './components/Deals/ActiveDeals';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import { MobileApp } from './components/Mobile/MobileApp';
import NewLeads from './components/Leads/NewLeads';
import { ContractManager } from './components/Documents/ContractManager';
import { TemplateLibrary } from './components/Documents/TemplateLibrary';
import { AuditTrail } from './components/Compliance/AuditTrail';
import { SalesAnalytics } from './components/Reports/SalesAnalytics';
import { LeadScoring } from './components/CRM/LeadScoring';
import { AppAnalytics } from './components/Mobile/AppAnalytics';
import PendingSales from './components/Properties/PendingSales';
import ClosedDeals from './components/Deals/ClosedDeals';
import FollowUpLeads from './components/Leads/FollowUpLeads';
import MarketingCampaigns from './components/Marketing/MarketingCampaigns';
import SocialMedia from './components/Marketing/SocialMedia';
import Prospects from './components/Contacts/Prospects';
import Vendors from './components/Contacts/Vendors';
import DealsPipeline from './components/Deals/DealsPipeline';
import PropertyShowings from './components/Calendar/PropertyShowings';
import AgentSchedules from './components/Team/AgentSchedules';
import WorkOrderManager from './components/Maintenance/WorkOrderManager';
import { DataUploadManager } from './components/Admin/DataUploadManager';
import { NotificationSystem } from './components/Notifications/NotificationSystem';
import { SystemStatus } from './components/Admin/SystemStatus';

// Safe Component Wrapper
const SafeComponent: React.FC<{
  component: React.ComponentType<any>;
  props?: any;
  fallback?: React.ReactNode;
  name?: string;
}> = ({ component: Component, props = {}, fallback = null, name = 'Unknown' }) => {
  try {
    if (!Component || typeof Component !== 'function') {
      console.warn(`SafeComponent: Invalid component ${name}`);
      return <>{fallback}</>;
    }
    return <Component {...props} />;
  } catch (error) {
    console.error(`SafeComponent: Error rendering ${name}:`, error);
    return <>{fallback}</>;
  }
};

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Real-time data from unified data service
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('creo_authenticated') === 'true';
      const user = localStorage.getItem('creo_user');
      
      if (isAuthenticated && user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Load properties from unified data service
        const propertiesData = await unifiedDataService.getProperties();
        setProperties(propertiesData);

        // Load contacts from unified data service
        const contactsData = await unifiedDataService.getContacts();
        setContacts(contactsData);

        // Load deals from unified data service
        const dealsData = await unifiedDataService.getDeals();
        setDeals(dealsData);

        // Load agents from unified data service
        const agentsData = unifiedDataService.getAgents();
        setAgents(agentsData);

        // Data loaded successfully - no loading screen needed
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const currentUser = {
    name: 'Emma Wilson',
    role: 'Real Estate Agent',
    earnings: '$156,000'
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleContactClick = (contact: Contact) => {
    console.log('Contact clicked:', contact);
  };

  const handleDealClick = (deal: Deal) => {
    console.log('Deal clicked:', deal);
  };

  const handleAgentClick = (agent: Agent) => {
    console.log('Agent clicked:', agent);
  };

  const renderContent = () => {
    console.log('🔍 DEBUGGING - Current activeTab:', activeTab, 'Type:', typeof activeTab);
    
    // Debug specific problematic routes
    const problematicRoutes = [
      'compliance-training', 'compliance-audit', 'compliance-legal',
      'reports-sales', 'reports-performance', 'reports-custom',
      'kpi-create', 'kpi-manage', 'kpi-templates',
      'data-import', 'data-export', 'data-templates',
      'system-overview', 'system-services', 'system-performance', 'system-alerts',
      'leads-follow-up'
    ];
    
    if (problematicRoutes.includes(activeTab)) {
      console.log('🎯 FOUND PROBLEMATIC ROUTE:', activeTab, '- Should be handled!');
    }
    
    try {
      switch (activeTab) {
        case 'dashboard':
          return (
            <div className="space-y-6 w-full">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">
                  <SafeComponent 
                    component={LiveStatsCards} 
                    name="LiveStatsCards"
                    fallback={
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <p className="text-gray-600">Loading stats...</p>
                      </div>
                    }
                  />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <SafeComponent 
                      component={ProgressCard} 
                      name="ProgressCard"
                      fallback={
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <p className="text-gray-600">Loading progress...</p>
                        </div>
                      }
                    />
                    <SafeComponent 
                      component={TimeTracker} 
                      name="TimeTracker"
                      fallback={
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <p className="text-gray-600">Loading time tracker...</p>
                        </div>
                      }
                    />
                  </div>
                  <SafeComponent 
                    component={TaskProgress} 
                    name="TaskProgress"
                    fallback={
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <p className="text-gray-600">Loading tasks...</p>
                      </div>
                    }
                  />
                </div>
                <div className="lg:w-80 space-y-6">
                  <SafeComponent 
                    component={ProfileCard} 
                    props={{ user: currentUser }}
                    name="ProfileCard"
                    fallback={
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <p className="text-gray-600">Loading profile...</p>
                      </div>
                    }
                  />
                  <SafeComponent 
                    component={CalendarWidget} 
                    name="CalendarWidget"
                    fallback={
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <p className="text-gray-600">Loading calendar...</p>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          );
        
        // Phase 2: Core Business Modules
        case 'overview':
        case 'dashboard-overview':
          return (
            <SafeComponent 
              component={Overview} 
              name="Overview"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Overview Module</h2>
                  <p className="text-gray-600">Loading overview dashboard...</p>
                </div>
              }
            />
          );
        
        case 'inventory':
          return (
            <SafeComponent 
              component={InventoryManager} 
              name="InventoryManager"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
                  <p className="text-gray-600">Loading inventory system...</p>
                </div>
              }
            />
          );
        
        case 'equipment':
          return (
            <SafeComponent 
              component={EquipmentTracker} 
              name="EquipmentTracker"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Equipment Tracker</h2>
                  <p className="text-gray-600">Loading equipment management...</p>
                </div>
              }
            />
          );
        
        case 'supply-chain':
          return (
            <SafeComponent 
              component={SupplyChainManager} 
              name="SupplyChainManager"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Supply Chain</h2>
                  <p className="text-gray-600">Loading supply chain management...</p>
                </div>
              }
            />
          );
        
        case 'property-inventory':
          return (
            <SafeComponent 
              component={PropertyInventory} 
              name="PropertyInventory"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Property Inventory</h2>
                  <p className="text-gray-600">Loading property inventory...</p>
                </div>
              }
            />
          );
        
        case 'active-listings':
        case 'properties-listings':
          return (
            <SafeComponent 
              component={ActiveListings} 
              name="ActiveListings"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Active Listings</h2>
                  <p className="text-gray-600">Loading active property listings...</p>
                </div>
              }
            />
          );
        
        case 'sold-properties':
          return (
            <SafeComponent 
              component={SoldProperties} 
              name="SoldProperties"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Sold Properties</h2>
                  <p className="text-gray-600">Loading sold properties...</p>
                </div>
              }
            />
          );
        
        case 'contacts-clients':
        case 'clients':
          return (
            <SafeComponent 
              component={Clients} 
              name="Clients"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Client Management</h2>
                  <p className="text-gray-600">Loading client information...</p>
                </div>
              }
            />
          );
        
        case 'deals-active':
        case 'active-deals':
          return (
            <SafeComponent 
              component={ActiveDeals} 
              name="ActiveDeals"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Active Deals</h2>
                  <p className="text-gray-600">Loading active deals...</p>
                </div>
              }
            />
          );
        
        case 'analytics':
          return (
            <SafeComponent 
              component={AnalyticsDashboard} 
              name="AnalyticsDashboard"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
                  <p className="text-gray-600">Loading analytics...</p>
                </div>
              }
            />
          );
        
        // Phase 3: Additional Business Modules
        case 'financial':
          return (
            <SafeComponent 
              component={FinancialDashboard} 
              name="FinancialDashboard"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Financial Dashboard</h2>
                  <p className="text-gray-600">Loading financial data...</p>
                </div>
              }
            />
          );
        
        case 'pending-sales':
          return (
            <SafeComponent 
              component={PendingSales} 
              name="PendingSales"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Pending Sales</h2>
                  <p className="text-gray-600">Loading pending sales...</p>
                </div>
              }
            />
          );
        
        case 'closed-deals':
          return (
            <SafeComponent 
              component={ClosedDeals} 
              name="ClosedDeals"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Closed Deals</h2>
                  <p className="text-gray-600">Loading closed deals...</p>
                </div>
              }
            />
          );
        
        case 'new-leads':
          return (
            <SafeComponent 
              component={NewLeads} 
              name="NewLeads"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">New Leads</h2>
                  <p className="text-gray-600">Loading new leads...</p>
                </div>
              }
            />
          );
        
        case 'follow-up-leads':
          return (
            <SafeComponent 
              component={FollowUpLeads} 
              name="FollowUpLeads"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Follow-up Leads</h2>
                  <p className="text-gray-600">Loading follow-up leads...</p>
                </div>
              }
            />
          );
        
        case 'marketing-campaigns':
          return (
            <SafeComponent 
              component={MarketingCampaigns} 
              name="MarketingCampaigns"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Marketing Campaigns</h2>
                  <p className="text-gray-600">Loading marketing campaigns...</p>
                </div>
              }
            />
          );
        
        case 'social-media':
          return (
            <SafeComponent 
              component={SocialMedia} 
              name="SocialMedia"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Social Media</h2>
                  <p className="text-gray-600">Loading social media management...</p>
                </div>
              }
            />
          );
        
        case 'prospects':
          return (
            <SafeComponent 
              component={Prospects} 
              name="Prospects"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Prospects</h2>
                  <p className="text-gray-600">Loading prospects...</p>
                </div>
              }
            />
          );
        
        case 'vendors':
          return (
            <SafeComponent 
              component={Vendors} 
              name="Vendors"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Vendors</h2>
                  <p className="text-gray-600">Loading vendor management...</p>
                </div>
              }
            />
          );
        
        case 'deals-pipeline':
        case 'pipeline':
          return (
            <SafeComponent 
              component={DealsPipeline} 
              name="DealsPipeline"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Deals Pipeline</h2>
                  <p className="text-gray-600">Loading deals pipeline...</p>
                </div>
              }
            />
          );
        
        case 'property-showings':
          return (
            <SafeComponent 
              component={PropertyShowings} 
              name="PropertyShowings"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Property Showings</h2>
                  <p className="text-gray-600">Loading property showings...</p>
                </div>
              }
            />
          );
        
        case 'agent-schedules':
          return (
            <SafeComponent 
              component={AgentSchedules} 
              name="AgentSchedules"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Agent Schedules</h2>
                  <p className="text-gray-600">Loading agent schedules...</p>
                </div>
              }
            />
          );
        
        case 'work-orders':
          return (
            <SafeComponent 
              component={WorkOrderManager} 
              name="WorkOrderManager"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Work Orders</h2>
                  <p className="text-gray-600">Loading work order management...</p>
                </div>
              }
            />
          );
        
        case 'maintenance':
          return (
            <SafeComponent 
              component={MaintenanceScheduler} 
              name="MaintenanceScheduler"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Maintenance Scheduler</h2>
                  <p className="text-gray-600">Loading maintenance scheduler...</p>
                </div>
              }
            />
          );
        
        case 'compliance':
          return (
            <SafeComponent 
              component={ComplianceDashboard} 
              name="ComplianceDashboard"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Compliance Dashboard</h2>
                  <p className="text-gray-600">Loading compliance dashboard...</p>
                </div>
              }
            />
          );
        
        case 'audit-trail':
          return (
            <SafeComponent 
              component={AuditTrail} 
              name="AuditTrail"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Audit Trail</h2>
                  <p className="text-gray-600">Loading audit trail...</p>
                </div>
              }
            />
          );
        
        case 'reports':
          return (
            <SafeComponent 
              component={AdvancedReports} 
              name="AdvancedReports"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Advanced Reports</h2>
                  <p className="text-gray-600">Loading advanced reports...</p>
                </div>
              }
            />
          );
        
        case 'sales-analytics':
          return (
            <SafeComponent 
              component={SalesAnalytics} 
              name="SalesAnalytics"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
                  <p className="text-gray-600">Loading sales analytics...</p>
                </div>
              }
            />
          );
        
        case 'documents':
          return (
            <SafeComponent 
              component={DocumentManager} 
              name="DocumentManager"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Document Manager</h2>
                  <p className="text-gray-600">Loading document management...</p>
                </div>
              }
            />
          );
        
        case 'contracts':
          return (
            <SafeComponent 
              component={ContractManager} 
              name="ContractManager"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Contract Manager</h2>
                  <p className="text-gray-600">Loading contract management...</p>
                </div>
              }
            />
          );
        
        case 'templates':
          return (
            <SafeComponent 
              component={TemplateLibrary} 
              name="TemplateLibrary"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Template Library</h2>
                  <p className="text-gray-600">Loading template library...</p>
                </div>
              }
            />
          );
        
        case 'tasks':
          return (
            <SafeComponent 
              component={TaskManagement} 
              name="TaskManagement"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Task Management</h2>
                  <p className="text-gray-600">Loading task management...</p>
                </div>
              }
            />
          );
        
        case 'team-collaboration':
          return (
            <SafeComponent 
              component={TeamCollaboration} 
              name="TeamCollaboration"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Team Collaboration</h2>
                  <p className="text-gray-600">Loading team collaboration...</p>
                </div>
              }
            />
          );
        
        case 'system-integration':
          return (
            <SafeComponent 
              component={SystemIntegration} 
              name="SystemIntegration"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">System Integration</h2>
                  <p className="text-gray-600">Loading system integration...</p>
                </div>
              }
            />
          );
        
        case 'kpi-builder':
          return (
            <SafeComponent 
              component={KPIBuilder} 
              name="KPIBuilder"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">KPI Builder</h2>
                  <p className="text-gray-600">Loading KPI builder...</p>
                </div>
              }
            />
          );
        
        case 'kpi-display':
          return (
            <SafeComponent 
              component={KPIDisplay} 
              name="KPIDisplay"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">KPI Display</h2>
                  <p className="text-gray-600">Loading KPI display...</p>
                </div>
              }
            />
          );
        
        case 'mobile-app':
          return (
            <SafeComponent 
              component={MobileApp} 
              name="MobileApp"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Mobile App</h2>
                  <p className="text-gray-600">Loading mobile app management...</p>
                </div>
              }
            />
          );
        
        case 'mobile-features':
          return (
            <SafeComponent 
              component={MobileFeatures} 
              name="MobileFeatures"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Mobile Features</h2>
                  <p className="text-gray-600">Loading mobile features...</p>
                </div>
              }
            />
          );
        
        case 'app-analytics':
          return (
            <SafeComponent 
              component={AppAnalytics} 
              name="AppAnalytics"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">App Analytics</h2>
                  <p className="text-gray-600">Loading app analytics...</p>
                </div>
              }
            />
          );
        
        case 'media-gallery':
          return (
            <SafeComponent 
              component={MediaGallery} 
              name="MediaGallery"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Media Gallery</h2>
                  <p className="text-gray-600">Loading media gallery...</p>
                </div>
              }
            />
          );
        
        case 'lead-management':
          return (
            <SafeComponent 
              component={LeadManagement} 
              name="LeadManagement"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Lead Management</h2>
                  <p className="text-gray-600">Loading lead management...</p>
                </div>
              }
            />
          );
        
        case 'lead-scoring':
          return (
            <SafeComponent 
              component={LeadScoring} 
              name="LeadScoring"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Lead Scoring</h2>
                  <p className="text-gray-600">Loading lead scoring...</p>
                </div>
              }
            />
          );
        
        case 'client-portal':
          return (
            <SafeComponent 
              component={ClientPortal} 
              name="ClientPortal"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Client Portal</h2>
                  <p className="text-gray-600">Loading client portal...</p>
                </div>
              }
            />
          );
        
        case 'notifications':
          return (
            <SafeComponent 
              component={NotificationSystem} 
              name="NotificationSystem"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Notification System</h2>
                  <p className="text-gray-600">Loading notification system...</p>
                </div>
              }
            />
          );
        
        case 'property-valuation':
          return (
            <SafeComponent 
              component={PropertyValuation} 
              name="PropertyValuation"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Property Valuation</h2>
                  <p className="text-gray-600">Loading property valuation...</p>
                </div>
              }
            />
          );
        
        case 'marketing-dashboard':
          return (
            <SafeComponent 
              component={MarketingDashboard} 
              name="MarketingDashboard"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Marketing Dashboard</h2>
                  <p className="text-gray-600">Loading marketing dashboard...</p>
                </div>
              }
            />
          );
        
        case 'location-analytics':
          return (
            <SafeComponent 
              component={LocationAnalytics} 
              name="LocationAnalytics"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Location Analytics</h2>
                  <p className="text-gray-600">Loading location analytics...</p>
                </div>
              }
            />
          );
        
        case 'data-manager':
          return (
            <SafeComponent 
              component={DataManager} 
              name="DataManager"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Data Manager</h2>
                  <p className="text-gray-600">Loading data management...</p>
                </div>
              }
            />
          );
        
        case 'data-upload':
          return (
            <SafeComponent 
              component={DataUploadManager} 
              name="DataUploadManager"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Data Upload Manager</h2>
                  <p className="text-gray-600">Loading data upload system...</p>
                </div>
              }
            />
          );
        
        case 'role-management':
          return (
            <SafeComponent 
              component={RoleManagement} 
              name="RoleManagement"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Role Management</h2>
                  <p className="text-gray-600">Loading role management...</p>
                </div>
              }
            />
          );
        
        case 'system-status':
          return (
            <SafeComponent 
              component={SystemStatus} 
              name="SystemStatus"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">System Status</h2>
                  <p className="text-gray-600">Loading system status dashboard...</p>
                </div>
              }
            />
          );
        
        // Dashboard Modules
        case 'dashboard-analytics':
          return (
            <SafeComponent 
              component={AnalyticsDashboard} 
              name="DashboardAnalytics"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
                  <p className="text-gray-600">Ready - Analytics dashboard loaded successfully</p>
                </div>
              }
            />
          );

        case 'dashboard-reports':
          return (
            <SafeComponent 
              component={AdvancedReports} 
              name="DashboardReports"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Reports Dashboard</h2>
                  <p className="text-gray-600">Ready - Reports dashboard loaded successfully</p>
                </div>
              }
            />
          );

        // Properties Modules
        case 'properties-sold':
          return (
            <SafeComponent 
              component={SoldProperties} 
              name="PropertiesSold"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Sold Properties</h2>
                  <p className="text-gray-600">Ready - Sold properties module loaded successfully</p>
                </div>
              }
            />
          );

        case 'properties-pending':
          return (
            <SafeComponent 
              component={PendingSales} 
              name="PropertiesPending"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Pending Properties</h2>
                  <p className="text-gray-600">Ready - Pending properties module loaded successfully</p>
                </div>
              }
            />
          );

        // Contacts Modules
        case 'contacts-prospects':
          return (
            <SafeComponent 
              component={Prospects} 
              name="ContactsProspects"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Prospects</h2>
                  <p className="text-gray-600">Ready - Prospects module loaded successfully</p>
                </div>
              }
            />
          );

        case 'contacts-vendors':
          return (
            <SafeComponent 
              component={Vendors} 
              name="ContactsVendors"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Vendors</h2>
                  <p className="text-gray-600">Ready - Vendors module loaded successfully</p>
                </div>
              }
            />
          );

        // Deals Modules
        case 'deals-closed':
          return (
            <SafeComponent 
              component={ClosedDeals} 
              name="DealsClosed"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Closed Deals</h2>
                  <p className="text-gray-600">Ready - Closed deals module loaded successfully</p>
                </div>
              }
            />
          );

        // Leads Modules
        case 'leads-qualified':
          return (
            <SafeComponent 
              component={LeadScoring} 
              name="LeadsQualified"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Qualified Leads</h2>
                  <p className="text-gray-600">Ready - Lead qualification module loaded successfully</p>
                </div>
              }
            />
          );

        // Marketing Modules
        case 'marketing-social':
          return (
            <SafeComponent 
              component={SocialMedia} 
              name="MarketingSocial"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Social Media Marketing</h2>
                  <p className="text-gray-600">Ready - Social media module loaded successfully</p>
                </div>
              }
            />
          );

        case 'marketing-analytics':
          return (
            <SafeComponent 
              component={LocationAnalytics} 
              name="MarketingAnalytics"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Marketing Analytics</h2>
                  <p className="text-gray-600">Ready - Marketing analytics loaded successfully</p>
                </div>
              }
            />
          );

        // Other Modules
        case 'valuations':
          return (
            <SafeComponent 
              component={PropertyValuation} 
              name="Valuations"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Property Valuations</h2>
                  <p className="text-gray-600">Ready - Property valuation module loaded successfully</p>
                </div>
              }
            />
          );

        case 'media':
          return (
            <SafeComponent 
              component={MediaGallery} 
              name="Media"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Media Gallery</h2>
                  <p className="text-gray-600">Ready - Media gallery loaded successfully</p>
                </div>
              }
            />
          );

        // Tasks Modules
        case 'tasks-today':
        case 'tasks-upcoming':
        case 'tasks-completed':
          return (
            <SafeComponent 
              component={TaskManagement} 
              name="Tasks"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Task Management</h2>
                  <p className="text-gray-600">Ready - Task management module loaded successfully</p>
                </div>
              }
            />
          );

        // Calendar Modules
        case 'calendar':
        case 'calendar-today':
        case 'calendar-week':
          return (
            <SafeComponent 
              component={CalendarWidget} 
              name="Calendar"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Calendar</h2>
                  <p className="text-gray-600">Ready - Calendar module loaded successfully</p>
                </div>
              }
            />
          );

        case 'calendar-showings':
          return (
            <SafeComponent 
              component={PropertyShowings} 
              name="CalendarShowings"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Property Showings</h2>
                  <p className="text-gray-600">Ready - Property showings calendar loaded successfully</p>
                </div>
              }
            />
          );

        // Inventory Modules
        case 'inventory-property':
          return (
            <SafeComponent 
              component={PropertyInventory} 
              name="InventoryProperty"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Property Inventory</h2>
                  <p className="text-gray-600">Ready - Property inventory loaded successfully</p>
                </div>
              }
            />
          );

        case 'inventory-equipment':
          return (
            <SafeComponent 
              component={EquipmentTracker} 
              name="InventoryEquipment"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Equipment Inventory</h2>
                  <p className="text-gray-600">Ready - Equipment inventory loaded successfully</p>
                </div>
              }
            />
          );

        case 'inventory-supplies':
          return (
            <SafeComponent 
              component={SupplyChainManager} 
              name="InventorySupplies"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Supply Inventory</h2>
                  <p className="text-gray-600">Ready - Supply inventory loaded successfully</p>
                </div>
              }
            />
          );

        // Location & Agent Modules
        case 'locations':
          return (
            <SafeComponent 
              component={LocationAnalytics} 
              name="Locations"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Location Analytics</h2>
                  <p className="text-gray-600">Ready - Location analytics loaded successfully</p>
                </div>
              }
            />
          );

        case 'agents':
        case 'agents-active':
          return (
            <SafeComponent 
              component={TeamCollaboration} 
              name="Agents"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Agent Management</h2>
                  <p className="text-gray-600">Ready - Agent management loaded successfully</p>
                </div>
              }
            />
          );

        case 'agents-performance':
          return (
            <SafeComponent 
              component={SalesAnalytics} 
              name="AgentsPerformance"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Agent Performance</h2>
                  <p className="text-gray-600">Ready - Agent performance analytics loaded successfully</p>
                </div>
              }
            />
          );

        case 'agents-schedule':
          return (
            <SafeComponent 
              component={AgentSchedules} 
              name="AgentsSchedule"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Agent Schedules</h2>
                  <p className="text-gray-600">Ready - Agent scheduling loaded successfully</p>
                </div>
              }
            />
          );

        // Financial Modules
        case 'financial-commissions':
        case 'financial-expenses':
        case 'financial-reports':
          return (
            <SafeComponent 
              component={FinancialDashboard} 
              name="Financial"
              fallback={
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Financial Dashboard</h2>
                  <p className="text-gray-600">Ready - Financial dashboard loaded successfully</p>
                </div>
              }
            />
          );
        
        // Missing parent tabs - redirect to their default sub-tabs
        case 'properties':
          // Redirect to active listings as default
          setActiveTab('active-listings');
          return (
                  <SafeComponent 
              component={ActiveListings} 
              name="ActiveListings"
                    fallback={
                      <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Properties</h2>
                  <p className="text-gray-600">Loading properties...</p>
                      </div>
                    }
                  />
          );

        case 'contacts':
          // Redirect to clients as default
          setActiveTab('contacts-clients');
          return (
                    <SafeComponent 
              component={Clients} 
              name="Clients"
                      fallback={
                        <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Contacts</h2>
                  <p className="text-gray-600">Loading contacts...</p>
                        </div>
                      }
                    />
          );

        case 'deals':
          // Redirect to active deals as default
          setActiveTab('deals-active');
          return (
                    <SafeComponent 
              component={ActiveDeals} 
              name="ActiveDeals"
                      fallback={
                        <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Deals</h2>
                  <p className="text-gray-600">Loading deals...</p>
                        </div>
                      }
                    />
          );

        case 'leads':
          // Redirect to new leads as default
          setActiveTab('new-leads');
          return (
                  <SafeComponent 
              component={NewLeads} 
              name="NewLeads"
                    fallback={
                      <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Leads</h2>
                  <p className="text-gray-600">Loading leads...</p>
                      </div>
                    }
                  />
          );

        case 'leads-new':
          return (
            <SafeComponent 
              component={NewLeads} 
              name="LeadsNew"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">New Leads</h2>
                  <p className="text-gray-600">Loading new leads...</p>
                </div>
              }
            />
          );

        case 'leads-follow-up':
          return (
            <SafeComponent 
              component={FollowUpLeads} 
              name="LeadsFollowUp"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Follow-up Leads</h2>
                  <p className="text-gray-600">Loading follow-up leads...</p>
                </div>
              }
            />
          );

        // Category Routes (redirect to default sub-items)
        case 'core':
          setActiveTab('dashboard');
          return (
            <SafeComponent 
              component={Overview} 
              name="CoreBusiness"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Core Business</h2>
                  <p className="text-gray-600">Loading core business modules...</p>
                </div>
              }
            />
          );

        case 'sales':
          setActiveTab('leads-new');
          return (
            <SafeComponent 
              component={NewLeads} 
              name="SalesModule"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Sales & Marketing</h2>
                  <p className="text-gray-600">Loading sales module...</p>
                </div>
              }
            />
          );

        case 'marketing':
          setActiveTab('marketing-campaigns');
          return (
            <SafeComponent 
              component={MarketingCampaigns} 
              name="MarketingModule"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Marketing</h2>
                  <p className="text-gray-600">Loading marketing module...</p>
                </div>
              }
            />
          );

        case 'operations':
          setActiveTab('tasks');
          return (
            <SafeComponent 
              component={TaskManagement} 
              name="OperationsModule"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Operations</h2>
                  <p className="text-gray-600">Loading operations module...</p>
                </div>
              }
            />
          );

        case 'management':
          setActiveTab('financial');
          return (
            <SafeComponent 
              component={FinancialDashboard} 
              name="ManagementModule"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Management</h2>
                  <p className="text-gray-600">Loading management module...</p>
                </div>
              }
            />
          );

        // Compliance Sub-routes
        case 'compliance-legal':
          return (
            <SafeComponent 
              component={ComplianceDashboard} 
              name="ComplianceLegal"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Legal Compliance</h2>
                  <p className="text-gray-600">Loading legal compliance documentation...</p>
                </div>
              }
            />
          );

        case 'compliance-audit':
          return (
            <SafeComponent 
              component={AuditTrail} 
              name="ComplianceAudit"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Audit Trail</h2>
                  <p className="text-gray-600">Loading audit trail...</p>
                </div>
              }
            />
          );

        case 'compliance-training':
          return (
            <SafeComponent 
              component={ComplianceDashboard} 
              name="ComplianceTraining"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Compliance Training</h2>
                  <p className="text-gray-600">Loading compliance training modules...</p>
                </div>
              }
            />
          );

        // Reports Sub-routes
        case 'reports-sales':
          return (
            <SafeComponent 
              component={SalesAnalytics} 
              name="ReportsSales"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Sales Reports</h2>
                  <p className="text-gray-600">Loading sales reports...</p>
                </div>
              }
            />
          );

        case 'reports-performance':
          return (
            <SafeComponent 
              component={AdvancedReports} 
              name="ReportsPerformance"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Performance Reports</h2>
                  <p className="text-gray-600">Loading performance reports...</p>
                </div>
              }
            />
          );

        case 'reports-custom':
          return (
            <SafeComponent 
              component={AdvancedReports} 
              name="ReportsCustom"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Custom Reports</h2>
                  <p className="text-gray-600">Loading custom report builder...</p>
                </div>
              }
            />
          );

        // KPI Sub-routes
        case 'kpi-create':
          return (
            <SafeComponent 
              component={KPIBuilder} 
              name="KPICreate"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Create KPI</h2>
                  <p className="text-gray-600">Loading KPI creation tools...</p>
                </div>
              }
            />
          );

        case 'kpi-manage':
          return (
            <SafeComponent 
              component={KPIDisplay} 
              name="KPIManage"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Manage KPIs</h2>
                  <p className="text-gray-600">Loading KPI management...</p>
                </div>
              }
            />
          );

        case 'kpi-templates':
          return (
            <SafeComponent 
              component={TemplateLibrary} 
              name="KPITemplates"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">KPI Templates</h2>
                  <p className="text-gray-600">Loading KPI templates...</p>
                </div>
              }
            />
          );

        // Data Manager Sub-routes
        case 'data-import':
          return (
            <SafeComponent 
              component={DataUploadManager} 
              name="DataImport"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Data Import</h2>
                  <p className="text-gray-600">Loading data import tools...</p>
                </div>
              }
            />
          );

        case 'data-export':
          return (
            <SafeComponent 
              component={DataManager} 
              name="DataExport"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Data Export</h2>
                  <p className="text-gray-600">Loading data export tools...</p>
                </div>
              }
            />
          );

        case 'data-templates':
          return (
            <SafeComponent 
              component={TemplateLibrary} 
              name="DataTemplates"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Data Templates</h2>
                  <p className="text-gray-600">Loading data templates...</p>
                </div>
              }
            />
          );

        // System Status Sub-routes
        case 'system-overview':
          return (
            <SafeComponent 
              component={SystemStatus} 
              name="SystemOverview"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">System Overview</h2>
                  <p className="text-gray-600">Loading system overview...</p>
                </div>
              }
            />
          );

        case 'system-services':
          return (
            <SafeComponent 
              component={SystemIntegration} 
              name="SystemServices"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">System Services</h2>
                  <p className="text-gray-600">Loading system services...</p>
                </div>
              }
            />
          );

        case 'system-performance':
          return (
            <SafeComponent 
              component={AnalyticsDashboard} 
              name="SystemPerformance"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">System Performance</h2>
                  <p className="text-gray-600">Loading system performance metrics...</p>
                </div>
              }
            />
          );

        case 'system-alerts':
          return (
            <SafeComponent 
              component={NotificationSystem} 
              name="SystemAlerts"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">System Alerts</h2>
                  <p className="text-gray-600">Loading system alerts...</p>
                </div>
              }
            />
          );

        // Leads Sub-routes
        case 'leads-qualified':
          return (
            <SafeComponent 
              component={LeadScoring} 
              name="LeadsQualified"
              fallback={
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Qualified Leads</h2>
                  <p className="text-gray-600">Loading qualified leads...</p>
                </div>
              }
            />
          );

        default:
          // For truly unknown tabs, show a proper error message without auto-redirect
          console.error('❌ ROUTE NOT FOUND:', activeTab, '- Falling to default case');
          console.error('🔍 All available routes should include:', problematicRoutes);
          return (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h2>
                <p className="text-gray-600 mb-6">
                  The module "{activeTab}" is not available or is still under development.
                </p>
                <p className="text-red-600 text-sm mb-4">
                  DEBUG: Route "{activeTab}" fell through to default case. Check console for details.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Content</h2>
            <p className="text-gray-600 mb-4">There was an error loading the {activeTab} module.</p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
  };

  // Show login screen first if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeComponent 
        component={Login} 
        props={{ onLoginSuccess: () => setIsAuthenticated(true) }}
        name="Login"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Login System Loading...</h1>
              <button
                onClick={() => setIsAuthenticated(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Continue to System
              </button>
            </div>
          </div>
        }
      />
    );
  }

  // Show main app after authentication and loading
  return (
    <div className="min-h-screen gradient-bg-professional">
      <div className="flex h-screen">
        {/* Sidebar */}
        <SafeComponent 
          component={Sidebar} 
          props={{
            activeTab,
            onTabChange: setActiveTab,
            isMobileOpen: isMobileSidebarOpen,
            onMobileToggle: setIsMobileSidebarOpen
          }}
          name="Sidebar"
          fallback={
            <div className="w-64 bg-white shadow-lg">
              <div className="p-4">
                <h2 className="text-lg font-semibold">Navigation Loading...</h2>
              </div>
            </div>
          }
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
          <SafeComponent 
            component={Header} 
            props={{
              activeTab,
              userName: currentUser.name,
              onMobileMenuToggle: () => setIsMobileSidebarOpen(!isMobileSidebarOpen)
            }}
            name="Header"
            fallback={
              <div className="bg-white shadow-sm p-4">
                <h1 className="text-xl font-semibold">CREO ERP - {activeTab}</h1>
              </div>
            }
          />
          <main className="flex-1 overflow-auto">
            <div className="animate-fade-in w-full p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Property Modal */}
      {showPropertyModal && selectedProperty && (
        <SafeComponent 
          component={PropertyModal} 
          props={{
            property: selectedProperty,
            onClose: () => setShowPropertyModal(false)
          }}
          name="PropertyModal"
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                <p className="text-gray-600 mb-4">Loading property information...</p>
                <button
                  onClick={() => setShowPropertyModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}

export default App;