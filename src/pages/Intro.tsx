import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BilingualText } from '../components/BilingualText';
import { LanguageToggle } from '../components/LanguageToggle';

export const Intro: React.FC = () => {
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    if (consent) {
      navigate('/survey');
    }
  };

  return (
    <div className="container survey-container animate-fade-in">
      <div className="header mb-8 flex justify-between items-center rounded-xl px-6 py-4 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Gen Z Finance
        </div>
        <LanguageToggle />
      </div>

      <div className="glass-panel">
        <h1 className="text-center mb-6" style={{ fontSize: '2rem', color: 'var(--accent-primary)' }}>
          <BilingualText 
            en="Gen Z Financial Literacy Survey" 
            ml="Gen Z Financial Literacy Survey" 
          />
        </h1>

        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
          <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            <BilingualText
              en="This survey studies financial literacy, saving, investment, digital payments, loans and spending behaviour among Generation Z. Your responses will be used only for research and analysis. The survey is fully anonymous, and no personally identifiable information will be collected."
              ml="Ee survey Gen Z-yude financial literacy, saving, investment, digital payment, loan use, spending behaviour ennivaye kurichu padikkan vendiyanu. Ningalude responses researchinum analysisinum mathram use cheyyum. Ee survey poornamayum anonymous aanu. Personal identification details collect cheyyilla."
            />
          </p>
        </div>

        <div className="option-card mb-8" onClick={() => setConsent(!consent)}>
          <input 
            type="checkbox" 
            checked={consent} 
            onChange={() => setConsent(!consent)} 
            id="consent-checkbox"
          />
          <div className="option-indicator"></div>
          <div className="option-content">
            <label htmlFor="consent-checkbox" style={{ cursor: 'pointer' }}>
              <BilingualText
                en="I voluntarily agree to participate in this survey."
                ml="Njan ee survey-il swamedhaya participate cheyyan sammathikkunnu."
              />
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            className="btn btn-primary" 
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
            disabled={!consent}
            onClick={handleStart}
          >
            <BilingualText en="Start Survey" ml="Survey Thudanguka" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
