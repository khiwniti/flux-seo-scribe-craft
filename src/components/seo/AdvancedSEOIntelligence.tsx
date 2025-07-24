import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Search, 
  Eye, 
  Globe, 
  Zap,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Clock,
  BarChart3,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOInsight {
  type: 'keyword' | 'content' | 'technical' | 'user' | 'competitive';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number;
  effort: number;
  recommendation: string;
  roi_score: number;
}

interface CompetitorAnalysis {
  domain: string;
  authority: number;
  keywords: number;
  traffic: number;
  gaps: string[];
  opportunities: string[];
}

const AdvancedSEOIntelligence = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<SEOInsight[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [seoScore, setSeoScore] = useState(0);
  const [growthPotential, setGrowthPotential] = useState(0);

  const t = (en: string, th: string) => language === 'th' ? th : en;

  const runAdvancedAnalysis = async () => {
    if (!url.trim()) {
      toast({
        title: t("URL Required", "ต้องใส่ URL"),
        description: t("Please enter a website URL to analyze", "กรุณาใส่ URL เว็บไซต์ที่ต้องการวิเคราะห์"),
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate advanced AI analysis
    setTimeout(() => {
      const mockInsights: SEOInsight[] = [
        {
          type: 'keyword',
          priority: 'critical',
          title: t('Missing high-value keywords', 'ขาดคำสำคัญที่มีค่าสูง'),
          description: t('Your site could rank for 15+ profitable keywords with minor content adjustments', 'เว็บไซต์ของคุณสามารถติดอันดับได้ 15+ คำสำคัญที่ทำกำไรได้ด้วยการปรับเนื้อหาเล็กน้อย'),
          impact: 85,
          effort: 30,
          recommendation: t('Target "voice search SEO" and "local SEO services" - low competition, high intent', 'เป้าหมาย "voice search SEO" และ "local SEO services" - แข่งขันต่ำ, ความตั้งใจสูง'),
          roi_score: 92
        },
        {
          type: 'content',
          priority: 'high',
          title: t('Content gap in trending topics', 'ช่องว่างเนื้อหาในหัวข้อที่เป็นกระแส'),
          description: t('AI detected 8 trending topics in your niche with zero competition', 'AI ตรวจพบ 8 หัวข้อที่เป็นกระแสในสาขาของคุณที่ไม่มีการแข่งขัน'),
          impact: 78,
          effort: 45,
          recommendation: t('Create pillar content around "AI-powered SEO automation" - 12k monthly searches', 'สร้างเนื้อหาหลักรอบ "AI-powered SEO automation" - 12k การค้นหาต่อเดือน'),
          roi_score: 87
        },
        {
          type: 'technical',
          priority: 'critical',
          title: t('Core Web Vitals optimization', 'การปรับปรุง Core Web Vitals'),
          description: t('LCP and CLS scores are affecting rankings - immediate 23% traffic boost possible', 'คะแนน LCP และ CLS กำลังส่งผลต่ออันดับ - สามารถเพิ่มทราฟฟิกได้ 23% ทันที'),
          impact: 90,
          effort: 60,
          recommendation: t('Implement lazy loading and compress images - 2.1s LCP improvement expected', 'ใช้ lazy loading และบีบอัดรูปภาพ - คาดว่า LCP จะดีขึ้น 2.1 วินาที'),
          roi_score: 95
        },
        {
          type: 'competitive',
          priority: 'high',
          title: t('Competitor vulnerability detected', 'ตรวจพบจุดอ่อนของคู่แข่ง'),
          description: t('Top 3 competitors have weak mobile optimization - opportunity to outrank', 'คู่แข่ง 3 อันดับแรกมีการปรับปรุงมือถือที่อ่อนแอ - โอกาสที่จะแซงหน้า'),
          impact: 82,
          effort: 40,
          recommendation: t('Focus on mobile-first content strategy for next 3 months', 'มุ่งเน้นกลยุทธ์เนื้อหา mobile-first ใน 3 เดือนหน้า'),
          roi_score: 89
        },
        {
          type: 'user',
          priority: 'medium',
          title: t('User intent mismatch', 'ความตั้งใจของผู้ใช้ไม่ตรงกัน'),
          description: t('38% of traffic has wrong intent - conversion potential lost', '38% ของทราฟฟิกมีความตั้งใจผิด - สูญเสียศักยภาพการแปลง'),
          impact: 65,
          effort: 35,
          recommendation: t('Restructure landing pages to match search intent patterns', 'ปรับโครงสร้างหน้า landing ให้ตรงกับรูปแบบความตั้งใจในการค้นหา'),
          roi_score: 74
        }
      ];

      const mockCompetitors: CompetitorAnalysis[] = [
        {
          domain: 'competitor1.com',
          authority: 65,
          keywords: 2450,
          traffic: 125000,
          gaps: [
            t('Weak local SEO', 'Local SEO อ่อน'),
            t('No schema markup', 'ไม่มี schema markup'),
            t('Poor mobile UX', 'UX มือถือแย่')
          ],
          opportunities: [
            t('Target their top keywords with better content', 'เป้าหมายคำสำคัญหลักของพวกเขาด้วยเนื้อหาที่ดีกว่า'),
            t('Steal their featured snippets', 'ขโมย featured snippets ของพวกเขา')
          ]
        },
        {
          domain: 'competitor2.com',
          authority: 58,
          keywords: 1890,
          traffic: 98000,
          gaps: [
            t('Slow page speed', 'ความเร็วหน้าเว็บช้า'),
            t('Outdated content', 'เนื้อหาล้าสมัย')
          ],
          opportunities: [
            t('Create fresher, more comprehensive guides', 'สร้างคู่มือที่ใหม่และครอบคลุมมากขึ้น')
          ]
        }
      ];

      setInsights(mockInsights);
      setCompetitors(mockCompetitors);
      setSeoScore(Math.floor(Math.random() * 20 + 75));
      setGrowthPotential(Math.floor(Math.random() * 30 + 60));
      setIsAnalyzing(false);

      toast({
        title: t("Advanced SEO Analysis Complete", "การวิเคราะห์ SEO ขั้นสูงเสร็จสิ้น"),
        description: t(`Found ${mockInsights.length} actionable insights`, `พบข้อมูลเชิงลึกที่สามารถดำเนินการได้ ${mockInsights.length} รายการ`)
      });
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword': return <Target className="h-4 w-4" />;
      case 'content': return <Eye className="h-4 w-4" />;
      case 'technical': return <Zap className="h-4 w-4" />;
      case 'user': return <Search className="h-4 w-4" />;
      case 'competitive': return <TrendingUp className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {t("Advanced SEO Intelligence", "ระบบวิเคราะห์ SEO ขั้นสูง")}
          <Star className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        <CardDescription>
          {t("AI-powered deep analysis with actionable insights and competitive intelligence", "การวิเคราะห์เชิงลึกด้วย AI พร้อมข้อมูลเชิงลึกที่สามารถดำเนินการได้และความฉลาดเชิงการแข่งขัน")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("Enter website URL for analysis...", "ใส่ URL เว็บไซต์เพื่อวิเคราะห์...")}
            className="flex-1"
          />
          <Button onClick={runAdvancedAnalysis} disabled={isAnalyzing}>
            <Brain className="h-4 w-4 mr-2" />
            {isAnalyzing ? t("Analyzing...", "กำลังวิเคราะห์...") : t("Analyze", "วิเคราะห์")}
          </Button>
        </div>

        {isAnalyzing && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="font-medium text-blue-700">
                {t("Running Advanced AI Analysis...", "กำลังเรียกใช้การวิเคราะห์ AI ขั้นสูง...")}
              </span>
            </div>
            <div className="space-y-2 text-sm text-blue-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {t("Scanning technical SEO factors", "สแกนปัจจัย SEO ทางเทคนิค")}
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {t("Analyzing competitor landscape", "วิเคราะห์ภูมิทัศน์ของคู่แข่ง")}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("Generating growth recommendations", "สร้างคำแนะนำการเติบโต")}
              </div>
            </div>
          </Card>
        )}

        {insights.length > 0 && (
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights">
                {t("AI Insights", "ข้อมูลเชิงลึก AI")}
              </TabsTrigger>
              <TabsTrigger value="competitors">
                {t("Competitor Analysis", "วิเคราะห์คู่แข่ง")}
              </TabsTrigger>
              <TabsTrigger value="performance">
                {t("Performance Score", "คะแนนประสิทธิภาพ")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(insight.type)}
                        <span className="font-medium">{insight.title}</span>
                      </div>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {t(insight.priority, insight.priority === 'critical' ? 'วิกฤต' : 
                           insight.priority === 'high' ? 'สูง' : 
                           insight.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                      <div>
                        <span className="text-gray-500">{t("Impact", "ผลกระทบ")}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={insight.impact} className="h-2" />
                          <span className="font-medium">{insight.impact}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("Effort", "ความพยายาม")}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={insight.effort} className="h-2" />
                          <span className="font-medium">{insight.effort}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("ROI Score", "คะแนน ROI")}</span>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-3 w-3 text-green-600" />
                          <span className="font-medium text-green-600">{insight.roi_score}/100</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">
                          {t("AI Recommendation", "คำแนะนำ AI")}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600">{insight.recommendation}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="competitors" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {competitors.map((competitor, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-medium">{competitor.domain}</span>
                      </div>
                      <Badge variant="outline">
                        {t("Authority", "อำนาจ")}: {competitor.authority}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">{t("Keywords", "คำสำคัญ")}</span>
                        <div className="font-medium">{competitor.keywords.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("Monthly Traffic", "ทราฟฟิกรายเดือน")}</span>
                        <div className="font-medium">{competitor.traffic.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("Domain Authority", "อำนาจโดเมน")}</span>
                        <div className="font-medium">{competitor.authority}/100</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">
                          {t("Their Weaknesses", "จุดอ่อนของพวกเขา")}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {competitor.gaps.map((gap, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              {gap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">
                          {t("Your Opportunities", "โอกาสของคุณ")}
                        </h4>
                        <div className="space-y-1">
                          {competitor.opportunities.map((opportunity, idx) => (
                            <div key={idx} className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {opportunity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700 mb-2">{seoScore}/100</div>
                    <div className="text-sm text-blue-600 mb-4">
                      {t("Current SEO Score", "คะแนน SEO ปัจจุบัน")}
                    </div>
                    <Progress value={seoScore} className="h-3" />
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700 mb-2">{growthPotential}%</div>
                    <div className="text-sm text-green-600 mb-4">
                      {t("Growth Potential", "ศักยภาพการเติบโต")}
                    </div>
                    <Progress value={growthPotential} className="h-3" />
                  </div>
                </Card>
              </div>
              
              <Card className="p-4">
                <h3 className="font-medium mb-3">
                  {t("AI Performance Predictions", "การคาดการณ์ประสิทธิภาพ AI")}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>{t("Traffic increase in 3 months", "เพิ่มทราฟฟิกใน 3 เดือน")}</span>
                    <Badge className="bg-green-100 text-green-700">+23%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>{t("Keyword ranking improvements", "การปรับปรุงอันดับคำสำคัญ")}</span>
                    <Badge className="bg-blue-100 text-blue-700">+15 positions</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span>{t("Conversion rate optimization", "การปรับปรุงอัตราการแปลง")}</span>
                    <Badge className="bg-purple-100 text-purple-700">+8%</Badge>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSEOIntelligence;