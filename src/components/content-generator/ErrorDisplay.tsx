
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <strong>{t("Error:", "ข้อผิดพลาด:")}</strong> {error}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
