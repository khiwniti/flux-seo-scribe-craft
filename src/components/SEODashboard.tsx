
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
import SEOChatbot from './SEOChatbot';
import LanguageSwitcher from './LanguageSwitcher';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

const SEODashboard = () => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const { language } = useLanguage(); // Consume language context

  // Define translations directly in the component or import from a helper file if it grows
  const translations = {
    en: {
      headerTitle: "Flux SEO Pro Optimizer",
      headerParagraph: "Professional SEO optimization suite with AI-powered automation and comprehensive analysis tools",
      badgeContentAnalysis: "Content Analysis",
      badgeAIGenerator: "AI Content Generator",
      badgeAdvancedAnalytics: "Advanced Analytics",
      badgeTechnicalSEO: "Technical SEO",
      badgeSchemaMarkup: "Schema Markup",
      badgeKeywordResearch: "Keyword Research",
      badgeLangSupport: "Thai/English Support",
      tabAnalyzer: "Analyzer",
      tabGenerator: "Generator",
      tabAnalytics: "Analytics",
      tabKeywords: "Keywords",
      tabMetaTags: "Meta Tags",
      tabSchema: "Schema",
      tabTechnical: "Technical",
      tabChatbot: "Chatbot",
      tabSettings: "Settings",
      mobileTabAnalyzer: "Analyze",
      mobileTabGenerator: "Gen",
      mobileTabAnalytics: "Stats",
      mobileTabKeywords: "Keys",
      mobileTabMetaTags: "Meta",
      mobileTabSchema: "Schema",
      mobileTabTechnical: "Tech",
      mobileTabChatbot: "Chat",
      mobileTabSettings: "Config",
    },
    th: {
      headerTitle: "Flux SEO Pro Optimizer", // Keeping brand name
      headerParagraph: "ชุดเครื่องมือ SEO ครบวงจร พร้อมระบบอัตโนมัติ AI และการวิเคราะห์เชิงลึก",
      badgeContentAnalysis: "วิเคราะห์เนื้อหา",
      badgeAIGenerator: "สร้างเนื้อหา AI",
      badgeAdvancedAnalytics: "วิเคราะห์ขั้นสูง",
      badgeTechnicalSEO: "SEO เชิงเทคนิค",
      badgeSchemaMarkup: "Schema Markup", // Technical term
      badgeKeywordResearch: "วิจัยคีย์เวิร์ด",
      badgeLangSupport: "รองรับไทย/อังกฤษ", // Translated
      tabAnalyzer: "เครื่องมือวิเคราะห์",
      tabGenerator: "เครื่องมือสร้าง",
      tabAnalytics: "การวิเคราะห์",
      tabKeywords: "คีย์เวิร์ด",
      tabMetaTags: "Meta Tags", // Technical term
      tabSchema: "Schema", // Technical term
      tabTechnical: "เชิงเทคนิค",
      tabChatbot: "แชทบอท",
      tabSettings: "ตั้งค่า",
      mobileTabAnalyzer: "วิเคราะห์",
      mobileTabGenerator: "สร้าง",
      mobileTabAnalytics: "สถิติ",
      mobileTabKeywords: "คีย์",
      mobileTabMetaTags: "เมตา",
      mobileTabSchema: "สกีมา",
      mobileTabTechnical: "เทคนิค",
      mobileTabChatbot: "แชท",
      mobileTabSettings: "ตั้งค่า",
    }
  };

  const t = translations[language];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.headerTitle}
            </h1>
          </div>
          <div className="absolute top-0 right-0 mt-0 mr-0 md:mt-1 md:mr-1">
            <LanguageSwitcher />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.headerParagraph}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">{t.badgeContentAnalysis}</Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700">{t.badgeAIGenerator}</Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">{t.badgeAdvancedAnalytics}</Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">{t.badgeTechnicalSEO}</Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">{t.badgeSchemaMarkup}</Badge>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">{t.badgeKeywordResearch}</Badge>
            <Badge variant="secondary" className="bg-teal-100 text-teal-700">{t.badgeLangSupport}</Badge>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/20">
            <TabsList className="grid w-full h-auto bg-transparent p-1 gap-1" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}>
              <TabsTrigger 
                value="analyzer" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabAnalyzer}</span>
                <span className="md:hidden">{t.mobileTabAnalyzer}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="generator" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabGenerator}</span>
                <span className="md:hidden">{t.mobileTabGenerator}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabAnalytics}</span>
                <span className="md:hidden">{t.mobileTabAnalytics}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="keywords" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Target className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabKeywords}</span>
                <span className="md:hidden">{t.mobileTabKeywords}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="meta" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabMetaTags}</span>
                <span className="md:hidden">{t.mobileTabMetaTags}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="schema" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Code className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabSchema}</span>
                <span className="md:hidden">{t.mobileTabSchema}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="technical" 
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabTechnical}</span>
                <span className="md:hidden">{t.mobileTabTechnical}</span>
              </TabsTrigger>
              <TabsTrigger
                value="chatbot"
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabChatbot}</span>
                <span className="md:hidden">{t.mobileTabChatbot}</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">{t.tabSettings}</span>
                <span className="md:hidden">{t.mobileTabSettings}</span>
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
