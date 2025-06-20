
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Brain } from 'lucide-react';
import AnalyticsOverview from './analytics/AnalyticsOverview';
import BlogSuggestions from './analytics/BlogSuggestions';
import ContentGenerator from './analytics/ContentGenerator';
import { useAnalyticsData } from './analytics/useAnalyticsData';
import { useContentGeneration } from './analytics/useContentGeneration';

const AnalyticsBasedGenerator = () => {
  const { analyticsData, blogSuggestions, isAnalyzing } = useAnalyticsData();
  const { isGenerating, selectedSuggestion, generatedContent, generateBlogContent, resetGenerator } = useContentGeneration();

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-600" />
            Analytics-Powered Blog Generation
          </CardTitle>
          <CardDescription>
            AI analyzes your SEO data to suggest high-impact blog topics and generate optimized content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!analyticsData ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
                <p className="text-gray-600">Analyzing your SEO performance data...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="suggestions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analytics">Analytics Overview</TabsTrigger>
                <TabsTrigger value="suggestions">Content Suggestions</TabsTrigger>
                <TabsTrigger value="generator">Content Generator</TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="space-y-4">
                <AnalyticsOverview analyticsData={analyticsData} />
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <BlogSuggestions 
                  suggestions={blogSuggestions}
                  isAnalyzing={isAnalyzing}
                  onGenerateContent={generateBlogContent}
                />
              </TabsContent>

              <TabsContent value="generator" className="space-y-4">
                <ContentGenerator
                  isGenerating={isGenerating}
                  generatedContent={generatedContent}
                  selectedSuggestion={selectedSuggestion}
                  onReset={resetGenerator}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsBasedGenerator;
