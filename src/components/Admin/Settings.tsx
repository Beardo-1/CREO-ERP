import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  Key, 
  Mail, 
  Smartphone, 
  Monitor, 
  Clock, 
  Save, 
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

interface SettingsCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    desktop: boolean;
    dealUpdates: boolean;
    leadNotifications: boolean;
    taskReminders: boolean;
    systemAlerts: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAlerts: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    colorScheme: string;
    sidebarCollapsed: boolean;
    compactMode: boolean;
  };
  system: {
    autoSave: boolean;
    backupFrequency: string;
    dataRetention: number;
    performanceMode: boolean;
  };
}

export function Settings() {
  const [activeCategory, setActiveCategory] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: 'Emma Wilson',
      email: 'emma.wilson@creo.com',
      phone: '+1 (555) 123-4567',
      role: 'Real Estate Agent',
      avatar: '',
      timezone: 'America/New_York',
      language: 'en'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      desktop: true,
      dealUpdates: true,
      leadNotifications: true,
      taskReminders: true,
      systemAlerts: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAlerts: true
    },
    appearance: {
      theme: 'light',
      colorScheme: 'blue',
      sidebarCollapsed: false,
      compactMode: false
    },
    system: {
      autoSave: true,
      backupFrequency: 'daily',
      dataRetention: 365,
      performanceMode: false
    }
  });

  const categories: SettingsCategory[] = [
    {
      id: 'profile',
      name: 'Profile',
      icon: User,
      description: 'Personal information and account details'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Email, push, and alert preferences'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Password, 2FA, and security settings'
    },
    {
      id: 'appearance',
      name: 'Appearance',
      icon: Palette,
      description: 'Theme, colors, and display options'
    },
    {
      id: 'system',
      name: 'System',
      icon: Database,
      description: 'Data, backup, and performance settings'
    }
  ];

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for persistence
      localStorage.setItem('creo_user_settings', JSON.stringify(settings));
      
      setHasChanges(false);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = '✓ Settings saved successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={settings.profile.role}
            onChange={(e) => handleSettingChange('profile', 'role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Real Estate Agent">Real Estate Agent</option>
            <option value="Broker">Broker</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.profile.timezone}
            onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.profile.language}
            onChange={(e) => handleSettingChange('profile', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Delivery Methods</h3>
          {[
            { key: 'email', label: 'Email Notifications', icon: Mail },
            { key: 'push', label: 'Push Notifications', icon: Smartphone },
            { key: 'desktop', label: 'Desktop Notifications', icon: Monitor },
            { key: 'sms', label: 'SMS Notifications', icon: Smartphone }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                  onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Notification Types</h3>
          {[
            { key: 'dealUpdates', label: 'Deal Updates' },
            { key: 'leadNotifications', label: 'New Leads' },
            { key: 'taskReminders', label: 'Task Reminders' },
            { key: 'systemAlerts', label: 'System Alerts' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-900">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                  onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Security Recommendations</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Enable two-factor authentication and set strong password policies for better security.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Login Alerts</h3>
              <p className="text-sm text-gray-600">Get notified of new login attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.loginAlerts}
                onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
            <select
              value={settings.security.passwordExpiry}
              onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
          <select
            value={settings.appearance.colorScheme}
            onChange={(e) => handleSettingChange('appearance', 'colorScheme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Collapsed Sidebar</h3>
            <p className="text-sm text-gray-600">Start with sidebar collapsed by default</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.appearance.sidebarCollapsed}
              onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Compact Mode</h3>
            <p className="text-sm text-gray-600">Reduce spacing for more content on screen</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.appearance.compactMode}
              onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">System Performance</h3>
            <p className="text-sm text-blue-700 mt-1">
              These settings affect system performance and data management.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Auto-Save</h3>
              <p className="text-sm text-gray-600">Automatically save changes as you work</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.system.autoSave}
                onChange={(e) => handleSettingChange('system', 'autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Performance Mode</h3>
              <p className="text-sm text-gray-600">Optimize for better performance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.system.performanceMode}
                onChange={(e) => handleSettingChange('system', 'performanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
            <select
              value={settings.system.backupFrequency}
              onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
            <select
              value={settings.system.dataRetention}
              onChange={(e) => handleSettingChange('system', 'dataRetention', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={1095}>3 years</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'appearance': return renderAppearanceSettings();
      case 'system': return renderSystemSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and system configuration</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className={`w-5 h-5 ${
                        activeCategory === category.id ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {categories.find(c => c.id === activeCategory)?.description}
                </p>
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 