
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { AlertTriangle } from 'lucide-react'; // For error state

// Matches HistoryItem from useContentGeneration.ts
interface GenerationHistoryEntry {
  id: number;
  title: string; // Changed from topic
  meta_description: string; // Available from DB
  // keywords: string; // Not directly in DB select, but could be added if needed
  language: string;
  seo_score: number;
  status: string;
  created_at: string; // Renamed from generatedAt
}

interface GenerationHistoryProps {
  autoGenHistory: GenerationHistoryEntry[];
  isLoading: boolean;
  error: Error | null;
}

const GenerationHistory = ({ autoGenHistory, isLoading, error }: GenerationHistoryProps) => {

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-600">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p>Error loading generation history: {error.message}</p>
        </div>
      );
    }

    if (autoGenHistory.length === 0) {
      return (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No generated content history found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Content generated via AI will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {autoGenHistory.map((entry) => (
          <div key={entry.id} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium text-gray-900">{entry.title}</h4>
                <p className="text-sm text-gray-600 truncate" title={entry.meta_description || ""}>
                  Meta: {entry.meta_description || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  Language: {entry.language}, SEO Score: {entry.seo_score}%
                </p>
                <p className="text-xs text-gray-500">
                  Generated: {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString()}
                </p>
              </div>
              <Badge variant="secondary" className={entry.status === 'generated' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {entry.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-600" />
          Generation History
        </CardTitle>
        <CardDescription>
          View your recent AI-generated content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default GenerationHistory;
// Removed extraneous closing tags that were here
