
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
import SettingsTab from './SettingsTab';
import SEOChatbot from './SEOChatbot'; // Import the new SEOChatbot component
import { MessageCircle } from 'lucide-react'; // Import an icon for the chatbot tab

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
          <div className="mb-8 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/20">
            <TabsList className="grid w-full h-auto bg-transparent p-1 gap-1" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}> {/* Updated to 9 columns */}
              <TabsTrigger 
                value="analyzer" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Analyzer</span>
                <span className="md:hidden">Analyze</span>
              </TabsTrigger>
              <TabsTrigger 
                value="generator" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Generator</span>
                <span className="md:hidden">Gen</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Analytics</span>
                <span className="md:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger 
                value="keywords" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Target className="h-4 w-4" />
                <span className="hidden md:inline">Keywords</span>
                <span className="md:hidden">Keys</span>
              </TabsTrigger>
              <TabsTrigger 
                value="meta" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Meta Tags</span>
                <span className="md:hidden">Meta</span>
              </TabsTrigger>
              <TabsTrigger 
                value="schema" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Code className="h-4 w-4" />
                <span className="hidden md:inline">Schema</span>
                <span className="md:hidden">Schema</span>
              </TabsTrigger>
              <TabsTrigger 
                value="technical" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Technical</span>
                <span className="md:hidden">Tech</span>
              </TabsTrigger>
              <TabsTrigger
                value="chatbot"
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">Chatbot</span>
                <span className="md:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Settings</span>
                <span className="md:hidden">Config</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="space-y-6">
            <TabsContent value="analyzer" className="mt-0">
              <ContentAnalyzer />
            </TabsContent>

            <TabsContent value="generator" className="mt-0">
              <IntegratedContentGenerator />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AdvancedSEOAnalytics />
            </TabsContent>

            <TabsContent value="keywords" className="mt-0">
              <SmartKeywordResearch />
            </TabsContent>

            <TabsContent value="meta" className="mt-0">
              <MetaTagsManager />
            </TabsContent>

            <TabsContent value="schema" className="mt-0">
              <SchemaMarkupGenerator />
            </TabsContent>

            <TabsContent value="technical" className="mt-0">
              <TechnicalSEOAudit />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>

            <TabsContent value="chatbot" className="mt-0">
              <SEOChatbot />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SEODashboard;
