import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation(); 
  const [language, setLanguage] = useState(i18n.language || 'en'); 

  const languages = [
    { code: 'en', name: 'English', flag: 'en' },
    { code: 'ru', name: 'Русский', flag: 'ru' },
    { code: 'ky', name: 'Кыргызча', flag: 'kg' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (lang) => {
    i18n.changeLanguage(lang.code); 
    setLanguage(lang.code);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={toggleDropdown} id='inter-font' className='buttonLanguages' style={{ padding: '10px', fontSize: '16px', backgroundColor: 'none' }}>
        {languages.find(l => l.code === language)?.flag}
      </button>
      {isOpen && (
        <ul
          style={{
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            position: 'absolute',
            backgroundColor: 'white',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            width: '150px',
            zIndex: 100,
            left: '-110px'
          }}
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => selectLanguage(lang)}
              id='inter-light-font'
              style={{
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ marginRight: '8px' }} id='inter-font'>{lang.flag}</span>
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
