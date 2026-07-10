import React from 'react';

// Simple 404 Not Found page with premium styling
const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br" style={{ background: 'linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary))' }}>
      <div className="text-center glass-card p-12 rounded-xl shadow-lg">
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>404</h1>
        <p className="text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Page Not Found</p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  );
};

export default NotFound;
