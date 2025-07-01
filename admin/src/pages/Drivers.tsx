import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Bus,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Activity,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalDrivers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Drivers() {
  const { theme } = useTheme();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchDrivers();
    fetchBuses();
  }, [currentPage, statusFilter]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: 10,
      };
      
      if (statusFilter) params.isActive = statusFilter === 'active';
      
      const response = await apiService.getDrivers(params);
      setDrivers(response.drivers);
      setPagination(response.pagination || null);
    } catch (err: any) {
      console.error('Error fetching drivers:', err);
      setError(err.message || 'Failed to fetch drivers');
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await apiService.getBuses();
      setBuses(response.buses);
    } catch (err: any) {
      console.error('Error fetching buses:', err);
    }
  };

  const handleStatusToggle = async (driver: Driver) => {
    try {
      await apiService.updateUserStatus(driver._id, !driver.isActive);
      toast.success(`Driver ${!driver.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchDrivers();
    } catch (err: any) {
      console.error('Error updating driver status:', err);
      toast.error(err.message || 'Failed to update driver status');
    }
  };

  const getDriverBus = (driverId: string) => {
    return buses.find(bus => 
      (bus.driverId?._id === driverId || bus.driverId?.id === driverId || bus.driverId === driverId) && 
      bus.isActive
    );
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm)
  );

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.phone || !createForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    // Simple email validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(createForm.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    if (createForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setCreateLoading(true);
    try {
      await apiService.createUser({
        ...createForm,
        role: 'driver',
      });
      toast.success('Driver created successfully');
      setShowCreateModal(false);
      setCreateForm({ name: '', email: '', phone: '', password: '' });
      fetchDrivers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create driver');
    } finally {
      setCreateLoading(false);
    }
  };

  const activeDrivers = drivers.filter(d => d.isActive).length;
  const assignedDrivers = drivers.filter(d => getDriverBus(d._id)).length;

  if (loading && drivers.length === 0) {
    return (
      <div className="admin-page-container">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-muted">Loading drivers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-section">
          <h1 className="admin-page-title">Drivers Management</h1>
          <p className="admin-page-subtitle">Manage bus drivers and their assignments</p>
        </div>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          Add Driver
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-grid admin-grid-4 admin-mb-6">
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                  Total Drivers
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                  {pagination?.totalDrivers || drivers.length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.primary + '20' }}
              >
                <UserCheck size={24} style={{ color: theme.primary }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                  Active Drivers
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                  {activeDrivers}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.success + '20' }}
              >
                <Activity size={24} style={{ color: theme.success }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                  Assigned to Bus
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                  {assignedDrivers}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.warning + '20' }}
              >
                <Bus size={24} style={{ color: theme.warning }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                  Available
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                  {activeDrivers - assignedDrivers}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.secondary + '20' }}
              >
                <Clock size={24} style={{ color: theme.secondary }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-filters-grid">
          <div className="admin-input-with-icon">
            <Search size={16} className="admin-input-icon" />
            <input
              type="text"
              placeholder="Search drivers..."
              className="admin-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={fetchDrivers}
            className="admin-btn admin-btn-secondary"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : <Filter size={16} />}
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            Drivers ({pagination?.totalDrivers || filteredDrivers.length})
          </h3>
          <p className="admin-card-subtitle">All registered drivers in the system</p>
        </div>
        <div className="admin-card-body">
          {error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                <AlertCircle size={48} style={{ color: theme.error }} className="mx-auto mb-4" />
                <h3 style={{ color: theme.error }} className="text-lg font-semibold mb-2">
                  Error Loading Drivers
                </h3>
                <p style={{ color: theme.textSecondary }} className="mb-4">
                  {error}
                </p>
                <button
                  onClick={fetchDrivers}
                  className="admin-btn admin-btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <UserCheck size={48} style={{ color: theme.textSecondary }} className="mx-auto mb-4" />
                <h3 style={{ color: theme.text }} className="text-lg font-semibold mb-2">
                  No Drivers Found
                </h3>
                <p style={{ color: theme.textSecondary }}>
                  {searchTerm || statusFilter 
                    ? 'Try adjusting your filters' 
                    : 'No drivers have been added yet'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Contact</th>
                    <th>Assigned Bus</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver) => {
                    const assignedBus = getDriverBus(driver._id);
                    return (
                      <tr key={driver._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: theme.primary + '20' }}
                            >
                              <span className="font-semibold text-sm" style={{ color: theme.primary }}>
                                {driver.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: theme.text }}>
                                {driver.name}
                              </p>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>
                                ID: {driver._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail size={14} style={{ color: theme.textSecondary }} />
                              <span className="text-sm" style={{ color: theme.text }}>
                                {driver.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={14} style={{ color: theme.textSecondary }} />
                              <span className="text-sm" style={{ color: theme.text }}>
                                {driver.phone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {assignedBus ? (
                            <div className="flex items-center gap-2">
                              <Bus size={14} style={{ color: theme.warning }} />
                              <div>
                                <span className="text-sm font-medium" style={{ color: theme.text }}>
                                  {assignedBus.plateNumber}
                                </span>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>
                                  {assignedBus.routeId?.name || 'No route assigned'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="admin-badge admin-badge-secondary">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleStatusToggle(driver)}
                            className={`admin-badge ${driver.isActive ? 'admin-badge-success' : 'admin-badge-danger'}`}
                          >
                            {driver.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} style={{ color: theme.textSecondary }} />
                            <span className="text-sm" style={{ color: theme.text }}>
                              {new Date(driver.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStatusToggle(driver)}
                              className="admin-btn admin-btn-secondary p-2"
                              title={driver.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <Activity size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                Showing page {pagination.currentPage} of {pagination.totalPages} 
                ({pagination.totalDrivers} total drivers)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="admin-btn admin-btn-secondary"
                >
                  Previous
                </button>
                <span className="text-sm font-medium px-3 py-1">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="admin-btn admin-btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Driver Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: theme.text }}>
              Add New Driver
            </h2>
            <form onSubmit={handleCreateDriver} className="admin-space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  placeholder="Enter driver's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="admin-input"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="admin-input"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Password
                </label>
                <input
                  type="password"
                  className="admin-input"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="admin-btn admin-btn-primary flex-1"
                >
                  {createLoading ? <div className="spinner" /> : null}
                  {createLoading ? 'Creating...' : 'Create Driver'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateForm({ name: '', email: '', phone: '', password: '' });
                  }}
                  className="admin-btn admin-btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}