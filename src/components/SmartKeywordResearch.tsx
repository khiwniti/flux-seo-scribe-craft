import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, Lightbulb, Search, Sparkles, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  trend: 'up' | 'down' | 'stable';
  cpc: number;
}

const SmartKeywordResearch = () => {
  const { language } = useLanguage(); // Use global language context
  const [seedKeyword, setSeedKeyword] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<string[]>([]);
  const [contentIdeas, setContentIdeas] = useState<string[]>([]);
  const [autoSuggestions, setAutoSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    cardTitle: t("Intelligent Keyword Research", "วิจัยคำสำคัญอัจฉริยะ"),
    cardDescription: t("AI analyzes and suggests keywords automatically - minimal manual input required", "AI วิเคราะห์และแนะนำคำสำคัญอัตโนมัติ - ลดการกรอกข้อมูลด้วยมือ"),
    inputPlaceholder: t('Enter seed keyword e.g. "digital marketing"', 'ใส่คำสำคัญหลัก เช่น "การตลาดออนไลน์"'),
    researchingButton: t("Researching...", "กำลังวิจัย..."),
    researchButton: t("Smart Research", "วิจัยอัจฉริยะ"),
    autoSuggestionsLabel: t("Auto Suggestions", "คำแนะนำอัตโนมัติ"),
    tabMainKeywords: t("Main Keywords", "คำสำคัญหลัก"),
    tabLongTail: t("Long-tail Keywords", "คำสำคัญยาว"),
    tabContentIdeas: t("Content Ideas", "ไอเดียเนื้อหา"),
    difficultyEasy: t("Easy", "ง่าย"),
    difficultyMedium: t("Medium", "ปานกลาง"),
    difficultyHard: t("Hard", "ยาก"),
    searchVolumeLabel: t("Search Volume:", "ปริมาณการค้นหา:"),
    perMonthSuffix: t("/month", "/เดือน"),
    difficultyLabel: t("Difficulty:", "ความยาก:"),
    cpcLabel: t("CPC:", "CPC:"),
    badgeRecommended: t("Recommended", "แนะนำ"),
    contentIdeaDesc: t("AI-recommended content to boost organic traffic", "เนื้อหาที่แนะนำจาก AI สำหรับเพิ่ม organic traffic"),
    toastKeywordRequiredTitle: t("Please enter a keyword", "กรุณาใส่คำสำคัญ"),
    toastKeywordRequiredDesc: t("Enter a seed keyword to start research", "ใส่คำสำคัญหลักเพื่อเริ่มการวิจัย"),
    toastResearchCompleteTitle: t("Smart Keyword Research Complete!", "วิจัยคำสำคัญเสร็จสิ้น!"),
    toastResearchCompleteDesc: t("Found {count} keywords with deep insights", "พบคำสำคัญ {count} คำ พร้อมข้อมูลเชิงลึก"),
    // For mock data generation
    mockSuffixGuide: t("guide", "คู่มือ"),
    mockSuffixHowTo: t("how to", "วิธีทำ"),
    mockSuffixYear: t("2024", "ปี 2024"),
    mockSuffixTips: t("tips", "เทคนิค"),
    mockSuffixBenefits: t("benefits", "ข้อดี"),
    mockSuffixExamples: t("examples", "ตัวอย่าง"),
    mockSuffixTools: t("tools", "เครื่องมือ"),
    mockLongTailPrefix1: t("how to choose the best", "วิธีเลือก"),
    mockLongTailSuffix1: t("for beginners", "ที่ดีที่สุด"),
    mockLongTailSuffix2: t("beginner guide 2024", "สำหรับมือใหม่ 2024"),
    mockLongTailPrefix3: t("pros and cons of", "ข้อดีข้อเสียของ"),
    mockLongTailInfix4: t("vs competitors comparison", "vs คู่แข่ง เปรียบเทียบ"),
    mockLongTailPrefix5: t("common mistakes with", "ปัญหาที่พบบ่อยกับ"),
    mockLongTailPrefix6: t("future trends of", "แนวโน้มของ"),
    mockLongTailSuffix6: t("in 2024", "ในปี 2024"),
    mockIdeaPrefix1: t("Complete guide to", "คู่มือสมบูรณ์สำหรับ"),
    mockIdeaPrefix2: t("10 advanced techniques for", "10 เทคนิคการใช้"),
    mockIdeaInfix3: t("vs alternatives: detailed comparison", "vs คู่แข่ง: การเปรียบเทียบแบบละเอียด"),
    mockIdeaPrefix4: t("Common pitfalls to avoid with", "ข้อผิดพลาดที่ควรหลีกเลี่ยงเมื่อใช้"),
    mockIdeaPrefix5: t("Future of", "อนาคตของ"),
    mockIdeaSuffix5: t("in 2024-2025", "ในปี 2024-2025"),
  };


  // Auto-suggest related keywords as user types
  React.useEffect(() => {
    if (seedKeyword && seedKeyword.length > 2) {
      generateAutoSuggestions();
    } else {
      setAutoSuggestions([]);
    }
  }, [seedKeyword, language]); // Added language to re-generate suggestions if lang changes

  const generateAutoSuggestions = () => {
    const suggestions = [
      `${seedKeyword} ${T.mockSuffixGuide}`,
      `${seedKeyword} ${T.mockSuffixHowTo}`,
      `${seedKeyword} ${T.mockSuffixTips}`,
      `${seedKeyword} ${T.mockSuffixYear}`,
      `${seedKeyword} ${T.mockSuffixBenefits}`,
      `${seedKeyword} ${T.mockSuffixExamples}`
    ];
    setAutoSuggestions(suggestions);
  };

  const researchKeywords = async () => {
    if (!seedKeyword.trim()) {
      toast({
        title: T.toastKeywordRequiredTitle,
        description: T.toastKeywordRequiredDesc,
        variant: "destructive"
      });
      return;
    }

    setIsResearching(true);
    
    setTimeout(() => {
      const mockKeywords: Keyword[] = [
        { keyword: `${seedKeyword}`, volume: Math.floor(Math.random() * 10000 + 1000), difficulty: Math.floor(Math.random() * 60 + 20), trend: 'up', cpc: Math.random() * 3 + 0.5 },
        { keyword: `${seedKeyword} ${T.mockSuffixGuide}`, volume: Math.floor(Math.random() * 5000 + 500), difficulty: Math.floor(Math.random() * 50 + 15), trend: 'up', cpc: Math.random() * 2 + 0.3 },
        { keyword: `${seedKeyword} ${T.mockSuffixHowTo}`, volume: Math.floor(Math.random() * 3000 + 300), difficulty: Math.floor(Math.random() * 40 + 10), trend: 'stable', cpc: Math.random() * 1.5 + 0.2 },
        { keyword: `${seedKeyword} ${T.mockSuffixYear}`, volume: Math.floor(Math.random() * 2500 + 250), difficulty: Math.floor(Math.random() * 45 + 20), trend: 'up', cpc: Math.random() * 2.5 + 0.4 },
        { keyword: `${seedKeyword} ${T.mockSuffixTips}`, volume: Math.floor(Math.random() * 2000 + 200), difficulty: Math.floor(Math.random() * 35 + 15), trend: 'up', cpc: Math.random() * 1.8 + 0.3 },
        { keyword: `${seedKeyword} ${T.mockSuffixBenefits}`, volume: Math.floor(Math.random() * 1800 + 180), difficulty: Math.floor(Math.random() * 30 + 10), trend: 'stable', cpc: Math.random() * 1.2 + 0.2 },
        { keyword: `${seedKeyword} ${T.mockSuffixExamples}`, volume: Math.floor(Math.random() * 1500 + 150), difficulty: Math.floor(Math.random() * 25 + 5), trend: 'up', cpc: Math.random() * 1.0 + 0.1 },
        { keyword: `${seedKeyword} ${T.mockSuffixTools}`, volume: Math.floor(Math.random() * 1200 + 120), difficulty: Math.floor(Math.random() * 40 + 20), trend: 'stable', cpc: Math.random() * 2.0 + 0.5 }
      ];

      const mockLongTail = [
        `${T.mockLongTailPrefix1} ${seedKeyword} ${T.mockLongTailSuffix1}`,
        `${seedKeyword} ${T.mockLongTailSuffix2}`,
        `${T.mockLongTailPrefix3} ${seedKeyword}`,
        `${seedKeyword} ${T.mockLongTailInfix4}`,
        `${T.mockLongTailPrefix5} ${seedKeyword}`,
        `${T.mockLongTailPrefix6} ${seedKeyword} ${T.mockLongTailSuffix6}`
      ];

      const mockContentIdeas = [
        `${T.mockIdeaPrefix1} ${seedKeyword}`,
        `${T.mockIdeaPrefix2} ${seedKeyword}`,
        `${seedKeyword} ${T.mockIdeaInfix3}`,
        `${T.mockIdeaPrefix4} ${seedKeyword}`,
        `${T.mockIdeaPrefix5} ${seedKeyword} ${T.mockIdeaSuffix5}`
      ];

      setKeywords(mockKeywords);
      setLongTailKeywords(mockLongTail);
      setContentIdeas(mockContentIdeas);
      setIsResearching(false);
      
      toast({
        title: T.toastResearchCompleteTitle,
        description: T.toastResearchCompleteDesc.replace("{count}", mockKeywords.length.toString())
      });
    }, 2500);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-700';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty < 30) return T.difficultyEasy;
    if (difficulty < 60) return T.difficultyMedium;
    return T.difficultyHard;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />; // Represents stable
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {T.cardTitle}
              <Sparkles className="h-4 w-4 text-purple-500" />
            </CardTitle>
            <CardDescription>
             {T.cardDescription}
            </CardDescription>
          </div>
         {/* Removed local language switcher */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              placeholder={T.inputPlaceholder}
              className="flex-1"
            />
            <Button onClick={researchKeywords} disabled={isResearching}>
              <Search className="h-4 w-4 mr-2" />
              {isResearching 
                ? T.researchingButton
                : T.researchButton
              }
            </Button>
          </div>
          
          {autoSuggestions.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  {T.autoSuggestionsLabel}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {autoSuggestions.slice(0, 4).map((suggestion, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200"
                    onClick={() => setSeedKeyword(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {keywords.length > 0 && (
          <Tabs defaultValue="keywords" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="keywords">
                {T.tabMainKeywords}
              </TabsTrigger>
              <TabsTrigger value="longtail">
                {T.tabLongTail}
              </TabsTrigger>
              <TabsTrigger value="content">
                {T.tabContentIdeas}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="keywords" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {keywords.map((keyword, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{keyword.keyword}</span>
                        {getTrendIcon(keyword.trend)}
                      </div>
                      <Badge className={getDifficultyColor(keyword.difficulty)}>
                        {getDifficultyText(keyword.difficulty)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">{T.searchVolumeLabel}</span>
                        <div className="font-medium">{keyword.volume.toLocaleString()}{T.perMonthSuffix}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">{T.difficultyLabel}</span>
                        <div className="font-medium">{keyword.difficulty}/100</div>
                      </div>
                      <div>
                        <span className="text-gray-500">{T.cpcLabel}</span>
                        <div className="font-medium">${keyword.cpc.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="longtail" className="space-y-4 mt-4">
              <div className="grid gap-3">
                {longTailKeywords.map((keyword, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{keyword}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {T.badgeRecommended}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="grid gap-3">
                {contentIdeas.map((idea, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <span className="font-medium">{idea}</span>
                        <p className="text-sm text-gray-600 mt-1">
                          {T.contentIdeaDesc}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartKeywordResearch;
