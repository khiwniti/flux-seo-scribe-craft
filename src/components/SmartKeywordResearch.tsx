
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, Lightbulb, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  trend: 'up' | 'down' | 'stable';
  cpc: number;
}

const SmartKeywordResearch = () => {
  const [language, setLanguage] = useState('en');
  const [seedKeyword, setSeedKeyword] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<string[]>([]);
  const [contentIdeas, setContentIdeas] = useState<string[]>([]);
  const { toast } = useToast();

  const researchKeywords = async () => {
    if (!seedKeyword.trim()) {
      toast({
        title: language === 'th' ? "กรุณาใส่คำสำคัญ" : "Please enter a keyword",
        description: language === 'th' ? "ใส่คำสำคัญหลักเพื่อเริ่มการวิจัย" : "Enter a seed keyword to start research",
        variant: "destructive"
      });
      return;
    }

    setIsResearching(true);
    
    // Simulate AI keyword research
    setTimeout(() => {
      const mockKeywords: Keyword[] = [
        { keyword: `${seedKeyword}`, volume: 8100, difficulty: 45, trend: 'up', cpc: 2.30 },
        { keyword: `${seedKeyword} ${language === 'th' ? 'ราคา' : 'price'}`, volume: 3200, difficulty: 38, trend: 'stable', cpc: 1.85 },
        { keyword: `${seedKeyword} ${language === 'th' ? 'รีวิว' : 'review'}`, volume: 2400, difficulty: 35, trend: 'up', cpc: 1.50 },
        { keyword: `${seedKeyword} ${language === 'th' ? 'คุณภาพดี' : 'best quality'}`, volume: 1900, difficulty: 42, trend: 'up', cpc: 2.10 },
        { keyword: `${seedKeyword} ${language === 'th' ? 'ออนไลน์' : 'online'}`, volume: 1600, difficulty: 40, trend: 'stable', cpc: 1.95 },
        { keyword: `${seedKeyword} ${language === 'th' ? 'ส่วนลด' : 'discount'}`, volume: 1200, difficulty: 28, trend: 'up', cpc: 1.20 },
        { keyword: `${seedKeyword} ${language === 'th' ? 'เปรียบเทียบ' : 'comparison'}`, volume: 980, difficulty: 33, trend: 'stable', cpc: 1.70 },
        { keyword: `${seedKeyword} ${language === 'th' ? 'วิธีใช้' : 'how to use'}`, volume: 850, difficulty: 25, trend: 'up', cpc: 0.95 }
      ];

      const mockLongTail = [
        `${language === 'th' ? 'วิธีเลือก' : 'how to choose'} ${seedKeyword} ${language === 'th' ? 'ที่ดีที่สุด' : 'that works best'}`,
        `${seedKeyword} ${language === 'th' ? 'สำหรับมือใหม่' : 'for beginners guide'}`,
        `${language === 'th' ? 'ข้อดีข้อเสียของ' : 'pros and cons of'} ${seedKeyword}`,
        `${seedKeyword} ${language === 'th' ? 'ยี่ห้อไหนดี 2024' : 'best brands 2024'}`,
        `${language === 'th' ? 'ปัญหาที่พบบ่อยกับ' : 'common problems with'} ${seedKeyword}`
      ];

      const mockContentIdeas = [
        `${language === 'th' ? 'คู่มือสมบูรณ์สำหรับ' : 'Complete guide to'} ${seedKeyword}`,
        `${language === 'th' ? '10 เทคนิคการใช้' : '10 tips for using'} ${seedKeyword}`,
        `${seedKeyword} ${language === 'th' ? 'vs คู่แข่ง: เปรียบเทียบแบบละเอียด' : 'vs competitors: detailed comparison'}`,
        `${language === 'th' ? 'ข้อผิดพลาดที่ควรหลีกเลี่ยงเมื่อใช้' : 'Common mistakes to avoid with'} ${seedKeyword}`,
        `${language === 'th' ? 'อนาคตของ' : 'Future of'} ${seedKeyword} ${language === 'th' ? 'ในปี 2024' : 'in 2024'}`
      ];

      setKeywords(mockKeywords);
      setLongTailKeywords(mockLongTail);
      setContentIdeas(mockContentIdeas);
      setIsResearching(false);
      
      toast({
        title: language === 'th' ? "วิจัยคำสำคัญเสร็จสิ้น!" : "Keyword Research Complete!",
        description: language === 'th' ? `พบคำสำคัญ ${mockKeywords.length} คำ` : `Found ${mockKeywords.length} keywords`
      });
    }, 2500);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-700';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty < 30) return language === 'th' ? 'ง่าย' : 'Easy';
    if (difficulty < 60) return language === 'th' ? 'ปานกลาง' : 'Medium';
    return language === 'th' ? 'ยาก' : 'Hard';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {language === 'th' ? 'วิจัยคำสำคัญอัจฉริยะ' : 'Smart Keyword Research'}
            </CardTitle>
            <CardDescription>
              {language === 'th' 
                ? 'ค้นหาคำสำคัญที่มีประสิทธิภาพด้วย AI และวิเคราะห์แนวโน้ม'
                : 'Discover high-performing keywords with AI analysis and trend insights'
              }
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              EN
            </Button>
            <Button
              variant={language === 'th' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('th')}
            >
              TH
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
            placeholder={language === 'th' ? 'ใส่คำสำคัญหลัก เช่น "การตลาดออนไลน์"' : 'Enter seed keyword e.g. "digital marketing"'}
            className="flex-1"
          />
          <Button onClick={researchKeywords} disabled={isResearching}>
            <Search className="h-4 w-4 mr-2" />
            {isResearching 
              ? (language === 'th' ? 'กำลังวิจัย...' : 'Researching...') 
              : (language === 'th' ? 'เริ่มวิจัย' : 'Start Research')
            }
          </Button>
        </div>

        {keywords.length > 0 && (
          <Tabs defaultValue="keywords" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="keywords">
                {language === 'th' ? 'คำสำคัญหลัก' : 'Main Keywords'}
              </TabsTrigger>
              <TabsTrigger value="longtail">
                {language === 'th' ? 'คำสำคัญยาว' : 'Long-tail Keywords'}
              </TabsTrigger>
              <TabsTrigger value="content">
                {language === 'th' ? 'ไอเดียเนื้อหา' : 'Content Ideas'}
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
                        <span className="text-gray-500">{language === 'th' ? 'ปริมาณการค้นหา:' : 'Search Volume:'}</span>
                        <div className="font-medium">{keyword.volume.toLocaleString()}/month</div>
                      </div>
                      <div>
                        <span className="text-gray-500">{language === 'th' ? 'ความยาก:' : 'Difficulty:'}</span>
                        <div className="font-medium">{keyword.difficulty}/100</div>
                      </div>
                      <div>
                        <span className="text-gray-500">CPC:</span>
                        <div className="font-medium">${keyword.cpc}</div>
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
                        {language === 'th' ? 'แนะนำ' : 'Recommended'}
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
                          {language === 'th' 
                            ? 'เนื้อหาที่แนะนำจาก AI สำหรับเพิ่ม organic traffic'
                            : 'AI-recommended content to boost organic traffic'
                          }
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
