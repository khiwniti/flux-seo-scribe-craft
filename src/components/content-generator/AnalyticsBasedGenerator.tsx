
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Brain } from 'lucide-react';
import AnalyticsOverview from './analytics/AnalyticsOverview';
import BlogSuggestions from './analytics/BlogSuggestions';
import ContentGenerator from './analytics/ContentGenerator';
import { useAnalyticsData } from './analytics/useAnalyticsData';
import { useContentGeneration } from './analytics/useContentGeneration';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

const AnalyticsBasedGenerator = () => {
  const { language } = useLanguage(); // Consume language context
  const { analyticsData, blogSuggestions, isAnalyzing } = useAnalyticsData();
  const { isGenerating, selectedSuggestion, generatedContent, generateBlogContent, resetGenerator } = useContentGeneration();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    cardTitle: t("Analytics-Powered Blog Generation", "สร้างบล็อกโพสต์จากข้อมูลวิเคราะห์"),
    cardDescription: t("AI analyzes your SEO data to suggest high-impact blog topics and generate optimized content", "AI วิเคราะห์ข้อมูล SEO ของคุณเพื่อแนะนำหัวข้อบล็อกที่ส่งผลกระทบสูงและสร้างเนื้อหาที่ปรับให้เหมาะสม"),
    analyzingData: t("Analyzing your SEO performance data...", "กำลังวิเคราะห์ข้อมูลประสิทธิภาพ SEO ของคุณ..."),
    tabAnalyticsOverview: t("Analytics Overview", "ภาพรวมการวิเคราะห์"),
    tabContentSuggestions: t("Content Suggestions", "คำแนะนำเนื้อหา"),
    tabContentGenerator: t("Content Generator", "เครื่องมือสร้างเนื้อหา"),
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-600" />
            {T.cardTitle}
          </CardTitle>
          <CardDescription>
            {T.cardDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!analyticsData ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
                <p className="text-gray-600">{T.analyzingData}</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="suggestions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analytics">{T.tabAnalyticsOverview}</TabsTrigger>
                <TabsTrigger value="suggestions">{T.tabContentSuggestions}</TabsTrigger>
                <TabsTrigger value="generator">{T.tabContentGenerator}</TabsTrigger>
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
