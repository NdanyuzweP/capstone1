import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
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
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Users() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: 10,
      };
      
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.isActive = statusFilter === 'active';
      
      const response = await apiService.getUsers(params);
      setUsers(response.users);
      setPagination(response.pagination || null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (user: User) => {
    try {
      await apiService.updateUserStatus(user._id, !user.isActive);
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user status:', err);
      toast.error(err.message || 'Failed to update user status');
    }
  };

  const handleRoleChange = async (user: User, newRole: string) => {
    try {
      await apiService.updateUserRole(user._id, newRole);
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user role:', err);
      toast.error(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    try {
      await apiService.deleteUser(user._id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'admin-badge-danger';
      case 'driver':
        return 'admin-badge-warning';
      default:
        return 'admin-badge-primary';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="admin-page-container">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-muted">Loading users...</p>
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
          <h1 className="admin-page-title">Users Management</h1>
          <p className="admin-page-subtitle">Manage all users, drivers, and administrators</p>
        </div>
        <button className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-filters-grid">
          <div className="admin-input-with-icon">
            <Search size={16} className="admin-input-icon" />
            <input
              type="text"
              placeholder="Search users..."
              className="admin-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="admin-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="driver">Drivers</option>
            <option value="admin">Admins</option>
          </select>
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
            onClick={fetchUsers}
            className="admin-btn admin-btn-secondary"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : <Filter size={16} />}
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            Users ({pagination?.totalUsers || filteredUsers.length})
          </h3>
          <p className="admin-card-subtitle">Complete list of all system users</p>
        </div>
        <div className="admin-card-body">
          {error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                <AlertCircle size={48} style={{ color: theme.error }} className="mx-auto mb-4" />
                <h3 style={{ color: theme.error }} className="text-lg font-semibold mb-2">
                  Error Loading Users
                </h3>
                <p style={{ color: theme.textSecondary }} className="mb-4">
                  {error}
                </p>
                <button
                  onClick={fetchUsers}
                  className="admin-btn admin-btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <UsersIcon size={48} style={{ color: theme.textSecondary }} className="mx-auto mb-4" />
                <h3 style={{ color: theme.text }} className="text-lg font-semibold mb-2">
                  No Users Found
                </h3>
                <p style={{ color: theme.textSecondary }}>
                  {searchTerm || roleFilter || statusFilter 
                    ? 'Try adjusting your filters' 
                    : 'No users have been added yet'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.primary + '20' }}
                          >
                            <span className="font-semibold text-sm" style={{ color: theme.primary }}>
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: theme.text }}>
                              {user.name}
                            </p>
                            <p className="text-xs" style={{ color: theme.textSecondary }}>
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail size={14} style={{ color: theme.textSecondary }} />
                            <span className="text-sm" style={{ color: theme.text }}>
                              {user.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} style={{ color: theme.textSecondary }} />
                            <span className="text-sm" style={{ color: theme.text }}>
                              {user.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleStatusToggle(user)}
                          className={`admin-badge ${user.isActive ? 'admin-badge-success' : 'admin-badge-danger'}`}
                        >
                          {user.isActive ? (
                            <>
                              <UserCheck size={12} className="mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX size={12} className="mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} style={{ color: theme.textSecondary }} />
                          <span className="text-sm" style={{ color: theme.text }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className="admin-btn admin-btn-secondary p-2"
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="admin-btn admin-btn-danger p-2"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                ({pagination.totalUsers} total users)
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
    </div>
  );
}