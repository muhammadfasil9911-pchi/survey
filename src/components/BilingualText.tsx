import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface BilingualTextProps {
  en: string;
  ml: string;
  className?: string;
  enClassName?: string;
  mlClassName?: string;
}

export const BilingualText: React.FC<BilingualTextProps> = ({ 
  en, 
  ml, 
  className = '',
  enClassName = 'option-text-en',
  mlClassName = 'option-text-ml'
}) => {
  const { language } = useLanguage();

  if (language === 'en') {
    return <span className={`${enClassName} ${className}`}>{en}</span>;
  }

  if (language === 'ml') {
    return <span className={`${enClassName} ${className}`}>{ml}</span>; // Use enClassName for main text sizing if only ML is shown
  }

  // Bilingual mode
  return (
    <div className={className}>
      <span className={enClassName}>{en}</span>
      <span className={mlClassName}>{ml}</span>
    </div>
  );
};
