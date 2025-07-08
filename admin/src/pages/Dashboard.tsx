import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { 
  Users, 
  UserCheck, 
  Bus, 
  Navigation, 
  MapPin, 
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Stats {
  buses: number;
  routes: number;
  users: number;
  schedules: number;
  pickupPoints: number;
  userInterests: number;
}

interface UserStats {
  activeUsers: number;
  activeDrivers: number;
  activeAdmins: number;
  inactiveUsers: number;
  totalUsers: number;
}

export default function Dashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, userStatsResponse] = await Promise.all([
        apiService.getStats(),
        apiService.getUserStats(),
      ]);
      
      setStats(statsResponse.stats);
      setUserStats(userStatsResponse.stats);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: userStats?.totalUsers || 0,
      icon: Users,
      color: theme.primary,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Drivers',
      value: userStats?.activeDrivers || 0,
      icon: UserCheck,
      color: theme.success,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Buses',
      value: stats?.buses || 0,
      icon: Bus,
      color: theme.warning,
      change: '+2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Routes',
      value: stats?.routes || 0,
      icon: Navigation,
      color: theme.secondary,
      change: '0%',
      changeType: 'neutral' as const,
    },
    {
      title: 'Pickup Points',
      value: stats?.pickupPoints || 0,
      icon: MapPin,
      color: theme.primary,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'User Interests',
      value: stats?.userInterests || 0,
      icon: Activity,
      color: theme.success,
      change: '+25%',
      changeType: 'positive' as const,
    },
  ];

  // Mock data for charts
  const weeklyData = [
    { name: 'Mon', users: 120, trips: 45 },
    { name: 'Tue', users: 150, trips: 52 },
    { name: 'Wed', users: 180, trips: 48 },
    { name: 'Thu', users: 165, trips: 61 },
    { name: 'Fri', users: 200, trips: 55 },
    { name: 'Sat', users: 250, trips: 67 },
    { name: 'Sun', users: 180, trips: 43 },
  ];

  const userDistribution = [
    { name: 'Regular Users', value: userStats?.activeUsers || 0, color: theme.primary },
    { name: 'Drivers', value: userStats?.activeDrivers || 0, color: theme.success },
    { name: 'Admins', value: userStats?.activeAdmins || 0, color: theme.warning },
    { name: 'Inactive', value: userStats?.inactiveUsers || 0, color: theme.textSecondary },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle size={64} style={{ color: theme.error }} className="mx-auto mb-6" />
          <h3 style={{ color: theme.error }} className="text-xl font-semibold mb-3">
            Error Loading Dashboard
          </h3>
          <p style={{ color: theme.textSecondary }} className="mb-6 text-base leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchDashboardData}
            className="btn btn-primary px-6 py-3"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="dashboard-title">Dashboard Overview</div>
        <div className="dashboard-subtitle">
          Here's what's happening today.
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="dashboard-stat-card fade-in">
              <div className="dashboard-stat-content">
                <div className="dashboard-stat-info">
                  <div className="dashboard-stat-label">{stat.title}</div>
                  <div className="dashboard-stat-value">{stat.value.toLocaleString()}</div>
                  <div className="dashboard-stat-change">
                    <span className={`dashboard-stat-percentage ${
                      stat.changeType === 'positive' ? 'positive' : 
                      stat.changeType === 'neutral' ? 'neutral' : 'negative'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="dashboard-stat-period">from last week</span>
                  </div>
                </div>
                <div className="dashboard-stat-icon" style={{ backgroundColor: stat.color + '15' }}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts-grid">
        {/* Weekly Activity Chart */}
        <div className="dashboard-chart-card">
          <div className="dashboard-chart-header">
            <h3 className="dashboard-chart-title" style={{ color: theme.text }}>
              Weekly Activity
            </h3>
            <p className="dashboard-chart-subtitle" style={{ color: theme.textSecondary }}>
              User activity and trips over the past week
            </p>
          </div>
          <div className="dashboard-chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="name" stroke={theme.textSecondary} />
                <YAxis stroke={theme.textSecondary} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    color: theme.text,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="users" fill={theme.primary} name="Users" radius={[4, 4, 0, 0]} />
                <Bar dataKey="trips" fill={theme.success} name="Trips" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="dashboard-chart-card">
          <div className="dashboard-chart-header">
            <h3 className="dashboard-chart-title" style={{ color: theme.text }}>
              User Distribution
            </h3>
            <p className="dashboard-chart-subtitle" style={{ color: theme.textSecondary }}>
              Breakdown of users by role and status
            </p>
          </div>
          <div className="dashboard-chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    color: theme.text,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="dashboard-legend">
              {userDistribution.map((item, index) => (
                <div key={index} className="dashboard-legend-item">
                  <div 
                    className="dashboard-legend-color"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="dashboard-legend-text" style={{ color: theme.textSecondary }}>
                    {item.name}: <strong>{item.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="dashboard-activity-card">
        <div className="dashboard-activity-header">
          <h3 className="dashboard-activity-title" style={{ color: theme.text }}>
            Recent Activity
          </h3>
          <p className="dashboard-activity-subtitle" style={{ color: theme.textSecondary }}>
            Latest system activities and updates
          </p>
        </div>
        <div className="dashboard-activity-body">
          <div className="dashboard-activity-list">
            {[
              { icon: Users, text: 'New user registered: John Doe', time: '2 minutes ago', type: 'user' },
              { icon: Bus, text: 'Bus RAD 123 A went online', time: '5 minutes ago', type: 'bus' },
              { icon: Navigation, text: 'Route 302 schedule updated', time: '10 minutes ago', type: 'route' },
              { icon: UserCheck, text: 'Driver assigned to Bus RAD 456 B', time: '15 minutes ago', type: 'driver' },
              { icon: MapPin, text: 'New pickup point added to Route 305', time: '20 minutes ago', type: 'pickup' },
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="dashboard-activity-item" style={{ backgroundColor: theme.surface }}>
                  <div 
                    className="dashboard-activity-icon"
                    style={{ backgroundColor: theme.primary + '20' }}
                  >
                    <Icon size={16} style={{ color: theme.primary }} />
                  </div>
                  <div className="dashboard-activity-content">
                    <p className="dashboard-activity-text" style={{ color: theme.text }}>
                      {activity.text}
                    </p>
                    <p className="dashboard-activity-time" style={{ color: theme.textSecondary }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}