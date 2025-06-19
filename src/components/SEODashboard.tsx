
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, BarChart3, Zap, Globe, Code, Settings, Target } from 'lucide-react';
import ContentAnalyzer from './ContentAnalyzer';
import IntegratedContentGenerator from './IntegratedContentGenerator';
import AdvancedSEOAnalytics from './AdvancedSEOAnalytics';
import MetaTagsManager from './MetaTagsManager';
import SchemaMarkupGenerator from './SchemaMarkupGenerator';
import TechnicalSEOAudit from './TechnicalSEOAudit';
import SmartKeywordResearch from './SmartKeywordResearch';

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
              Flux SEO Pro Optimizer
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional SEO optimization suite with AI-powered automation and comprehensive analysis tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Content Analysis</Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700">AI Content Generator</Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">Advanced Analytics</Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">Technical SEO</Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">Schema Markup</Badge>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">Keyword Research</Badge>
            <Badge variant="secondary" className="bg-teal-100 text-teal-700">Thai/English Support</Badge>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8 bg-white/50 backdrop-blur-sm p-2 rounded-lg">
            <TabsTrigger value="analyzer" className="flex items-center gap-2 text-sm">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Content Analyzer</span>
              <span className="sm:hidden">Analyzer</span>
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">AI Generator</span>
              <span className="sm:hidden">Generator</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Keywords</span>
              <span className="sm:hidden">Keywords</span>
            </TabsTrigger>
            <TabsTrigger value="meta" className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Meta Tags</span>
              <span className="sm:hidden">Meta</span>
            </TabsTrigger>
            <TabsTrigger value="schema" className="flex items-center gap-2 text-sm">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Schema</span>
              <span className="sm:hidden">Schema</span>
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Technical</span>
              <span className="sm:hidden">Tech</span>
            </Tab

sTrigger>
          </div>

          <TabsContent value="analyzer" className="space-y-6">
            <ContentAnalyzer />
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <IntegratedContentGenerator />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdvancedSEOAnalytics />
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <SmartKeywordResearch />
          </TabsContent>

          <TabsContent value="meta" className="space-y-6">
            <MetaTagsManager />
          </TabsContent>

          <TabsContent value="schema" className="space-y-6">
            <SchemaMarkupGenerator />
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <TechnicalSEOAudit />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SEODashboard;
