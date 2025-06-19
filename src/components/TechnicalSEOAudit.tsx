
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, AlertTriangle, CheckCircle, XCircle, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditResult {
  category: string;
  items: {
    name: string;
    status: 'pass' | 'warning' | 'fail';
    description: string;
  }[];
}

const TechnicalSEOAudit = () => {
  const [language, setLanguage] = useState('en');
  const [url, setUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const { toast } = useToast();

  const runAudit = async () => {
    if (!url.trim()) {
      toast({
        title: language === 'th' ? "กรุณาใส่ URL" : "Please enter URL",
        description: language === 'th' ? "ใส่ URL ของเว็บไซต์ที่ต้องการตรวจสอบ" : "Enter the website URL to audit",
        variant: "destructive"
      });
      return;
    }

    setIsAuditing(true);
    
    // Simulate audit process
    setTimeout(() => {
      const mockResults: AuditResult[] = [
        {
          category: language === 'th' ? 'ประสิทธิภาพ' : 'Performance',
          items: [
            { name: language === 'th' ? 'ความเร็วในการโหลด' : 'Page Load Speed', status: 'warning', description: language === 'th' ? 'หน้าเว็บโหลดใน 3.2 วินาที (ควรน้อยกว่า 3 วินาที)' : 'Page loads in 3.2s (should be under 3s)' },
            { name: language === 'th' ? 'การบีบอัดรูปภาพ' : 'Image Optimization', status: 'fail', description: language === 'th' ? 'รูปภาพหลายรูปยังไม่ได้ปรับขนาดที่เหมาะสม' : 'Several images are not optimized' },
            { name: language === 'th' ? 'การบีบอัด CSS/JS' : 'CSS/JS Minification', status: 'pass', description: language === 'th' ? 'ไฟล์ถูกบีบอัดแล้ว' : 'Files are properly minified' }
          ]
        },
        {
          category: language === 'th' ? 'โครงสร้าง HTML' : 'HTML Structure',
          items: [
            { name: language === 'th' ? 'Title Tags' : 'Title Tags', status: 'pass', description: language === 'th' ? 'ทุกหน้ามี title tag ที่เหมาะสม' : 'All pages have proper title tags' },
            { name: language === 'th' ? 'Meta Descriptions' : 'Meta Descriptions', status: 'warning', description: language === 'th' ? 'บางหน้าไม่มี meta description' : 'Some pages missing meta descriptions' },
            { name: language === 'th' ? 'Header Tags (H1-H6)' : 'Header Tags (H1-H6)', status: 'pass', description: language === 'th' ? 'มีการใช้ header tags อย่างถูกต้อง' : 'Proper header tag structure' }
          ]
        },
        {
          category: language === 'th' ? 'ความปลอดภัย' : 'Security',
          items: [
            { name: 'HTTPS', status: 'pass', description: language === 'th' ? 'เว็บไซต์ใช้ HTTPS' : 'Website uses HTTPS' },
            { name: 'SSL Certificate', status: 'pass', description: language === 'th' ? 'ใบรับรอง SSL ถูกต้อง' : 'Valid SSL certificate' },
            { name: language === 'th' ? 'การเปลี่ยนเส้นทาง' : 'Redirects', status: 'warning', description: language === 'th' ? 'พบการเปลี่ยนเส้นทางหลายชั้น' : 'Multiple redirect chains found' }
          ]
        },
        {
          category: language === 'th' ? 'การเข้าถึงได้' : 'Accessibility',
          items: [
            { name: language === 'th' ? 'Alt Text สำหรับรูปภาพ' : 'Image Alt Text', status: 'warning', description: language === 'th' ? 'รูปภาพบางรูปไม่มี alt text' : 'Some images missing alt text' },
            { name: language === 'th' ? 'ความตัดกันของสี' : 'Color Contrast', status: 'pass', description: language === 'th' ? 'ความตัดกันของสีเพียงพอ' : 'Sufficient color contrast' },
            { name: language === 'th' ? 'การนำทาง' : 'Navigation', status: 'pass', description: language === 'th' ? 'เมนูนำทางชัดเจน' : 'Clear navigation structure' }
          ]
        }
      ];

      setAuditResults(mockResults);
      
      // Calculate overall score
      const totalItems = mockResults.reduce((acc, category) => acc + category.items.length, 0);
      const passedItems = mockResults.reduce((acc, category) => 
        acc + category.items.filter(item => item.status === 'pass').length, 0
      );
      const score = Math.round((passedItems / totalItems) * 100);
      setOverallScore(score);
      
      setIsAuditing(false);
      toast({
        title: language === 'th' ? "การตรวจสอบเสร็จสิ้น!" : "Audit Complete!",
        description: language === 'th' ? `คะแนน SEO ของคุณคือ ${score}%` : `Your SEO score is ${score}%`
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
        return <Badge variant="secondary" className="bg-green-100 text-green-700">{language === 'th' ? 'ผ่าน' : 'Pass'}</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">{language === 'th' ? 'คำเตือน' : 'Warning'}</Badge>;
      case 'fail':
        return <Badge variant="destructive">{language === 'th' ? 'ไม่ผ่าน' : 'Fail'}</Badge>;
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
              {language === 'th' ? 'ตรวจสอบ Technical SEO อัตโนมัติ' : 'Automated Technical SEO Audit'}
            </CardTitle>
            <CardDescription>
              {language === 'th' 
                ? 'ตรวจสอบปัญหา SEO ทางเทคนิคและรับคำแนะนำเพื่อปรับปรุง'
                : 'Identify technical SEO issues and get recommendations for improvement'
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
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={language === 'th' ? 'https://example.com' : 'https://example.com'}
            className="flex-1"
          />
          <Button onClick={runAudit} disabled={isAuditing}>
            {isAuditing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            {isAuditing 
              ? (language === 'th' ? 'กำลังตรวจสอบ...' : 'Auditing...') 
              : (language === 'th' ? 'เริ่มตรวจสอบ' : 'Start Audit')
            }
          </Button>
        </div>

        {isAuditing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{language === 'th' ? 'กำลังวิเคราะห์...' : 'Analyzing...'}</span>
              <span>{language === 'th' ? 'กรุณารอสักครู่' : 'Please wait'}</span>
            </div>
            <Progress value={66} className="h-2" />
          </div>
        )}

        {auditResults.length > 0 && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{overallScore}%</div>
              <div className="text-lg font-medium mb-2">
                {language === 'th' ? 'คะแนน SEO โดยรวม' : 'Overall SEO Score'}
              </div>
              <Badge variant={overallScore >= 80 ? 'secondary' : overallScore >= 60 ? 'default' : 'destructive'} className="text-sm">
                {overallScore >= 80 ? (language === 'th' ? 'ดีเยี่ยม' : 'Excellent') :
                 overallScore >= 60 ? (language === 'th' ? 'ดี' : 'Good') :
                 (language === 'th' ? 'ต้องปรับปรุง' : 'Needs Improvement')}
              </Badge>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">{language === 'th' ? 'ทั้งหมด' : 'All'}</TabsTrigger>
                <TabsTrigger value="pass">{language === 'th' ? 'ผ่าน' : 'Passed'}</TabsTrigger>
                <TabsTrigger value="warning">{language === 'th' ? 'คำเตือน' : 'Warning'}</TabsTrigger>
                <TabsTrigger value="fail">{language === 'th' ? 'ไม่ผ่าน' : 'Failed'}</TabsTrigger>
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
