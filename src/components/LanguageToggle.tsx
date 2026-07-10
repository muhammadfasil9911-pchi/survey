import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          language === 'en' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={language === 'en' ? { backgroundColor: 'var(--accent-primary)', color: 'white' } : { color: 'var(--text-secondary)' }}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('ml')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          language === 'ml' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={language === 'ml' ? { backgroundColor: 'var(--accent-primary)', color: 'white' } : { color: 'var(--text-secondary)' }}
      >
        Manglish
      </button>
      <button
        onClick={() => setLanguage('bilingual')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          language === 'bilingual' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={language === 'bilingual' ? { backgroundColor: 'var(--accent-primary)', color: 'white' } : { color: 'var(--text-secondary)' }}
      >
        EN + ML
      </button>
    </div>
  );
};
