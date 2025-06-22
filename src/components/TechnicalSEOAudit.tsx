
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, AlertTriangle, CheckCircle, XCircle, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

interface AuditResult {
  category: string;
  items: {
    name: string;
    status: 'pass' | 'warning' | 'fail';
    description: string;
  }[];
}

const TechnicalSEOAudit = () => {
  const { language } = useLanguage(); // Use global language context
  const [url, setUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const { toast } = useToast();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    cardTitle: t("Automated Technical SEO Audit", "ตรวจสอบ Technical SEO อัตโนมัติ"),
    cardDescription: t("Identify technical SEO issues and get recommendations for improvement", "ตรวจสอบปัญหา SEO ทางเทคนิคและรับคำแนะนำเพื่อปรับปรุง"),
    inputPlaceholderUrl: t("https://example.com", "https://example.com"),
    buttonAuditing: t("Auditing...", "กำลังตรวจสอบ..."),
    buttonStartAudit: t("Start Audit", "เริ่มตรวจสอบ"),
    analyzingText: t("Analyzing...", "กำลังวิเคราะห์..."),
    pleaseWaitText: t("Please wait", "กรุณารอสักครู่"),
    overallScoreLabel: t("Overall SEO Score", "คะแนน SEO โดยรวม"),
    scoreExcellent: t("Excellent", "ดีเยี่ยม"),
    scoreGood: t("Good", "ดี"),
    scoreNeedsImprovement: t("Needs Improvement", "ต้องปรับปรุง"),
    tabAll: t("All", "ทั้งหมด"),
    tabPassed: t("Passed", "ผ่าน"),
    tabWarning: t("Warning", "คำเตือน"),
    tabFailed: t("Failed", "ไม่ผ่าน"),
    badgePass: t("Pass", "ผ่าน"),
    badgeWarning: t("Warning", "คำเตือน"),
    badgeFail: t("Fail", "ไม่ผ่าน"),
    toastUrlRequiredTitle: t("Please enter URL", "กรุณาใส่ URL"),
    toastUrlRequiredDesc: t("Enter the website URL to audit", "ใส่ URL ของเว็บไซต์ที่ต้องการตรวจสอบ"),
    toastAuditCompleteTitle: t("Audit Complete!", "การตรวจสอบเสร็จสิ้น!"),
    toastAuditCompleteDesc: t("Your SEO score is {score}%", "คะแนน SEO ของคุณคือ {score}%"),
    // Mock Data Categories
    categoryPerformance: t("Performance", "ประสิทธิภาพ"),
    categoryHtmlStructure: t("HTML Structure", "โครงสร้าง HTML"),
    categorySecurity: t("Security", "ความปลอดภัย"),
    categoryAccessibility: t("Accessibility", "การเข้าถึงได้"),
    // Mock Data Items - Performance
    perfItemPageSpeedName: t("Page Load Speed", "ความเร็วในการโหลด"),
    perfItemPageSpeedDesc: t("Page loads in 3.2s (should be under 3s)", "หน้าเว็บโหลดใน 3.2 วินาที (ควรน้อยกว่า 3 วินาที)"),
    perfItemImageOptName: t("Image Optimization", "การบีบอัดรูปภาพ"),
    perfItemImageOptDesc: t("Several images are not optimized", "รูปภาพหลายรูปยังไม่ได้ปรับขนาดที่เหมาะสม"),
    perfItemMinificationName: t("CSS/JS Minification", "การบีบอัด CSS/JS"),
    perfItemMinificationDesc: t("Files are properly minified", "ไฟล์ถูกบีบอัดแล้ว"),
    // Mock Data Items - HTML
    htmlItemTitleTagsName: t("Title Tags", "Title Tags"),
    htmlItemTitleTagsDesc: t("All pages have proper title tags", "ทุกหน้ามี title tag ที่เหมาะสม"),
    htmlItemMetaDescName: t("Meta Descriptions", "Meta Descriptions"),
    htmlItemMetaDescDesc: t("Some pages missing meta descriptions", "บางหน้าไม่มี meta description"),
    htmlItemHeaderTagsName: t("Header Tags (H1-H6)", "Header Tags (H1-H6)"),
    htmlItemHeaderTagsDesc: t("Proper header tag structure", "มีการใช้ header tags อย่างถูกต้อง"),
    // Mock Data Items - Security
    secItemHTTPSName: "HTTPS", // Usually not translated
    secItemHTTPSDesc: t("Website uses HTTPS", "เว็บไซต์ใช้ HTTPS"),
    secItemSSLName: t("SSL Certificate", "ใบรับรอง SSL"), // Or "SSL Certificate"
    secItemSSLDesc: t("Valid SSL certificate", "ใบรับรอง SSL ถูกต้อง"),
    secItemRedirectsName: t("Redirects", "การเปลี่ยนเส้นทาง"),
    secItemRedirectsDesc: t("Multiple redirect chains found", "พบการเปลี่ยนเส้นทางหลายชั้น"),
    // Mock Data Items - Accessibility
    accessItemAltTextName: t("Image Alt Text", "Alt Text สำหรับรูปภาพ"),
    accessItemAltTextDesc: t("Some images missing alt text", "รูปภาพบางรูปไม่มี alt text"),
    accessItemColorContrastName: t("Color Contrast", "ความตัดกันของสี"),
    accessItemColorContrastDesc: t("Sufficient color contrast", "ความตัดกันของสีเพียงพอ"),
    accessItemNavigationName: t("Navigation", "การนำทาง"),
    accessItemNavigationDesc: t("Clear navigation structure", "เมนูนำทางชัดเจน"),
  };

  const runAudit = async () => {
    if (!url.trim()) {
      toast({
        title: T.toastUrlRequiredTitle,
        description: T.toastUrlRequiredDesc,
        variant: "destructive"
      });
      return;
    }

    setIsAuditing(true);
    
    // Simulate audit process
    setTimeout(() => {
      const mockResults: AuditResult[] = [
        {
          category: T.categoryPerformance,
          items: [
            { name: T.perfItemPageSpeedName, status: 'warning', description: T.perfItemPageSpeedDesc },
            { name: T.perfItemImageOptName, status: 'fail', description: T.perfItemImageOptDesc },
            { name: T.perfItemMinificationName, status: 'pass', description: T.perfItemMinificationDesc }
          ]
        },
        {
          category: T.categoryHtmlStructure,
          items: [
            { name: T.htmlItemTitleTagsName, status: 'pass', description: T.htmlItemTitleTagsDesc },
            { name: T.htmlItemMetaDescName, status: 'warning', description: T.htmlItemMetaDescDesc },
            { name: T.htmlItemHeaderTagsName, status: 'pass', description: T.htmlItemHeaderTagsDesc }
          ]
        },
        {
          category: T.categorySecurity,
          items: [
            { name: T.secItemHTTPSName, status: 'pass', description: T.secItemHTTPSDesc },
            { name: T.secItemSSLName, status: 'pass', description: T.secItemSSLDesc },
            { name: T.secItemRedirectsName, status: 'warning', description: T.secItemRedirectsDesc }
          ]
        },
        {
          category: T.categoryAccessibility,
          items: [
            { name: T.accessItemAltTextName, status: 'warning', description: T.accessItemAltTextDesc },
            { name: T.accessItemColorContrastName, status: 'pass', description: T.accessItemColorContrastDesc },
            { name: T.accessItemNavigationName, status: 'pass', description: T.accessItemNavigationDesc }
          ]
        }
      ];

      setAuditResults(mockResults);
      
      const totalItems = mockResults.reduce((acc, category) => acc + category.items.length, 0);
      const passedItems = mockResults.reduce((acc, category) => 
        acc + category.items.filter(item => item.status === 'pass').length, 0
      );
      const score = Math.round((passedItems / totalItems) * 100);
      setOverallScore(score);
      
      setIsAuditing(false);
      toast({
        title: T.toastAuditCompleteTitle,
        description: T.toastAuditCompleteDesc.replace("{score}", score.toString())
      });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">{T.badgePass}</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">{T.badgeWarning}</Badge>;
      case 'fail':
        return <Badge variant="destructive">{T.badgeFail}</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {T.cardTitle}
            </CardTitle>
            <CardDescription>
              {T.cardDescription}
            </CardDescription>
          </div>
          {/* Removed local language switcher */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={T.inputPlaceholderUrl}
            className="flex-1"
          />
          <Button onClick={runAudit} disabled={isAuditing}>
            {isAuditing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            {isAuditing 
              ? T.buttonAuditing
              : T.buttonStartAudit
            }
          </Button>
        </div>

        {isAuditing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{T.analyzingText}</span>
              <span>{T.pleaseWaitText}</span>
            </div>
            <Progress value={66} className="h-2" /> {/* Placeholder progress */}
          </div>
        )}

        {auditResults.length > 0 && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{overallScore}%</div>
              <div className="text-lg font-medium mb-2">
                {T.overallScoreLabel}
              </div>
              <Badge variant={overallScore >= 80 ? 'secondary' : overallScore >= 60 ? 'default' : 'destructive'} className="text-sm">
                {overallScore >= 80 ? T.scoreExcellent :
                 overallScore >= 60 ? T.scoreGood :
                 T.scoreNeedsImprovement}
              </Badge>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">{T.tabAll}</TabsTrigger>
                <TabsTrigger value="pass">{T.tabPassed}</TabsTrigger>
                <TabsTrigger value="warning">{T.tabWarning}</TabsTrigger>
                <TabsTrigger value="fail">{T.tabFailed}</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {auditResults.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                            {getStatusIcon(item.status)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{item.name}</span>
                                {getStatusBadge(item.status)}
                              </div>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {(['pass', 'warning', 'fail'] as const).map((status) => (
                <TabsContent key={status} value={status} className="space-y-4 mt-4">
                  {auditResults.map((category, categoryIndex) => {
                    const filteredItems = category.items.filter(item => item.status === status);
                    if (filteredItems.length === 0) return null;
                    
                    return (
                      <Card key={categoryIndex}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{category.category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {filteredItems.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                {getStatusIcon(item.status)}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{item.name}</span>
                                    {getStatusBadge(item.status)}
                                  </div>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalSEOAudit;
