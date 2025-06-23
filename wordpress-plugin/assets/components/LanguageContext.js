
// Language Context for the WordPress plugin
const LanguageContext = React.createContext({
  language: 'en',
  setLanguage: () => {}
});

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = React.useState(() => {
    // Get language from WordPress localization or localStorage
    const wpLanguage = fluxSeoData?.language || 'en';
    const savedLanguage = localStorage.getItem('flux-seo-language');
    return savedLanguage || wpLanguage;
  });

  React.useEffect(() => {
    localStorage.setItem('flux-seo-language', language);
  }, [language]);

  const value = {
    language,
    setLanguage
  };

  return React.createElement(LanguageContext.Provider, { value }, children);
};

window.FluxSEOComponents = window.FluxSEOComponents || {};
window.FluxSEOComponents.LanguageContext = LanguageContext;
window.FluxSEOComponents.LanguageProvider = LanguageProvider;
