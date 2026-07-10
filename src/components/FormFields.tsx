import React from 'react';
import { BilingualText } from './BilingualText';

interface Option {
  value: string;
  en: string;
  ml: string;
}

interface SingleChoiceProps {
  name: string;
  enQuestion: string;
  mlQuestion: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({
  name, enQuestion, mlQuestion, options, value, onChange, required = true, error
}) => {
  return (
    <div className="form-group">
      <div className="mb-4">
        <label className="form-label">
          <BilingualText en={enQuestion} ml={mlQuestion} enClassName="" mlClassName="form-label-manglish" />
          {required && <span className="text-red-500 ml-1" style={{ color: 'var(--error)' }}>*</span>}
        </label>
      </div>
      <div className="options-grid">
        {options.map((opt) => (
          <div 
            key={opt.value} 
            className={`option-card ${value === opt.value ? 'selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            <input 
              type="radio" 
              name={name} 
              value={opt.value} 
              checked={value === opt.value} 
              onChange={() => onChange(opt.value)} 
            />
            <div className="option-indicator"></div>
            <div className="option-content">
              <BilingualText en={opt.en} ml={opt.ml} />
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="form-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <BilingualText en="Please answer this question" ml="Dayavayi ee chodhyathinu marupadi nalkuka" />
        </div>
      )}
    </div>
  );
};

interface MultiChoiceProps {
  name: string;
  enQuestion: string;
  mlQuestion: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  error?: boolean;
  exclusiveNone?: string; // value of the "None of the above" option that clears others
}

export const MultiChoice: React.FC<MultiChoiceProps> = ({
  name, enQuestion, mlQuestion, options, values, onChange, required = true, error, exclusiveNone
}) => {
  const toggleOption = (val: string) => {
    if (exclusiveNone && val === exclusiveNone) {
      // If they click "None of the above", clear everything else
      onChange([val]);
      return;
    }

    let newValues = [...values];
    
    // Remove exclusiveNone if it was selected
    if (exclusiveNone && newValues.includes(exclusiveNone)) {
      newValues = newValues.filter(v => v !== exclusiveNone);
    }

    if (newValues.includes(val)) {
      newValues = newValues.filter(v => v !== val);
    } else {
      newValues.push(val);
    }
    onChange(newValues);
  };

  return (
    <div className="form-group">
      <div className="mb-4">
        <label className="form-label">
          <BilingualText en={enQuestion} ml={mlQuestion} enClassName="" mlClassName="form-label-manglish" />
          {required && <span className="text-red-500 ml-1" style={{ color: 'var(--error)' }}>*</span>}
          <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-muted)' }}>
            <BilingualText en="(Select all that apply)" ml="(Bhadhakamaya ellam select cheyyuka)" />
          </span>
        </label>
      </div>
      <div className="options-grid">
        {options.map((opt) => (
          <div 
            key={opt.value} 
            className={`option-card ${values.includes(opt.value) ? 'selected' : ''}`}
            onClick={() => toggleOption(opt.value)}
          >
            <input 
              type="checkbox" 
              name={name} 
              value={opt.value} 
              checked={values.includes(opt.value)} 
              onChange={() => toggleOption(opt.value)} 
            />
            <div className="option-indicator"></div>
            <div className="option-content">
              <BilingualText en={opt.en} ml={opt.ml} />
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="form-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <BilingualText en="Please select at least one option" ml="Dayavayi oru option enkilum select cheyyuka" />
        </div>
      )}
    </div>
  );
};
