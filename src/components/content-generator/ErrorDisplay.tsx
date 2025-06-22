
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="mt-4 p-3 text-sm bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-2">
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      {error}
    </div>
  );
};

export default ErrorDisplay;
