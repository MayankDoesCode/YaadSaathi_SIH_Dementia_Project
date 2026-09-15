import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from './translations';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('yaadsaathi_language');
    return saved === 'en' || saved === 'hi' ? saved : 'hi'; // Default Hindi for elderly users
  });

  useEffect(() => {
    localStorage.setItem('yaadsaathi_language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'hi') {
      setLanguageState(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'hi' ? 'en' : 'hi'));
  }, []);

  /**
   * Translate key to current language with optional parameter interpolation.
   * e.g. t('stepsReportSpeech', { steps: 2435 })
   */
  const t = useCallback(
    (key, params = {}) => {
      const dict = translations[language] || translations.hi;
      let text = dict[key];

      if (text === undefined) {
        // Fallback to English dictionary or key name
        text = translations.en[key] !== undefined ? translations.en[key] : key;
      }

      if (typeof text === 'string' && Object.keys(params).length > 0) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isHindi: language === 'hi',
        isEnglish: language === 'en',
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export default I18nContext;
