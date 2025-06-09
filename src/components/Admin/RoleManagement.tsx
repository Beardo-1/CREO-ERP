import React, { useState } from 'react';
import { Shield, Building, Users, DollarSign, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'executive', name: 'Executive', budget: 1000000, roles: 3, users: 3 },
  { id: 'sales', name: 'Sales & Business Development', budget: 500000, roles: 3, users: 12 },
  { id: 'marketing', name: 'Marketing & Communications', budget: 200000, roles: 3, users: 5 },
  { id: 'operations', name: 'Operations & Property Management', budget: 300000, roles: 2, users: 8 },
  { id: 'finance', name: 'Finance & Accounting', budget: 150000, roles: 2, users: 4 },
  { id: 'administration', name: 'Administration & Support', budget: 100000, roles: 3, users: 6 }
];

const SAMPLE_ROLES = [
  {
    id: 'ceo',
    name: 'Chief Executive Officer',
    description: 'Complete system access and ultimate decision-making authority',
    department: 'executive',
    level: 'executive',
    permissions: 25,
    users: 1,
    restrictions: { dataAccess: 'all', financialLimit: null }
  },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    description: 'Sales team leadership and deal oversight',
    department: 'sales',
    level: 'management',
    permissions: 8,
    users: 2,
    restrictions: { dataAccess: 'department', financialLimit: 100000, approvalRequired: true }
  },
  {
    id: 'real_estate_agent',
    name: 'Real Estate Agent',
    description: 'Licensed agent handling property sales and client relationships',
    department: 'sales',
    level: 'operations',
    permissions: 6,
    users: 8,
    restrictions: { dataAccess: 'own', financialLimit: 10000 }
  },
  {
    id: 'admin_assistant',
    name: 'Administrative Assistant',
    description: 'General administrative support and data management',
    department: 'administration',
    level: 'support',
    permissions: 4,
    users: 3,
    restrictions: { 
      dataAccess: 'department', 
      timeRestrictions: { startTime: '08:00', endTime: '18:00' }
    }
  }
];

export function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const getLevelColor = (level: string) => {
    const colors = {
      executive: 'bg-red-100 text-red-800 border-red-200',
      management: 'bg-purple-100 text-purple-800 border-purple-200',
      operations: 'bg-blue-100 text-blue-800 border-blue-200',
      support: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Role & Access Management</h1>
        <p className="text-gray-600">Manage user roles, permissions, and access control across departments</p>
      </div>
      
      {/* Department Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEPARTMENTS.map(department => (
            <div key={department.id} className="card-gradient rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{department.name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Roles:</span>
                  <span className="font-medium">{department.roles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-medium">{department.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">${department.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Hierarchy */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Hierarchy</h2>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-red-900">Executive Level</h3>
              <p className="text-gray-600">CEO, COO, CFO - Complete system access and strategic oversight</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-purple-900">Management Level</h3>
              <p className="text-gray-600">Department managers - Team oversight, approvals, and budget control</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-900">Operations Level</h3>
              <p className="text-gray-600">Agents and specialists - Day-to-day operations and client interaction</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-green-900">Support Level</h3>
              <p className="text-gray-600">Administrative staff - Support functions and data management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Roles */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_ROLES.map(role => (
            <div 
              key={role.id}
              className="card-gradient rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedRole(role)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-600">{DEPARTMENTS.find(d => d.id === role.department)?.name}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(role.level)}`}>
                  {role.level.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-4">{role.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{role.permissions}</p>
                  <p className="text-xs text-gray-600">Permissions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{role.users}</p>
                  <p className="text-xs text-gray-600">Users</p>
                </div>
              </div>

              {role.restrictions && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Restrictions:</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      Data: {role.restrictions.dataAccess}
                    </span>
                    {role.restrictions.financialLimit && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        Limit: ${role.restrictions.financialLimit.toLocaleString()}
                      </span>
                    )}
                    {role.restrictions.approvalRequired && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        Approval Required
                      </span>
                    )}
                    {role.restrictions.timeRestrictions && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        Time Restricted
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Role Details Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-orange-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedRole.name}</h2>
                    <p className="text-gray-600">{DEPARTMENTS.find(d => d.id === selectedRole.department)?.name} Department</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Access Level</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedRole.level)}`}>
                    {selectedRole.level.toUpperCase()}
                  </span>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Permissions</h3>
                  <p className="text-2xl font-bold text-green-600">{selectedRole.permissions}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Data Access</h3>
                  <p className="text-purple-600 font-medium">
                    {selectedRole.restrictions?.dataAccess || 'All'}
                  </p>
                </div>
              </div>

              {selectedRole.restrictions && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-yellow-900 mb-3">Role Restrictions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRole.restrictions.financialLimit && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-800">
                          Financial Limit: ${selectedRole.restrictions.financialLimit.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedRole.restrictions.approvalRequired && (
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-800">Approval Required for Actions</span>
                      </div>
                    )}
                    {selectedRole.restrictions.timeRestrictions && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-800">
                          Working Hours: {selectedRole.restrictions.timeRestrictions.startTime} - {selectedRole.restrictions.timeRestrictions.endTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sample Permissions for this Role</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Dashboard Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Property Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Contact Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-gray-400">System Administration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
