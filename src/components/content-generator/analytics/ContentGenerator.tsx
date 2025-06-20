
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Calendar } from 'lucide-react';

interface BlogSuggestion {
  title: string;
  angle: string;
  keywords: string[];
  estimatedDifficulty: number;
  potentialTraffic: number;
  contentType: string;
  wordCount: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

interface ContentGeneratorProps {
  isGenerating: boolean;
  generatedContent: string;
  selectedSuggestion: BlogSuggestion | null;
  onReset: () => void;
}

const ContentGenerator = ({ isGenerating, generatedContent, selectedSuggestion, onReset }: ContentGeneratorProps) => {
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-green-600 animate-pulse" />
          <p className="text-gray-600">Generating SEO-optimized content...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (generatedContent && selectedSuggestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Generated Blog Content
          </CardTitle>
          <CardDescription>
            AI-generated content based on analytics: {selectedSuggestion.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {generatedContent}
            </pre>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigator.clipboard.writeText(generatedContent)}
              variant="outline"
            >
              Copy Content
            </Button>
            <Button 
              onClick={() => {
                const blob = new Blob([generatedContent], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedSuggestion.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              variant="outline"
            >
              Download
            </Button>
            <Button 
              onClick={onReset}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Generate New Content
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-center py-12 text-gray-500">
      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>Select a blog suggestion to generate optimized content</p>
      <p className="text-sm mt-2">Content will be tailored based on your SEO analytics</p>
    </div>
  );
};

export default ContentGenerator;
