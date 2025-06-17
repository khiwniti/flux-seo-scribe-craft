
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, BarChart3, Zap } from 'lucide-react';
import ContentAnalyzer from './ContentAnalyzer';
import IntegratedContentGenerator from './IntegratedContentGenerator';
import AdvancedSEOAnalytics from './AdvancedSEOAnalytics';

const SEODashboard = () => {
  const [activeTab, setActiveTab] = useState('analyzer');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SEO Pro Optimizer
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional SEO optimization suite with integrated content generation and advanced analytics
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Content Analysis</Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700">Integrated Generator</Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">Advanced Analytics</Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">Professional Advice</Badge>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Content Analyzer
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog & Image Generator
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Advanced Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="space-y-6">
            <ContentAnalyzer />
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <IntegratedContentGenerator />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdvancedSEOAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SEODashboard;
