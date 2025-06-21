
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { AutoGenHistoryEntry } from './types';

interface GenerationHistoryProps {
  autoGenHistory: AutoGenHistoryEntry[];
}

const GenerationHistory = ({ autoGenHistory }: GenerationHistoryProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-600" />
          Generation History
        </CardTitle>
        <CardDescription>
          View your recent auto-generated blog posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {autoGenHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No auto-generated content yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Enable auto-generation to start building your content history
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {autoGenHistory.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">{entry.topic}</h4>
                    <p className="text-sm text-gray-600">Word Count: {entry.wordCount}</p>
                    <p className="text-xs text-gray-500">
                      Generated: {entry.date.toLocaleDateString()} at {entry.date.toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {entry.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerationHistory;
