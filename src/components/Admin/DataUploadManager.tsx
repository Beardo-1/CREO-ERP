import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Download,
  Users,
  Database,
  Plus,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Edit,
  Trash2,
  Shield,
  Building,
  Mail,
  Phone,
  Calendar,
  Activity,
  BarChart3,
  RefreshCw,
  Filter,
  Search,
  Save,
  UserPlus,
  Settings
} from 'lucide-react';
import { uploadService, UploadProgress, DataUploadOptions } from '../../services/UploadService';
import { authService } from '../../services/AuthService';
import { User, Role, Department, ROLES, DEPARTMENTS } from '../../types/roles';

interface UserFormData {
  name: string;
  email: string;
  departmentId: string;
  roleId: string;
  isActive: boolean;
}

export function DataUploadManager() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadOptions, setUploadOptions] = useState<DataUploadOptions>({
    dataType: 'properties',
    validateData: true,
    overwriteExisting: false,
    batchSize: 50
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: '',
    email: '',
    departmentId: '',
    roleId: '',
    isActive: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = authService.getCurrentUser();
  const canManageUsers = currentUser && authService.hasPermission('system_admin', 'create');

  useEffect(() => {
    // Subscribe to upload progress updates
    const handleUploadUpdate = (updatedUploads: UploadProgress[]) => {
      setUploads(updatedUploads);
    };

    uploadService.subscribeToUploads(handleUploadUpdate);
    setUploads(uploadService.getActiveUploads());

    // Load users
    loadUsers();

    return () => {
      uploadService.unsubscribeFromUploads(handleUploadUpdate);
    };
  }, []);

  const loadUsers = () => {
    const allUsers = authService.getUsers();
    setUsers(allUsers);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      // Success: Please select files to upload
      return;
    }

    setIsUploading(true);

    try {
      const files = Array.from(selectedFiles);
      const results = await uploadService.uploadMultipleFiles(files, uploadOptions);
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      
      if (errorCount === 0) {
        // Success: Successfully uploaded ${successCount} files!
      } else {
        // Success: Uploaded ${successCount} files successfully, ${errorCount} failed.
      }
      
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async (dataType: string, format: 'json' | 'csv') => {
    try {
      const blob = await uploadService.exportData(dataType, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}-export-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateUser = async () => {
    if (!canManageUsers) {
      // Success: Insufficient permissions
      return;
    }

    try {
      const department = DEPARTMENTS.find(d => d.id === userFormData.departmentId);
      const role = ROLES.find(r => r.id === userFormData.roleId);

      if (!department || !role) {
        // Success: Please select valid department and role
        return;
      }

      const userData = {
        name: userFormData.name,
        email: userFormData.email,
        department,
        role,
        isActive: userFormData.isActive
      };

      const result = await authService.createUser(userData);
      
      if (result.success) {
        // Success: User created successfully!
        setShowUserModal(false);
        resetUserForm();
        loadUsers();
      } else {
        // Success: Failed to create user: ${result.message}
      }
    } catch (error) {
      alert(`Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateUser = async () => {
    if (!canManageUsers || !editingUser) {
      // Success: Insufficient permissions
      return;
    }

    try {
      const department = DEPARTMENTS.find(d => d.id === userFormData.departmentId);
      const role = ROLES.find(r => r.id === userFormData.roleId);

      if (!department || !role) {
        // Success: Please select valid department and role
        return;
      }

      const updates = {
        name: userFormData.name,
        email: userFormData.email,
        department,
        role,
        isActive: userFormData.isActive,
        permissions: role.permissions
      };

      const result = await authService.updateUser(editingUser.id, updates);
      
      if (result.success) {
        // Success: User updated successfully!
        setShowUserModal(false);
        resetUserForm();
        loadUsers();
      } else {
        // Success: Failed to update user: ${result.message}
      }
    } catch (error) {
      alert(`Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      departmentId: user.department.id,
      roleId: user.role.id,
      isActive: user.isActive
    });
    setShowUserModal(true);
  };

  const resetUserForm = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      departmentId: '',
      roleId: '',
      isActive: true
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || user.department.id === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'uploading': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-orange-600 bg-orange-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to access this feature.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data & User Management</h1>
          <p className="text-gray-600">Upload data files and manage user accounts with role-based access</p>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Data Upload
              </button>
              {canManageUsers && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  User Management
                </button>
              )}
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Statistics
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'upload' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Data Files</h2>
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Drag and drop your files here, or click to browse</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Choose Files
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && canManageUsers && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <button
                onClick={() => {
                  resetUserForm();
                  setShowUserModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">Create and manage user accounts with department-wise access control.</p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Uploads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {uploads.filter(u => u.status === 'uploading' || u.status === 'processing').length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{DEPARTMENTS.length}</p>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{ROLES.length}</p>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUserModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={userFormData.departmentId}
                      onChange={(e) => setUserFormData({...userFormData, departmentId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={userFormData.roleId}
                      onChange={(e) => setUserFormData({...userFormData, roleId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Role</option>
                      {ROLES.filter(role => 
                        !userFormData.departmentId || role.department.id === userFormData.departmentId
                      ).map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={userFormData.isActive}
                      onChange={(e) => setUserFormData({...userFormData, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active User
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingUser ? handleUpdateUser : handleCreateUser}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    {editingUser ? 'Update' : 'Create'} User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 