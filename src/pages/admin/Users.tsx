import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Users: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Admin User Management</h1>
      
      <div className="glass-card mb-8">
        <h3 className="text-lg font-semibold mb-4">Current Session</h3>
        <p className="text-gray-600 mb-2">You are currently logged in as:</p>
        <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
          {user?.email}
        </div>
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-4">Admin Accounts</h3>
        <p className="text-gray-600 mb-6">
          To manage admin accounts (create new admins, reset passwords, or disable accounts), please use the Supabase Dashboard. 
          As a security measure, creating new admins directly from this portal is disabled. All admin accounts have the same access level.
        </p>
        
        <a 
          href="https://app.supabase.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          Open Supabase Dashboard
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    </div>
  );
};
