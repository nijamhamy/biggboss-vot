import React, { createContext, useContext, useMemo, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('bb_lang') || 'ta');

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'ta' ? 'en' : 'ta';
      localStorage.setItem('bb_lang', next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      lang,
      toggleLang,
      t: (key) => translations[lang][key] ?? key,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
