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
import FinancialDashboard from './components/Financial/FinancialDashboard';
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
import { dataService } from './services/dataService';
import { Property, Contact, Deal, Agent } from './types';
import { mockContacts, mockDeals, mockAgents } from './data/mockData';
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

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Real-time data from data service
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      setProperties(dataService.getProperties());
      setContacts(dataService.getContacts());
      setDeals(dataService.getDeals());
      setAgents(dataService.getAgents());
    };

    loadData();

    // Subscribe to data changes for real-time updates
    const unsubscribeProperties = () => dataService.subscribe('propertiesChanged', setProperties);
    const unsubscribeContacts = () => dataService.subscribe('contactsChanged', setContacts);
    const unsubscribeDeals = () => dataService.subscribe('dealsChanged', setDeals);
    const unsubscribeAgents = () => dataService.subscribe('agentsChanged', setAgents);

    unsubscribeProperties();
    unsubscribeContacts();
    unsubscribeDeals();
    unsubscribeAgents();

    return () => {
      dataService.unsubscribe('propertiesChanged', setProperties);
      dataService.unsubscribe('contactsChanged', setContacts);
      dataService.unsubscribe('dealsChanged', setDeals);
      dataService.unsubscribe('agentsChanged', setAgents);
    };
  }, []);

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
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className={`min-h-screen ${spacingResponsive.container}`}>
            <div className={spacingResponsive.section}>
              <h3 className={`${textResponsive.heading.h3} font-bold text-gray-900`}>{t(appContent.stats.dashboard)}</h3>
              <p className={`${textResponsive.body.normal} text-gray-600 mt-2`}>{t(appContent.stats.realTimeOverview)}</p>
            </div>
            
            {/* Stats Cards - Full Width */}
            <div className={spacingResponsive.section}>
                <LiveStatsCards />
            </div>
            
            {/* Main Content - Responsive Layout */}
            <div className={`flex flex-col xl:flex-row ${spacingResponsive.gap} ${spacingResponsive.section}`}>
              {/* Left Side - Profile Card */}
              <div className="w-full xl:w-80 2xl:w-96 flex-shrink-0">
                <div className={`space-y-4 sm:space-y-6`}>
                <ProfileCard 
                  name={currentUser.name}
                  role={currentUser.role}
                  earnings={currentUser.earnings}
                />
                  <div className="hidden lg:block">
                    <CalendarWidget />
                  </div>
                </div>
              </div>
              
              {/* Right Side - Main Content */}
              <div className="flex-1 min-w-0">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${spacingResponsive.gap}`}>
                  {/* Task Progress */}
                  <div className="lg:col-span-2 xl:col-span-1">
                    <TaskProgress />
                  </div>
                  
                  {/* Progress and Time Tracker */}
                  <div className={`space-y-4 sm:space-y-6 lg:col-span-2 xl:col-span-1`}>
                    <ProgressCard />
                    <TimeTracker />
                  </div>
                </div>
                
                {/* Calendar Widget - Mobile/Tablet Only */}
                <div className="lg:hidden mt-6">
                <CalendarWidget />
                </div>
              </div>
            </div>
            
            {/* Activity Feed - Full Width */}
            <div>
              <LiveActivityFeed />
            </div>
          </div>
        );

      case 'dashboard-overview':
        return <Overview />;

      case 'dashboard-analytics':
        return <AnalyticsDashboard />;

      case 'dashboard-reports':
        return <AdvancedReports />;

      case 'properties':
        return (
          <div className={`min-h-screen ${spacingResponsive.container}`}>
            <div className={`${spacingResponsive.section} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
              <div>
                <h3 className={`${textResponsive.heading.h3} font-bold text-gray-900`}>Properties</h3>
                <p className={`${textResponsive.body.normal} text-gray-600 mt-2`}>{properties.length} properties in your portfolio</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <select className={`${spacingResponsive.gapSmall} border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3`}>
                  <option>All Types</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                </select>
                <select className={`${spacingResponsive.gapSmall} border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3`}>
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Sold</option>
                </select>
                <button className={`bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-semibold transition-all text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3`}>
                  Add Property
                </button>
              </div>
            </div>
            <div className={`grid ${getResponsiveClasses('cards', 'properties')} ${spacingResponsive.gap}`}>
              {properties.map((property: Property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={handlePropertyClick}
                />
              ))}
            </div>
          </div>
        );

      case 'properties-listings':
        return <ActiveListings />;

      case 'properties-sold':
        return <SoldProperties />;

      case 'properties-pending':
        return <PendingSales />;

      case 'contacts':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Contacts</h3>
                <p className="text-gray-600">{contacts.length} contacts in your network</p>
              </div>
              <div className="flex space-x-4">
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Types</option>
                  <option>Client</option>
                  <option>Lead</option>
                  <option>Vendor</option>
                </select>
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
                  Add Contact
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onClick={handleContactClick}
                />
              ))}
            </div>
          </div>
        );

      case 'contacts-clients':
        return <Clients />;

      case 'contacts-prospects':
        return <Prospects />;

      case 'contacts-vendors':
        return <Vendors />;

      case 'deals':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{t(appContent.deals.deals)}</h3>
                <p className="text-gray-600">{deals.length} {t(appContent.deals.activeDeals)}</p>
              </div>
              <div className="flex space-x-4">
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>{t(appContent.deals.allStages)}</option>
                  <option>{t(appContent.deals.lead)}</option>
                  <option>{t(appContent.deals.qualified)}</option>
                  <option>{t(appContent.deals.proposal)}</option>
                  <option>{t(appContent.deals.negotiation)}</option>
                  <option>{t(appContent.deals.closed)}</option>
                </select>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
                  {t(appContent.deals.addDeal)}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onClick={handleDealClick}
                />
              ))}
            </div>
          </div>
        );

      case 'deals-active':
        return <ActiveDeals />;

      case 'deals-pipeline':
        return <DealsPipeline />;

      case 'deals-closed':
        return <ClosedDeals />;

      case 'leads':
        return <LeadManagement />;

      case 'leads-new':
        return <NewLeads />;

      case 'leads-qualified':
        return <LeadScoring />;

      case 'leads-follow-up':
        return <FollowUpLeads />;

      case 'marketing':
        return <MarketingDashboard />;

      case 'marketing-campaigns':
        return <MarketingCampaigns />;

      case 'marketing-social':
        return <SocialMedia />;

      case 'marketing-analytics':
        return <MarketingDashboard />;

      case 'locations':
        return <LocationAnalytics />;

      case 'valuations':
        return <PropertyValuation />;

      case 'media':
        return <MediaGallery />;

      case 'tasks':
        return <TaskManagement />;

      case 'tasks-today':
        return <TaskManagement />;

      case 'tasks-upcoming':
        return <TaskManagement />;

      case 'tasks-completed':
        return <TaskManagement />;

      case 'calendar':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Calendar & Scheduling</h3>
              <p className="text-gray-600">Manage appointments, showings, and meetings</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CalendarWidget />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-900">Property Showing</h5>
                    <p className="text-blue-700 text-sm">123 Oak Street</p>
                    <p className="text-blue-600 text-xs">Today, 2:00 PM</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-900">Client Meeting</h5>
                    <p className="text-green-700 text-sm">Sarah Johnson</p>
                    <p className="text-green-600 text-xs">Tomorrow, 10:00 AM</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-semibold text-purple-900">Closing</h5>
                    <p className="text-purple-700 text-sm">456 Pine Avenue</p>
                    <p className="text-purple-600 text-xs">Friday, 3:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'calendar-today':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Today's Schedule</h3>
              <p className="text-gray-600">Manage today's appointments and meetings</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CalendarWidget />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-900">Property Showing</h5>
                    <p className="text-blue-700 text-sm">123 Oak Street</p>
                    <p className="text-blue-600 text-xs">2:00 PM</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-900">Client Meeting</h5>
                    <p className="text-green-700 text-sm">Sarah Johnson</p>
                    <p className="text-green-600 text-xs">4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'calendar-week':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">This Week</h3>
              <p className="text-gray-600">Weekly schedule overview</p>
            </div>
            <CalendarWidget />
          </div>
        );

      case 'calendar-showings':
        return <PropertyShowings />;

      case 'financial':
        return <FinancialDashboard />;

      case 'financial-commissions':
        return <FinancialDashboard />;

      case 'financial-expenses':
        return <FinancialDashboard />;

      case 'financial-reports':
        return <FinancialDashboard />;

      case 'agents':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Team Management</h3>
                <p className="text-gray-600">{agents.length} team members</p>
              </div>
              <div className="flex space-x-4">
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Senior Agent</option>
                  <option>Agent</option>
                  <option>Assistant</option>
                </select>
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
                  Add Team Member
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={handleAgentClick}
                />
              ))}
            </div>
          </div>
        );

      case 'agents-active':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Active Agents</h3>
                <p className="text-gray-600">{agents.length} active team members</p>
              </div>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
                Add Team Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={handleAgentClick}
                />
              ))}
            </div>
          </div>
        );

      case 'agents-performance':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Agent Performance</h3>
              <p className="text-gray-600">Performance metrics and analytics</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={handleAgentClick}
                />
              ))}
            </div>
          </div>
        );

      case 'agents-schedule':
        return <AgentSchedules />;

      case 'documents':
        return <DocumentManager />;

      case 'documents-contracts':
        return <ContractManager />;

      case 'documents-templates':
        return <TemplateLibrary />;

      case 'compliance':
        return <ComplianceDashboard />;

      case 'compliance-legal':
        return <ComplianceDashboard />;

      case 'compliance-audit':
        return <AuditTrail />;

      case 'compliance-training':
        return <ComplianceDashboard />;

      case 'reports':
        return <AdvancedReports />;

      case 'reports-sales':
        return <SalesAnalytics />;

      case 'reports-performance':
        return <AdvancedReports />;

      case 'reports-custom':
        return <AdvancedReports />;

      case 'maintenance':
        return <MaintenanceScheduler />;

      case 'maintenance-workorders':
        return <WorkOrderManager />;

      case 'crm':
        return <ClientPortal />;

      case 'mobile':
        return <MobileFeatures />;

      case 'mobile-app':
        return <MobileApp />;

      case 'mobile-analytics':
        return <AppAnalytics />;

      case 'team':
        return <TeamCollaboration />;

      case 'roles':
        return <RoleManagement />;

      case 'kpi-builder':
        return <KPIDemo />;

      case 'kpi-create':
        return <KPIDemo />;

      case 'kpi-manage':
        return <KPIDemo />;

      case 'kpi-templates':
        return <KPIDemo />;

      case 'inventory':
        return <InventoryManager />;

      case 'inventory-property':
        return <PropertyInventory />;

      case 'inventory-equipment':
        return <EquipmentTracker />;

      case 'inventory-supplies':
        return <SupplyChainManager />;

      case 'data-manager':
        return <DataManager />;
      
      default:
        return (
          <div className="min-h-screen p-8">
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Feature Coming Soon</h3>
              <p className="text-gray-600">This feature is under development and will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  // Show login screen first if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Show loading screen after login
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  // Show main app after authentication and loading
  return (
    <div className="min-h-screen gradient-bg-professional">
      <div className="flex h-screen">
        {/* Sidebar - Always rendered but hidden on mobile */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={setIsMobileSidebarOpen}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
          <Header 
            activeTab={activeTab} 
            userName={currentUser.name}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
          <main className="flex-1 overflow-auto">
            <div className="animate-fade-in w-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      
      {showPropertyModal && selectedProperty && (
      <PropertyModal
        property={selectedProperty}
        isOpen={showPropertyModal}
          onClose={() => {
            setShowPropertyModal(false);
            setSelectedProperty(null);
          }}
      />
      )}
    </div>
  );
}

export default App;