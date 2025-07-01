import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bus, 
  Navigation, 
  Activity,
  Calendar,
  DollarSign,
  MapPin,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

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

export default function Analytics() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, userStatsResponse] = await Promise.all([
        apiService.getStats(),
        apiService.getUserStats(),
      ]);
      
      setStats(statsResponse.stats);
      setUserStats(userStatsResponse.stats);
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', users: 120, trips: 450, revenue: 180000 },
    { month: 'Feb', users: 150, trips: 520, revenue: 208000 },
    { month: 'Mar', users: 180, trips: 680, revenue: 272000 },
    { month: 'Apr', users: 220, trips: 750, revenue: 300000 },
    { month: 'May', users: 280, trips: 890, revenue: 356000 },
    { month: 'Jun', users: 320, trips: 1020, revenue: 408000 },
  ];

  const routePerformance = [
    { route: 'Route 302', trips: 145, passengers: 3200, revenue: 1280000 },
    { route: 'Route 305', trips: 132, passengers: 2890, revenue: 1569270 },
    { route: 'Route 309', trips: 98, passengers: 2100, revenue: 669900 },
    { route: 'Route 316', trips: 87, passengers: 1850, revenue: 506900 },
    { route: 'Route 318', trips: 76, passengers: 1650, revenue: 608850 },
  ];

  const busUtilization = [
    { name: 'High Utilization', value: 12, color: theme.success },
    { name: 'Medium Utilization', value: 8, color: theme.warning },
    { name: 'Low Utilization', value: 5, color: theme.error },
    { name: 'Inactive', value: 3, color: theme.textSecondary },
  ];

  const timeDistribution = [
    { time: '06:00', trips: 45 },
    { time: '08:00', trips: 120 },
    { time: '10:00', trips: 85 },
    { time: '12:00', trips: 95 },
    { time: '14:00', trips: 75 },
    { time: '16:00', trips: 110 },
    { time: '18:00', trips: 135 },
    { time: '20:00', trips: 90 },
    { time: '22:00', trips: 55 },
  ];

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-muted">Loading analytics...</p>
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
          <h1 className="admin-page-title">Analytics Dashboard</h1>
          <p className="admin-page-subtitle">Comprehensive insights into your bus tracking platform performance</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="admin-grid admin-grid-4 admin-mb-6">
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                  Total Revenue
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                  2.4M RWF
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={14} style={{ color: theme.success }} />
                  <span className="text-xs ml-1" style={{ color: theme.success }}>
                    +12.5%
                  </span>
                </div>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.success + '20' }}
              >
                <DollarSign size={24} style={{ color: theme.success }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                  Total Trips
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                  4,315
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={14} style={{ color: theme.success }} />
                  <span className="text-xs ml-1" style={{ color: theme.success }}>
                    +8.2%
                  </span>
                </div>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.primary + '20' }}
              >
                <Activity size={24} style={{ color: theme.primary }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                  Avg Trip Duration
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                  42 min
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs" style={{ color: theme.textSecondary }}>
                    -2 min from last month
                  </span>
                </div>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.warning + '20' }}
              >
                <Clock size={24} style={{ color: theme.warning }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                  User Satisfaction
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                  4.7/5
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={14} style={{ color: theme.success }} />
                  <span className="text-xs ml-1" style={{ color: theme.success }}>
                    +0.3 points
                  </span>
                </div>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.secondary + '20' }}
              >
                <Users size={24} style={{ color: theme.secondary }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="admin-grid admin-grid-2 admin-mb-6">
        {/* Monthly Growth */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Monthly Growth</h3>
            <p className="admin-card-subtitle">Users, trips, and revenue trends</p>
          </div>
          <div className="admin-card-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="month" stroke={theme.textSecondary} />
                <YAxis stroke={theme.textSecondary} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    color: theme.text,
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1"
                  stroke={theme.primary} 
                  fill={theme.primary + '40'} 
                  name="Users"
                />
                <Area 
                  type="monotone" 
                  dataKey="trips" 
                  stackId="2"
                  stroke={theme.success} 
                  fill={theme.success + '40'} 
                  name="Trips"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bus Utilization */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Bus Utilization</h3>
            <p className="admin-card-subtitle">Fleet utilization breakdown</p>
          </div>
          <div className="admin-card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={busUtilization}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {busUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    color: theme.text,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {busUtilization.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm" style={{ color: theme.textSecondary }}>
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="admin-grid admin-grid-2">
        {/* Route Performance */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Route Performance</h3>
            <p className="admin-card-subtitle">Top performing routes by revenue</p>
          </div>
          <div className="admin-card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routePerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis type="number" stroke={theme.textSecondary} />
                <YAxis dataKey="route" type="category" stroke={theme.textSecondary} width={80} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    color: theme.text,
                  }}
                />
                <Bar dataKey="revenue" fill={theme.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Trip Time Distribution</h3>
            <p className="admin-card-subtitle">Peak hours analysis</p>
          </div>
          <div className="admin-card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="time" stroke={theme.textSecondary} />
                <YAxis stroke={theme.textSecondary} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    color: theme.text,
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="trips" 
                  stroke={theme.warning} 
                  strokeWidth={3}
                  dot={{ fill: theme.warning, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: theme.warning, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}