// Role-Based Access Control (RBAC) System for Creo ERP

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'export')[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  department: Department;
  level: 'executive' | 'management' | 'operations' | 'support';
  permissions: Permission[];
  restrictions?: {
    dataAccess: 'all' | 'department' | 'team' | 'own';
    financialLimit?: number;
    approvalRequired?: boolean;
    timeRestrictions?: {
      startTime: string;
      endTime: string;
      daysOfWeek: number[];
    };
  };
}

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  budget?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: Role;
  directReports?: User[];
  manager?: User;
  isActive: boolean;
  lastLogin?: Date;
  permissions: Permission[];
}

// Department Definitions
export const DEPARTMENTS: Department[] = [
  {
    id: 'executive',
    name: 'Executive',
    description: 'Top-level management and decision makers',
    head: 'CEO'
  },
  {
    id: 'sales',
    name: 'Sales & Business Development',
    description: 'Property sales, client acquisition, and business growth',
    head: 'Sales Manager',
    budget: 500000
  },
  {
    id: 'marketing',
    name: 'Marketing & Communications',
    description: 'Brand promotion, lead generation, and market analysis',
    head: 'Marketing Manager',
    budget: 200000
  },
  {
    id: 'operations',
    name: 'Operations & Property Management',
    description: 'Property management, maintenance, and operational efficiency',
    head: 'Operations Manager',
    budget: 300000
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    description: 'Financial management, accounting, and compliance',
    head: 'Finance Manager',
    budget: 150000
  },
  {
    id: 'administration',
    name: 'Administration & Support',
    description: 'Administrative support, HR, and general operations',
    head: 'Admin Manager',
    budget: 100000
  },
  {
    id: 'technology',
    name: 'Technology & Systems',
    description: 'IT support, system maintenance, and digital infrastructure',
    head: 'IT Manager',
    budget: 180000
  }
];

// Permission Definitions by Module
export const PERMISSIONS: Permission[] = [
  // Dashboard Permissions
  {
    id: 'dashboard_view',
    name: 'View Dashboard',
    description: 'Access to main dashboard and overview statistics',
    module: 'dashboard',
    actions: ['read']
  },
  {
    id: 'dashboard_analytics',
    name: 'Advanced Analytics',
    description: 'Access to detailed analytics and business intelligence',
    module: 'dashboard',
    actions: ['read', 'export']
  },

  // Property Management Permissions
  {
    id: 'property_basic',
    name: 'Basic Property Access',
    description: 'View property listings and basic information',
    module: 'properties',
    actions: ['read']
  },
  {
    id: 'property_manage',
    name: 'Property Management',
    description: 'Create, edit, and manage property listings',
    module: 'properties',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'property_admin',
    name: 'Property Administration',
    description: 'Full property management including deletion and approval',
    module: 'properties',
    actions: ['create', 'read', 'update', 'delete', 'approve']
  },
  {
    id: 'property_valuation',
    name: 'Property Valuation',
    description: 'Access to property valuation tools and market analysis',
    module: 'valuations',
    actions: ['read', 'create', 'update']
  },

  // Contact & Lead Management Permissions
  {
    id: 'contact_view',
    name: 'View Contacts',
    description: 'View contact information and communication history',
    module: 'contacts',
    actions: ['read']
  },
  {
    id: 'contact_manage',
    name: 'Contact Management',
    description: 'Create and edit contacts, manage relationships',
    module: 'contacts',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'lead_manage',
    name: 'Lead Management',
    description: 'Manage leads, scoring, and conversion tracking',
    module: 'leads',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'lead_assign',
    name: 'Lead Assignment',
    description: 'Assign leads to team members and manage distribution',
    module: 'leads',
    actions: ['create', 'read', 'update', 'approve']
  },

  // Deal & Sales Permissions
  {
    id: 'deal_view',
    name: 'View Deals',
    description: 'View deal pipeline and basic deal information',
    module: 'deals',
    actions: ['read']
  },
  {
    id: 'deal_manage',
    name: 'Deal Management',
    description: 'Create and manage deals through the sales pipeline',
    module: 'deals',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'deal_approve',
    name: 'Deal Approval',
    description: 'Approve high-value deals and contract terms',
    module: 'deals',
    actions: ['create', 'read', 'update', 'approve']
  },

  // Financial Permissions
  {
    id: 'finance_view',
    name: 'View Financial Data',
    description: 'View basic financial reports and commission information',
    module: 'financial',
    actions: ['read']
  },
  {
    id: 'finance_manage',
    name: 'Financial Management',
    description: 'Manage expenses, commissions, and financial tracking',
    module: 'financial',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'finance_admin',
    name: 'Financial Administration',
    description: 'Full financial access including sensitive data and approvals',
    module: 'financial',
    actions: ['create', 'read', 'update', 'delete', 'approve', 'export']
  },

  // Marketing Permissions
  {
    id: 'marketing_view',
    name: 'View Marketing Data',
    description: 'View marketing campaigns and performance metrics',
    module: 'marketing',
    actions: ['read']
  },
  {
    id: 'marketing_manage',
    name: 'Marketing Management',
    description: 'Create and manage marketing campaigns',
    module: 'marketing',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'marketing_budget',
    name: 'Marketing Budget Control',
    description: 'Manage marketing budgets and approve campaign spending',
    module: 'marketing',
    actions: ['create', 'read', 'update', 'approve']
  },

  // Document Management Permissions
  {
    id: 'document_view',
    name: 'View Documents',
    description: 'View and download documents',
    module: 'documents',
    actions: ['read']
  },
  {
    id: 'document_manage',
    name: 'Document Management',
    description: 'Upload, edit, and organize documents',
    module: 'documents',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'document_admin',
    name: 'Document Administration',
    description: 'Full document control including sensitive documents',
    module: 'documents',
    actions: ['create', 'read', 'update', 'delete', 'approve']
  },

  // Maintenance & Operations Permissions
  {
    id: 'maintenance_view',
    name: 'View Maintenance',
    description: 'View maintenance schedules and task status',
    module: 'maintenance',
    actions: ['read']
  },
  {
    id: 'maintenance_manage',
    name: 'Maintenance Management',
    description: 'Schedule and manage maintenance tasks',
    module: 'maintenance',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'maintenance_approve',
    name: 'Maintenance Approval',
    description: 'Approve maintenance expenses and vendor selection',
    module: 'maintenance',
    actions: ['create', 'read', 'update', 'approve']
  },

  // Team & HR Permissions
  {
    id: 'team_view',
    name: 'View Team',
    description: 'View team member information and basic performance',
    module: 'team',
    actions: ['read']
  },
  {
    id: 'team_manage',
    name: 'Team Management',
    description: 'Manage team assignments and performance tracking',
    module: 'team',
    actions: ['create', 'read', 'update']
  },
  {
    id: 'team_admin',
    name: 'Team Administration',
    description: 'Full team management including hiring and role changes',
    module: 'team',
    actions: ['create', 'read', 'update', 'delete', 'approve']
  },

  // System Administration Permissions
  {
    id: 'system_settings',
    name: 'System Settings',
    description: 'Access to system configuration and settings',
    module: 'system',
    actions: ['read', 'update']
  },
  {
    id: 'system_admin',
    name: 'System Administration',
    description: 'Full system administration and user management',
    module: 'system',
    actions: ['create', 'read', 'update', 'delete', 'approve']
  },

  // Reporting Permissions
  {
    id: 'reports_basic',
    name: 'Basic Reports',
    description: 'Access to standard reports and analytics',
    module: 'reports',
    actions: ['read', 'export']
  },
  {
    id: 'reports_advanced',
    name: 'Advanced Reports',
    description: 'Access to all reports including sensitive financial data',
    module: 'reports',
    actions: ['read', 'export', 'create']
  }
];

// Role Definitions
export const ROLES: Role[] = [
  // Executive Level Roles
  {
    id: 'ceo',
    name: 'Chief Executive Officer',
    description: 'Complete system access and ultimate decision-making authority',
    department: DEPARTMENTS[0], // Executive
    level: 'executive',
    permissions: PERMISSIONS, // All permissions
    restrictions: {
      dataAccess: 'all'
    }
  },
  {
    id: 'coo',
    name: 'Chief Operating Officer',
    description: 'Operations oversight and strategic management',
    department: DEPARTMENTS[0], // Executive
    level: 'executive',
    permissions: PERMISSIONS.filter(p => 
      !['system_admin', 'finance_admin'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'all',
      approvalRequired: true
    }
  },
  {
    id: 'cfo',
    name: 'Chief Financial Officer',
    description: 'Financial oversight and budget management',
    department: DEPARTMENTS[4], // Finance
    level: 'executive',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'dashboard_analytics', 'finance_admin', 'reports_advanced', 'deal_approve'].includes(p.id) ||
      p.module === 'financial'
    ),
    restrictions: {
      dataAccess: 'all',
      financialLimit: 1000000
    }
  },

  // Management Level Roles
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    description: 'Sales team leadership and deal oversight',
    department: DEPARTMENTS[1], // Sales
    level: 'management',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'dashboard_analytics', 'property_manage', 'contact_manage', 
       'lead_assign', 'deal_approve', 'team_manage', 'reports_basic'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department',
      financialLimit: 100000,
      approvalRequired: true
    }
  },
  {
    id: 'marketing_manager',
    name: 'Marketing Manager',
    description: 'Marketing strategy and campaign management',
    department: DEPARTMENTS[2], // Marketing
    level: 'management',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'property_basic', 'contact_view', 'lead_manage', 
       'marketing_budget', 'reports_basic'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department',
      financialLimit: 50000
    }
  },
  {
    id: 'operations_manager',
    name: 'Operations Manager',
    description: 'Property operations and maintenance oversight',
    department: DEPARTMENTS[3], // Operations
    level: 'management',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'property_admin', 'maintenance_approve', 'team_manage', 
       'document_manage', 'reports_basic'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department',
      financialLimit: 75000
    }
  },
  {
    id: 'finance_manager',
    name: 'Finance Manager',
    description: 'Financial operations and compliance management',
    department: DEPARTMENTS[4], // Finance
    level: 'management',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'finance_manage', 'deal_view', 'reports_advanced', 
       'document_admin'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'all',
      financialLimit: 200000
    }
  },

  // Operations Level Roles
  {
    id: 'senior_agent',
    name: 'Senior Real Estate Agent',
    description: 'Experienced agent with team leadership responsibilities',
    department: DEPARTMENTS[1], // Sales
    level: 'operations',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'property_manage', 'contact_manage', 'lead_manage', 
       'deal_manage', 'document_manage', 'marketing_view'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'team',
      financialLimit: 25000
    }
  },
  {
    id: 'real_estate_agent',
    name: 'Real Estate Agent',
    description: 'Licensed agent handling property sales and client relationships',
    department: DEPARTMENTS[1], // Sales
    level: 'operations',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'property_basic', 'contact_manage', 'lead_manage', 
       'deal_manage', 'document_view'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'own',
      financialLimit: 10000
    }
  },
  {
    id: 'property_manager',
    name: 'Property Manager',
    description: 'Property maintenance and tenant relationship management',
    department: DEPARTMENTS[3], // Operations
    level: 'operations',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'property_manage', 'maintenance_manage', 'contact_view', 
       'document_manage'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department',
      financialLimit: 15000
    }
  },
  {
    id: 'lead_specialist',
    name: 'Lead Generation Specialist',
    description: 'Lead qualification and initial client contact',
    department: DEPARTMENTS[2], // Marketing
    level: 'operations',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'contact_manage', 'lead_manage', 'marketing_view'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department'
    }
  },
  {
    id: 'marketing_specialist',
    name: 'Marketing Specialist',
    description: 'Campaign execution and content creation',
    department: DEPARTMENTS[2], // Marketing
    level: 'operations',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'property_basic', 'marketing_manage', 'contact_view'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department',
      financialLimit: 5000
    }
  },

  // Support Level Roles
  {
    id: 'admin_assistant',
    name: 'Administrative Assistant',
    description: 'General administrative support and data management',
    department: DEPARTMENTS[5], // Administration
    level: 'support',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'contact_view', 'document_view', 'maintenance_view'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department',
      timeRestrictions: {
        startTime: '08:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
      }
    }
  },
  {
    id: 'data_entry_clerk',
    name: 'Data Entry Clerk',
    description: 'Data input and basic record maintenance',
    department: DEPARTMENTS[5], // Administration
    level: 'support',
    permissions: PERMISSIONS.filter(p => 
      ['property_basic', 'contact_view'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department',
      timeRestrictions: {
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      }
    }
  },
  {
    id: 'customer_service',
    name: 'Customer Service Representative',
    description: 'Client support and inquiry handling',
    department: DEPARTMENTS[5], // Administration
    level: 'support',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'contact_view', 'property_basic', 'document_view'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department'
    }
  },
  {
    id: 'maintenance_coordinator',
    name: 'Maintenance Coordinator',
    description: 'Maintenance scheduling and vendor coordination',
    department: DEPARTMENTS[3], // Operations
    level: 'support',
    permissions: PERMISSIONS.filter(p => 
      ['dashboard_view', 'property_basic', 'maintenance_manage'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'department',
      financialLimit: 5000
    }
  },
  {
    id: 'it_support',
    name: 'IT Support Specialist',
    description: 'Technical support and system maintenance',
    department: DEPARTMENTS[6], // Technology
    level: 'support',
    permissions: PERMISSIONS.filter(p => 
      ['system_settings', 'team_view'].includes(p.id)
    ),
    restrictions: {
      dataAccess: 'all'
    }
  }
];

// Helper Functions
export const getUserPermissions = (user: User): Permission[] => {
  return user.role.permissions;
};

export const hasPermission = (user: User, permissionId: string, action: string): boolean => {
  const permission = user.permissions.find(p => p.id === permissionId);
  return permission ? permission.actions.includes(action as any) : false;
};

export const canAccessData = (user: User, dataOwnerId: string, departmentId: string): boolean => {
  const { dataAccess } = user.role.restrictions || {};
  
  switch (dataAccess) {
    case 'all':
      return true;
    case 'department':
      return user.department.id === departmentId;
    case 'team':
      return user.directReports?.some(report => report.id === dataOwnerId) || user.id === dataOwnerId;
    case 'own':
      return user.id === dataOwnerId;
    default:
      return false;
  }
};

export const getApprovalRequired = (user: User, amount?: number): boolean => {
  const { approvalRequired, financialLimit } = user.role.restrictions || {};
  
  if (approvalRequired) return true;
  if (amount && financialLimit && amount > financialLimit) return true;
  
  return false;
};

export const isWithinWorkingHours = (user: User): boolean => {
  const { timeRestrictions } = user.role.restrictions || {};
  
  if (!timeRestrictions) return true;
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const startTime = parseInt(timeRestrictions.startTime.replace(':', ''));
  const endTime = parseInt(timeRestrictions.endTime.replace(':', ''));
  
  return timeRestrictions.daysOfWeek.includes(currentDay) && 
         currentTime >= startTime && 
         currentTime <= endTime;
}; 