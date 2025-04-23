import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' }
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };
  
  return (
    <div className="language-selector">
      <select 
        value={i18n.language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};