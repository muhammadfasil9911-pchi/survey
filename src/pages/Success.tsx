import React from 'react';
import { BilingualText } from '../components/BilingualText';
import { LanguageToggle } from '../components/LanguageToggle';

export const Success: React.FC = () => {
  return (
    <div className="container survey-container animate-fade-in flex flex-col justify-center min-h-[80vh]">
      <div className="header mb-8 flex justify-between items-center rounded-xl px-6 py-4 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Gen Z Finance
        </div>
        <LanguageToggle />
      </div>

      <div className="glass-panel text-center py-12">
        <div className="flex justify-center mb-6 text-green-500" style={{ color: 'var(--success)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 className="mb-4" style={{ fontSize: '1.75rem' }}>
          <BilingualText 
            en="Thank you for participating in the Gen Z Financial Literacy Survey."
            ml="Gen Z Financial Literacy Survey-il participate cheythathinu nandi."
          />
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          <BilingualText 
            en="Your response has been successfully recorded."
            ml="Ningalude response successfully record cheythu."
          />
        </p>
      </div>
    </div>
  );
};
