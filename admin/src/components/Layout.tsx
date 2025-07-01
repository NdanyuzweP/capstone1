import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bus,
  Navigation,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Search,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Drivers', href: '/drivers', icon: UserCheck },
  { name: 'Buses', href: '/buses', icon: Bus },
  { name: 'Routes', href: '/routes', icon: Navigation },
  { name: 'Pickup Points', href: '/pickup-points', icon: MapPin },
  { name: 'Schedules', href: '/schedules', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-gradient-to-b from-white via-surface to-surface shadow-lg z-40 border-r border-light">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-light">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-primary shadow">
              <Bus size={20} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">Ridra Admin</h1>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors gap-3 group relative ${isActive ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary shadow-sm' : 'text-muted hover:bg-primary/5 hover:text-primary'}`}
                style={{ minHeight: 48 }}
              >
                <span className={`absolute left-0 top-0 h-full w-1 rounded-r-lg ${isActive ? 'bg-primary' : 'group-hover:bg-primary/40'}`}></span>
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        {/* User info and logout */}
        <div className="p-6 border-t border-light flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-semibold shadow">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-muted truncate font-light">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-error text-white font-semibold text-base hover:bg-error/90 transition-colors shadow-md"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      {/* Mobile sidebar overlay and drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-gradient-to-b from-white via-surface to-surface shadow-lg border-r border-light flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-light">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-primary shadow">
                  <Bus size={20} color="white" />
                </div>
                <h1 className="text-2xl font-bold text-primary tracking-tight">Ridra Admin</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-muted">
                <X size={20} />
              </button>
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors gap-3 group relative ${isActive ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary shadow-sm' : 'text-muted hover:bg-primary/5 hover:text-primary'}`}
                    style={{ minHeight: 48 }}
                  >
                    <span className={`absolute left-0 top-0 h-full w-1 rounded-r-lg ${isActive ? 'bg-primary' : 'group-hover:bg-primary/40'}`}></span>
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            {/* User info and logout */}
            <div className="p-6 border-t border-light flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-semibold shadow">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-muted truncate font-light">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-error text-white font-semibold text-base hover:bg-error/90 transition-colors shadow-md"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-8 bg-white border-b border-light shadow sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-muted hover:bg-primary/10">
              <Menu size={22} />
            </button>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full border border-light focus:ring-2 focus:ring-primary focus:outline-none bg-surface text-base min-w-[260px] shadow-sm" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-surface border border-light text-muted hover:bg-primary/10">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 rounded-lg bg-surface border border-light text-muted hover:bg-primary/10">
              <Bell size={20} />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold shadow text-lg">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="p-8 md:p-12 fade-in">
          <div className="card shadow-lg p-8 md:p-12 bg-white rounded-2xl min-h-[80vh] space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}