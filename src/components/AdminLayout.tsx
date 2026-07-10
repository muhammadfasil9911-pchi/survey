import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, Download } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="animate-spin text-blue-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/responses', label: 'Responses', icon: <Users size={20} /> },
    { path: '/admin/analysis', label: 'Analysis', icon: <BarChart3 size={20} /> },
    { path: '/admin/reports', label: 'Reports & Export', icon: <Download size={20} /> },
    { path: '/admin/users', label: 'Admin Users', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="px-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>Gen Z Finance</h2>
          <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
        </div>

        <nav className="sidebar-nav flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="mb-4 px-2 text-sm text-gray-500 truncate">
            {user.email}
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
