import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  Bus,
  Navigation as RouteIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BusSchedule {
  _id: string;
  busId: any;
  routeId: any;
  departureTime: string;
  estimatedArrivalTimes: Array<{
    pickupPointId: any;
    estimatedTime: string;
    actualTime?: string;
  }>;
  status: string;
  createdAt: string;
}

export default function Schedules() {
  const { theme } = useTheme();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [routeFilter, setRouteFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    fetchSchedules();
    fetchBuses();
    fetchRoutes();
  }, [statusFilter, routeFilter, dateFilter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (routeFilter) params.routeId = routeFilter;
      if (dateFilter) params.date = dateFilter;
      
      const response = await apiService.getBusSchedules(params);
      setSchedules(response.schedules);
    } catch (err: any) {
      console.error('Error fetching schedules:', err);
      setError(err.message || 'Failed to fetch schedules');
      toast.error('Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await apiService.getBuses();
      setBuses(response.buses.filter(bus => bus.isActive));
    } catch (err: any) {
      console.error('Error fetching buses:', err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await apiService.getRoutes();
      setRoutes(response.routes.filter(route => route.isActive));
    } catch (err: any) {
      console.error('Error fetching routes:', err);
    }
  };

  const handleDeleteSchedule = async (schedule: BusSchedule) => {
    if (!window.confirm('Are you sure you want to cancel this schedule?')) {
      return;
    }

    try {
      await apiService.deleteBusSchedule(schedule._id);
      toast.success('Schedule cancelled successfully');
      fetchSchedules();
    } catch (err: any) {
      console.error('Error cancelling schedule:', err);
      toast.error(err.message || 'Failed to cancel schedule');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.success;
      case 'in-transit':
        return theme.warning;
      case 'cancelled':
        return theme.error;
      default:
        return theme.primary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-transit':
        return Play;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getBusName = (busId: any) => {
    if (typeof busId === 'string') {
      const bus = buses.find(b => b._id === busId);
      return bus ? bus.plateNumber : 'Unknown Bus';
    }
    return busId?.plateNumber || 'Unknown Bus';
  };

  const getRouteName = (routeId: any) => {
    if (typeof routeId === 'string') {
      const route = routes.find(r => r._id === routeId);
      return route ? route.name : 'Unknown Route';
    }
    return routeId?.name || 'Unknown Route';
  };

  const filteredSchedules = schedules.filter(schedule => {
    const busName = getBusName(schedule.busId);
    const routeName = getRouteName(schedule.routeId);
    
    return busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           routeName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && schedules.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-content p-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-title">Bus Schedules</div>
          <div className="section-subtitle">Manage bus schedules and departure times</div>
        </div>
        <button className="btn btn-primary text-base px-4 py-2 rounded-xl shadow-md">
          <Plus size={18} />
          Add Schedule
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="card card-compact">
          <div className="card-body flex items-center gap-3">
            <div>
              <div className="text-xs text-muted font-medium">Total</div>
              <div className="text-lg font-bold mt-0.5">{schedules.length}</div>
            </div>
            <div className="stats-icon-sm" style={{ backgroundColor: theme.primary + '15' }}>
              <Calendar size={18} style={{ color: theme.primary }} />
            </div>
          </div>
        </div>
        <div className="card card-compact">
          <div className="card-body flex items-center gap-3">
            <div>
              <div className="text-xs text-muted font-medium">Scheduled</div>
              <div className="text-lg font-bold mt-0.5">{schedules.filter(s => s.status === 'scheduled').length}</div>
            </div>
            <div className="stats-icon-sm" style={{ backgroundColor: theme.primary + '15' }}>
              <Clock size={18} style={{ color: theme.primary }} />
            </div>
          </div>
        </div>
        <div className="card card-compact">
          <div className="card-body flex items-center gap-3">
            <div>
              <div className="text-xs text-muted font-medium">In Transit</div>
              <div className="text-lg font-bold mt-0.5">{schedules.filter(s => s.status === 'in-transit').length}</div>
            </div>
            <div className="stats-icon-sm" style={{ backgroundColor: theme.warning + '15' }}>
              <Play size={18} style={{ color: theme.warning }} />
            </div>
          </div>
        </div>
        <div className="card card-compact">
          <div className="card-body flex items-center gap-3">
            <div>
              <div className="text-xs text-muted font-medium">Completed</div>
              <div className="text-lg font-bold mt-0.5">{schedules.filter(s => s.status === 'completed').length}</div>
            </div>
            <div className="stats-icon-sm" style={{ backgroundColor: theme.success + '15' }}>
              <CheckCircle size={18} style={{ color: theme.success }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: theme.textSecondary }}
              />
              <input
                type="text"
                placeholder="Search schedules..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                }}
              />
            </div>
            
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              className="form-select"
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              <option value="">All Routes</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.name}
                </option>
              ))}
            </select>
            
            <input
              type="date"
              className="form-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
            
            <button
              onClick={fetchSchedules}
              className="btn btn-outline"
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : <Filter size={16} />}
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-bold section-title" style={{ color: theme.text }}>
            Schedules ({filteredSchedules.length})
          </h3>
        </div>
        <div className="card-body p-0">
          {error ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <AlertCircle size={40} style={{ color: theme.error }} className="mx-auto mb-3" />
                <p style={{ color: theme.error }} className="text-base font-semibold mb-1">
                  Error Loading Schedules
                </p>
                <p style={{ color: theme.textSecondary }} className="mb-2">
                  {error}
                </p>
                <button
                  onClick={fetchSchedules}
                  className="btn btn-primary text-base px-4 py-2 rounded-xl shadow-md"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <Calendar size={40} style={{ color: theme.textSecondary }} className="mx-auto mb-3" />
                <p style={{ color: theme.text }} className="text-base font-semibold mb-1">
                  No Schedules Found
                </p>
                <p style={{ color: theme.textSecondary }}>
                  {searchTerm || statusFilter || routeFilter || dateFilter
                    ? 'Try adjusting your filters' 
                    : 'No schedules have been created yet'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-striped table-hover text-sm">
                <thead>
                  <tr>
                    <th style={{ color: theme.textSecondary }}>Bus & Route</th>
                    <th style={{ color: theme.textSecondary }}>Departure</th>
                    <th style={{ color: theme.textSecondary }}>Status</th>
                    <th style={{ color: theme.textSecondary }}>Pickup Points</th>
                    <th style={{ color: theme.textSecondary }}>Created</th>
                    <th style={{ color: theme.textSecondary }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => {
                    const StatusIcon = getStatusIcon(schedule.status);
                    
                    return (
                      <tr key={schedule._id}>
                        <td>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                                style={{ backgroundColor: theme.primary + '20' }}
                              >
                                <Bus size={16} style={{ color: theme.primary }} />
                              </div>
                              <span className="font-medium" style={{ color: theme.text }}>
                                {getBusName(schedule.busId)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                                style={{ backgroundColor: theme.secondary + '20' }}
                              >
                                <RouteIcon size={16} style={{ color: theme.secondary }} />
                              </div>
                              <span className="text-sm" style={{ color: theme.textSecondary }}>
                                {getRouteName(schedule.routeId)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2" style={{ color: theme.textSecondary }} />
                            <div>
                              <p className="font-medium" style={{ color: theme.text }}>
                                {new Date(schedule.departureTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p className="text-sm" style={{ color: theme.textSecondary }}>
                                {new Date(schedule.departureTime).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            style={{ 
                              backgroundColor: getStatusColor(schedule.status) + '20',
                              color: getStatusColor(schedule.status)
                            }}
                          >
                            <StatusIcon size={14} className="mr-1" />
                            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                          </div>
                        </td>
                        <td>
                          <span style={{ color: theme.text }}>
                            {schedule.estimatedArrivalTimes.length} stops
                          </span>
                        </td>
                        <td>
                          <span className="text-sm" style={{ color: theme.textSecondary }}>
                            {new Date(schedule.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <div className="table-row-actions">
                            <button className="btn btn-outline text-xs px-3 py-1 rounded-lg">
                              <Edit size={14} />
                            </button>
                            <button className="btn btn-danger text-xs px-3 py-1 rounded-lg" onClick={() => handleDeleteSchedule(schedule)}>
                              <Trash2 size={14} />
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
    </div>
  );
}