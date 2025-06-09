import React, { useState, useEffect, useRef } from 'react';
import { CreoLogo } from '../Logo/CreoLogo';
import {
  Home,
  Building, 
  Users, 
  Handshake, 
  CheckSquare, 
  Calendar,
  FileText,
  BarChart3,
  DollarSign,
  UserCheck,
  Settings,
  LogOut,
  MapPin,
  Calculator,
  Mail,
  Phone,
  Camera,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Bell,
  Briefcase,
  TrendingUp,
  Database,
  Menu,
  X,
  Plus,
  Filter,
  Star,
  Clock,
  AlertCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
  category: string;
  subItems?: SubMenuItem[];
  priority?: 'high' | 'medium' | 'low';
  lastUsed?: Date;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

const menuCategories = [
  {
    id: 'core',
    label: 'Core Business',
    icon: Briefcase,
    color: 'blue',
    items: [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: Home, 
        badge: 0, 
        category: 'core',
        priority: 'high' as const,
        subItems: [
          { id: 'dashboard-overview', label: 'Overview', icon: BarChart3, badge: 0 },
          { id: 'dashboard-analytics', label: 'Analytics', icon: TrendingUp, badge: 2 },
          { id: 'dashboard-reports', label: 'Quick Reports', icon: FileText, badge: 0 }
        ]
      },
      { 
        id: 'properties', 
        label: 'Properties', 
        icon: Building, 
        badge: 12, 
        category: 'core',
        priority: 'high' as const,
        subItems: [
          { id: 'properties-listings', label: 'Active Listings', icon: Building, badge: 8 },
          { id: 'properties-sold', label: 'Sold Properties', icon: CheckSquare, badge: 0 },
          { id: 'properties-pending', label: 'Pending Sales', icon: Clock, badge: 4 }
        ]
      },
      { 
        id: 'contacts', 
        label: 'Contacts', 
        icon: Users, 
        badge: 5, 
        category: 'core',
        priority: 'high' as const,
        subItems: [
          { id: 'contacts-clients', label: 'Clients', icon: Users, badge: 3 },
          { id: 'contacts-prospects', label: 'Prospects', icon: Star, badge: 2 },
          { id: 'contacts-vendors', label: 'Vendors', icon: Briefcase, badge: 0 }
        ]
      },
      { 
        id: 'deals', 
        label: 'Deals', 
        icon: Handshake, 
        badge: 3, 
        category: 'core',
        priority: 'high' as const,
        subItems: [
          { id: 'deals-active', label: 'Active Deals', icon: Handshake, badge: 3 },
          { id: 'deals-pipeline', label: 'Pipeline', icon: TrendingUp, badge: 0 },
          { id: 'deals-closed', label: 'Closed Deals', icon: CheckSquare, badge: 0 }
        ]
      },
    ]
  },
  {
    id: 'sales',
    label: 'Sales & Marketing',
    icon: TrendingUp,
    color: 'green',
    items: [
      { 
        id: 'leads', 
        label: 'Lead Management', 
        icon: Phone, 
        badge: 8, 
        category: 'sales',
        priority: 'high' as const,
        subItems: [
          { id: 'leads-new', label: 'New Leads', icon: Plus, badge: 5 },
          { id: 'leads-qualified', label: 'Qualified', icon: CheckSquare, badge: 3 },
          { id: 'leads-follow-up', label: 'Follow-up', icon: Clock, badge: 0 }
        ]
      },
      { 
        id: 'marketing', 
        label: 'Marketing', 
        icon: Mail, 
        badge: 2, 
        category: 'sales',
        priority: 'medium' as const,
        subItems: [
          { id: 'marketing-campaigns', label: 'Campaigns', icon: Mail, badge: 1 },
          { id: 'marketing-social', label: 'Social Media', icon: Star, badge: 1 },
          { id: 'marketing-analytics', label: 'Analytics', icon: BarChart3, badge: 0 }
        ]
      },
      { 
        id: 'valuations', 
        label: 'Valuations', 
        icon: Calculator, 
        badge: 0, 
        category: 'sales',
        priority: 'medium' as const
      },
      { 
        id: 'media', 
        label: 'Media Gallery', 
        icon: Camera, 
        badge: 0, 
        category: 'sales',
        priority: 'low' as const
      },
    ]
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: CheckSquare,
    color: 'purple',
    items: [
      { 
        id: 'tasks', 
        label: 'Tasks', 
        icon: CheckSquare, 
        badge: 7, 
        category: 'operations',
        priority: 'high' as const,
        subItems: [
          { id: 'tasks-today', label: 'Due Today', icon: AlertCircle, badge: 3 },
          { id: 'tasks-upcoming', label: 'Upcoming', icon: Clock, badge: 4 },
          { id: 'tasks-completed', label: 'Completed', icon: CheckSquare, badge: 0 }
        ]
      },
      { 
        id: 'calendar', 
        label: 'Calendar', 
        icon: Calendar, 
        badge: 4, 
        category: 'operations',
        priority: 'high' as const,
        subItems: [
          { id: 'calendar-today', label: 'Today', icon: Calendar, badge: 2 },
          { id: 'calendar-week', label: 'This Week', icon: Calendar, badge: 2 },
          { id: 'calendar-showings', label: 'Showings', icon: Building, badge: 0 }
        ]
      },
      { 
        id: 'locations', 
        label: 'Locations', 
        icon: MapPin, 
        badge: 0, 
        category: 'operations',
        priority: 'medium' as const
      },
      { 
        id: 'agents', 
        label: 'Team', 
        icon: UserCheck, 
        badge: 1, 
        category: 'operations',
        priority: 'medium' as const,
        subItems: [
          { id: 'agents-active', label: 'Active Agents', icon: UserCheck, badge: 0 },
          { id: 'agents-performance', label: 'Performance', icon: TrendingUp, badge: 1 },
          { id: 'agents-schedule', label: 'Schedules', icon: Calendar, badge: 0 }
        ]
      },
    ]
  },
  {
    id: 'management',
    label: 'Management',
    icon: Database,
    color: 'amber',
    items: [
      { 
        id: 'financial', 
        label: 'Financial', 
        icon: DollarSign, 
        badge: 0, 
        category: 'management',
        priority: 'high' as const,
        subItems: [
          { id: 'financial-commissions', label: 'Commissions', icon: DollarSign, badge: 0 },
          { id: 'financial-expenses', label: 'Expenses', icon: FileText, badge: 0 },
          { id: 'financial-reports', label: 'Reports', icon: BarChart3, badge: 0 }
        ]
      },
      { 
        id: 'documents', 
        label: 'Documents', 
        icon: FileText, 
        badge: 0, 
        category: 'management',
        priority: 'medium' as const
      },
      { 
        id: 'compliance', 
        label: 'Compliance', 
        icon: Shield, 
        badge: 2, 
        category: 'management',
        priority: 'high' as const,
        subItems: [
          { id: 'compliance-legal', label: 'Legal Docs', icon: Shield, badge: 1 },
          { id: 'compliance-audit', label: 'Audit Trail', icon: FileText, badge: 1 },
          { id: 'compliance-training', label: 'Training', icon: Users, badge: 0 }
        ]
      },
      { 
        id: 'reports', 
        label: 'Reports', 
        icon: BarChart3, 
        badge: 0, 
        category: 'management',
        priority: 'medium' as const,
        subItems: [
          { id: 'reports-sales', label: 'Sales Reports', icon: TrendingUp, badge: 0 },
          { id: 'reports-performance', label: 'Performance', icon: BarChart3, badge: 0 },
          { id: 'reports-custom', label: 'Custom Reports', icon: Settings, badge: 0 }
        ]
      },
      { 
        id: 'kpi-builder', 
        label: 'KPI Builder', 
        icon: TrendingUp, 
        badge: 0, 
        category: 'management',
        priority: 'high' as const,
        subItems: [
          { id: 'kpi-create', label: 'Create KPI', icon: Plus, badge: 0 },
          { id: 'kpi-manage', label: 'Manage KPIs', icon: Settings, badge: 0 },
          { id: 'kpi-templates', label: 'Templates', icon: FileText, badge: 0 }
        ]
      },
    ]
  }
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['core']);
  const [expandedSubMenus, setExpandedSubMenus] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Get all menu items for search
  const allMenuItems = menuCategories.flatMap(category => category.items);

  // Filter items based on search and priority
  const filteredItems = searchTerm 
    ? allMenuItems.filter(item => {
        const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
        return matchesSearch && matchesPriority;
      })
    : [];

  // Mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      } else {
        setIsCollapsed(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (window.innerWidth < 1024) {
          setIsMobileOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubMenu = (itemId: string) => {
    setExpandedSubMenus(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getTotalBadgeCount = () => {
    return allMenuItems.reduce((total, item) => total + (item.badge || 0), 0);
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      amber: 'text-amber-600 bg-amber-100'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all duration-200"
      aria-label="Toggle menu"
    >
      {isMobileOpen ? (
        <X className="w-6 h-6 text-gray-700" />
      ) : (
        <Menu className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div 
        ref={sidebarRef}
        className={`
          ${isCollapsed ? 'w-20' : 'w-80'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative top-0 left-0 h-screen flex flex-col z-50
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Glass morphism background */}
        <div className="absolute inset-0 glass-effect backdrop-blur-xl border-r border-white/20"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <CreoLogo size={36} color="white" />
          </div>
          <div>
                  <h1 className="text-2xl font-bold text-gray-800">Creo ERP</h1>
                  <p className="text-gray-600 text-sm">Real Estate Management</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110 group"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-orange-600" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-orange-600" />
                )}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          {!isCollapsed && (
            <div className="p-4 border-b border-white/10 space-y-3">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 transition-all duration-200 text-gray-700 placeholder-gray-500 text-sm"
                  aria-label="Search menu items"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="flex-1 px-3 py-2 bg-white/20 border border-white/20 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-orange-500/50"
                  aria-label="Filter by priority"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
        </div>
      </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar" role="navigation">
            {searchTerm ? (
              // Search Results
              <div className="px-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Search Results ({filteredItems.length})
                </h3>
                {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setSearchTerm('');
                        setIsMobileOpen(false);
                      }}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onFocus={() => setFocusedItem(item.id)}
                      onBlur={() => setFocusedItem(null)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 mb-1 rounded-xl text-left transition-all duration-200 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 shadow-lg border border-orange-500/30 scale-105' 
                          : 'text-gray-700 hover:bg-white/30 hover:text-orange-600 focus:bg-white/30 focus:text-orange-600'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-200 ${
                        isActive ? 'text-orange-600' : 'text-gray-600 group-hover:text-orange-600 group-focus:text-orange-600'
                      } ${hoveredItem === item.id || focusedItem === item.id ? 'scale-110' : ''}`} />
                      <span className="font-medium text-sm flex-1">{item.label}</span>
                      {item.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      )}
                      {item.badge && item.badge > 0 && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Categorized Menu
              <div className="space-y-2">
                {menuCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  const isExpanded = expandedCategories.includes(category.id);
                  const categoryBadgeCount = category.items.reduce((total, item) => total + (item.badge || 0), 0);
                  
                  return (
                    <div key={category.id} className="px-4">
                      {!isCollapsed && (
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between px-3 py-2 mb-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-white/20 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          aria-expanded={isExpanded}
                          aria-controls={`category-${category.id}`}
                        >
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                              {category.label}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${getCategoryColor(category.color).split(' ')[1]}`}></span>
                            {categoryBadgeCount > 0 && (
                              <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {categoryBadgeCount}
                              </span>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          ) : (
                            <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      )}
                      
                      <div 
                        id={`category-${category.id}`}
                        className={`space-y-1 transition-all duration-300 ${
                          isCollapsed ? '' : isExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
                        }`}>
                        {category.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          const hasSubMenu = item.subItems && item.subItems.length > 0;
                          const isSubMenuExpanded = expandedSubMenus.includes(item.id);
                          
                          return (
                            <div key={item.id} className="relative group">
                              <div className="flex items-center">
                                <button
                                  onClick={() => {
                                    onTabChange(item.id);
                                    setIsMobileOpen(false);
                                  }}
                                  onMouseEnter={() => setHoveredItem(item.id)}
                                  onMouseLeave={() => setHoveredItem(null)}
                                  onFocus={() => setFocusedItem(item.id)}
                                  onBlur={() => setFocusedItem(null)}
                                  className={`flex-1 flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                isActive 
                                      ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 shadow-lg border border-orange-500/30 scale-105' 
                                      : 'text-gray-700 hover:bg-white/30 hover:text-orange-600 focus:bg-white/30 focus:text-orange-600 hover:scale-105'
                                  }`}
                                  aria-current={isActive ? 'page' : undefined}
                                  aria-describedby={item.badge ? `badge-${item.id}` : undefined}
                                >
                                  <Icon className={`w-5 h-5 transition-all duration-200 ${
                                    isActive ? 'text-orange-600' : 'text-gray-600 group-hover:text-orange-600'
                                  } ${hoveredItem === item.id || focusedItem === item.id ? 'scale-110 rotate-12' : ''}`} />
                                  
                                  {!isCollapsed && (
                                    <>
                                      <span className="font-medium text-sm flex-1">{item.label}</span>
                                      <div className="flex items-center space-x-2">
                                        {item.priority && (
                                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
                                            {item.priority.charAt(0).toUpperCase()}
                                          </span>
                                        )}
                                        {item.badge && item.badge > 0 && (
                                          <span 
                                            id={`badge-${item.id}`}
                                            className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-lg"
                                            aria-label={`${item.badge} notifications`}
                                          >
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </button>
                                
                                {hasSubMenu && !isCollapsed && (
                                  <button
                                    onClick={() => toggleSubMenu(item.id)}
                                    className="p-2 ml-1 rounded-lg hover:bg-white/20 transition-all duration-200"
                                    aria-expanded={isSubMenuExpanded}
                                    aria-label={`Toggle ${item.label} submenu`}
                                  >
                                    {isSubMenuExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                )}
                              </div>
                              
                              {/* Sub-menu */}
                              {hasSubMenu && !isCollapsed && (
                                <div className={`ml-8 mt-1 space-y-1 transition-all duration-300 ${
                                  isSubMenuExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
                                }`}>
                                  {item.subItems?.map((subItem) => {
                                    const SubIcon = subItem.icon;
                                    return (
                                      <button
                                        key={subItem.id}
                                        onClick={() => {
                                          onTabChange(subItem.id);
                                          setIsMobileOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-white/20 transition-all duration-200 text-sm"
                                      >
                                        <SubIcon className="w-4 h-4" />
                                        <span className="flex-1">{subItem.label}</span>
                                        {subItem.badge && subItem.badge > 0 && (
                                          <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {subItem.badge}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              
                              {/* Tooltip for collapsed state */}
                              {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
                                    <div className="font-medium">{item.label}</div>
                                    {item.badge && item.badge > 0 && (
                                      <div className="text-xs text-orange-300 mt-1">
                                        {item.badge} notifications
                                      </div>
                                    )}
                                    {item.priority && (
                                      <div className="text-xs text-gray-300 mt-1">
                                        Priority: {item.priority}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            {/* Notification Summary */}
            {!isCollapsed && getTotalBadgeCount() > 0 && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-orange-600 animate-pulse" />
                  <span className="text-sm text-orange-700 font-medium">
                    {getTotalBadgeCount()} pending notifications
                  </span>
                </div>
              </div>
            )}
            
            <button 
              className={`w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-orange-600 hover:bg-white/20 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              {!isCollapsed && <span className="font-medium">Settings</span>}
            </button>
            
            <button 
              className={`w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
      </div>
    </>
  );
}