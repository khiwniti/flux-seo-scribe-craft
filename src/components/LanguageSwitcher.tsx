import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext'; // Adjust path as needed
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button
import { Check } from 'lucide-react'; // For indicating active language

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'EN' },
    { code: 'th', name: 'TH' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-md shadow border">
      {/* Optional: Add a label or icon like <Globe className="h-4 w-4 text-gray-600" /> */}
      {/* <span className="text-sm font-medium text-gray-700 mr-1">Language:</span> */}
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className={`flex items-center gap-1 transition-all duration-150 ease-in-out
                      ${language === lang.code
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-2 ring-purple-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
        >
          {language === lang.code && <Check className="h-3.5 w-3.5" />}
          {lang.name}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
