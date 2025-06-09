import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
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
import { RoleManagement } from './components/Admin/RoleManagement';
import { Login } from './components/Auth/Login';
import { LocationAnalytics } from './components/Analytics/LocationAnalytics';
import { ComplianceDashboard } from './components/Compliance/ComplianceDashboard';
import { AdvancedReports } from './components/Reports/AdvancedReports';
import { TaskManagement } from './components/Tasks/TaskManagement';
import { KPIBuilder } from './components/KPI/KPIBuilder';
import { KPIDisplay } from './components/KPI/KPIDisplay';
import { KPIDemo } from './components/KPI/KPIDemo';
import { mockProperties, mockContacts, mockDeals, mockAgents } from './data/mockData';
import { Property, Contact, Deal, Agent } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          <div className="min-h-screen p-8">
            <LiveStatsCards />
            
            {/* Custom KPIs Section */}
            <div className="mb-8">
              <KPIDisplay module="dashboard" className="mb-8" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <ProfileCard 
                name={currentUser.name}
                role={currentUser.role}
                earnings={currentUser.earnings}
              />
              <ProgressCard />
              <TimeTracker />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <CalendarWidget />
              <TaskProgress />
              <LiveActivityFeed />
            </div>
          </div>
        );
      
      case 'properties':
        return (
          <div className="min-h-screen p-8">
            {/* Custom KPIs for Properties */}
            <KPIDisplay module="properties" className="mb-8" />
            
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 drop-shadow-sm">Property Portfolio</h3>
                <p className="text-gray-700 drop-shadow-sm">{mockProperties.length} properties in your portfolio</p>
              </div>
              <div className="flex space-x-4">
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Types</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Land</option>
                </select>
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Status</option>
                  <option>Available</option>
                  <option>Under Contract</option>
                  <option>Sold</option>
                </select>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
                  Add Property
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={handlePropertyClick}
                />
              ))}
            </div>
          </div>
        );
      
      case 'contacts':
        return (
          <div className="min-h-screen p-8">
                          <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 drop-shadow-sm">Contact Management</h3>
                <p className="text-gray-700 drop-shadow-sm">{mockContacts.length} contacts in your network</p>
              </div>
              <div className="flex space-x-4">
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Types</option>
                  <option>Lead</option>
                  <option>Client</option>
                  <option>Vendor</option>
                  <option>Agent</option>
                </select>
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Status</option>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Converted</option>
                </select>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
                  Add Contact
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onClick={handleContactClick}
                />
              ))}
            </div>
          </div>
        );
      
      case 'deals':
        return (
          <div className="min-h-screen p-8">
                          <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 drop-shadow-sm">Deal Pipeline</h3>
                <p className="text-gray-700 drop-shadow-sm">{mockDeals.length} active deals in progress</p>
              </div>
              <div className="flex space-x-4">
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Stages</option>
                  <option>Lead</option>
                  <option>Qualified</option>
                  <option>Proposal</option>
                  <option>Contract</option>
                  <option>Closing</option>
                </select>
                <select className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white">
                  <option>All Types</option>
                  <option>Sale</option>
                  <option>Purchase</option>
                  <option>Rental</option>
                </select>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
                  Add Deal
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onClick={handleDealClick}
                />
              ))}
            </div>
          </div>
        );

      case 'leads':
        return <LeadManagement />;

      case 'marketing':
        return <MarketingDashboard />;

      case 'locations':
        return <LocationAnalytics />;

      case 'valuations':
        return <PropertyValuation />;

      case 'media':
        return <MediaGallery />;

      case 'tasks':
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

      case 'financial':
        return <FinancialDashboard />;

      case 'agents':
        return (
          <div className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Team Management</h3>
                <p className="text-gray-600">{mockAgents.length} team members</p>
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
              {mockAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={handleAgentClick}
                />
              ))}
            </div>
          </div>
        );

      case 'documents':
        return <DocumentManager />;

      case 'compliance':
        return <ComplianceDashboard />;

      case 'reports':
        return <AdvancedReports />;

      case 'maintenance':
        return <MaintenanceScheduler />;

      case 'crm':
        return <ClientPortal />;

      case 'mobile':
        return <MobileFeatures />;

      case 'team':
        return <TeamCollaboration />;

      case 'roles':
        return <RoleManagement />;

      case 'kpi-builder':
        return <KPIDemo />;
      
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
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header activeTab={activeTab} userName={currentUser.name} />
          <main className="flex-1 overflow-auto">
            <div className="animate-fade-in">
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