import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Database,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Server
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Ridra Bus Tracking',
    supportEmail: 'support@ridra.rw',
    maintenanceMode: false,
  });

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('System settings updated successfully');
    } catch (error) {
      toast.error('Failed to update system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseBackup = async () => {
    setLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Database backup completed successfully');
    } catch (error) {
      toast.error('Database backup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-section">
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Manage your account and system preferences</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-2 admin-mb-8">
        {/* Profile Settings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.primary + '20' }}
              >
                <User size={20} style={{ color: theme.primary }} />
              </div>
              <div>
                <h3 className="admin-card-title">Profile Settings</h3>
                <p className="admin-card-subtitle">Update your personal information</p>
              </div>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="admin-space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="admin-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="admin-input"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="admin-btn admin-btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Save size={16} />
                    Save Profile
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>



        {/* System Settings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.success + '20' }}
              >
                <SettingsIcon size={20} style={{ color: theme.success }} />
              </div>
              <div>
                <h3 className="admin-card-title">System Settings</h3>
                <p className="admin-card-subtitle">Configure system-wide preferences</p>
              </div>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="admin-space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Site Name
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={systemSettings.siteName}
                  onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                  placeholder="Enter site name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Support Email
                </label>
                <input
                  type="email"
                  className="admin-input"
                  value={systemSettings.supportEmail}
                  onChange={(e) => setSystemSettings({ ...systemSettings, supportEmail: e.target.value })}
                  placeholder="Enter support email"
                />
              </div>



              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.background }}>
                <div>
                  <p className="font-medium flex items-center gap-2" style={{ color: theme.text }}>
                    <AlertCircle size={16} style={{ color: theme.error }} />
                    Maintenance Mode
                  </p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    Temporarily disable the platform
                  </p>
                </div>
                <button
                  onClick={() => setSystemSettings({
                    ...systemSettings,
                    maintenanceMode: !systemSettings.maintenanceMode
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  style={{ 
                    backgroundColor: systemSettings.maintenanceMode ? theme.error : '#d1d5db' 
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={handleSystemSave}
                disabled={loading}
                className="admin-btn admin-btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Save size={16} />
                    Save System Settings
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Management */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.primary + '20' }}
            >
              <Database size={20} style={{ color: theme.primary }} />
            </div>
            <div>
              <h3 className="admin-card-title">Database Management</h3>
              <p className="admin-card-subtitle">Backup and maintain your database</p>
            </div>
          </div>
        </div>
        <div className="admin-card-body">
          <div className="admin-grid admin-grid-3">
            <div className="flex flex-col items-center p-6 text-center rounded-lg" style={{ backgroundColor: theme.background }}>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: theme.primary + '20' }}
              >
                <Database size={24} style={{ color: theme.primary }} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: theme.text }}>
                Database Backup
              </h4>
              <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
                Create a full backup of your database
              </p>
              <button
                onClick={handleDatabaseBackup}
                disabled={loading}
                className="admin-btn admin-btn-secondary"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner"></div>
                    Backing up...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} />
                    Start Backup
                  </div>
                )}
              </button>
            </div>

            <div className="flex flex-col items-center p-6 text-center rounded-lg" style={{ backgroundColor: theme.background }}>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: theme.success + '20' }}
              >
                <CheckCircle size={24} style={{ color: theme.success }} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: theme.text }}>
                System Health
              </h4>
              <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
                All systems are running normally
              </p>
              <span className="admin-badge admin-badge-success">
                Healthy
              </span>
            </div>

            <div className="flex flex-col items-center p-6 text-center rounded-lg" style={{ backgroundColor: theme.background }}>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: theme.warning + '20' }}
              >
                <Server size={24} style={{ color: theme.warning }} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: theme.text }}>
                Server Status
              </h4>
              <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
                Server uptime: 99.9%
              </p>
              <span className="admin-badge admin-badge-success">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}