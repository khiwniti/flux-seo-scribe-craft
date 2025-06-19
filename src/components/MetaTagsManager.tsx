
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Copy, Check, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MetaTagsManager = () => {
  const [language, setLanguage] = useState('en');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateMetaTags = async () => {
    if (!content.trim()) {
      toast({
        title: language === 'th' ? "กรุณาใส่เนื้อหา" : "Please enter content",
        description: language === 'th' ? "ใส่เนื้อหาเพื่อสร้าง Meta Tags อัตโนมัติ" : "Enter content to generate meta tags automatically",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation (in real app, this would call your AI service)
    setTimeout(() => {
      const words = content.split(' ').slice(0, 10).join(' ');
      
      if (language === 'th') {
        setTitle(`${words} - เว็บไซต์ชั้นนำในไทย`);
        setDescription(`ค้นพบ ${words} และข้อมูลเชิงลึกที่จะช่วยให้คุณประสบความสำเร็จ อ่านบทความครบถ้วนและเริ่มต้นใช้งานวันนี้`);
        setKeywords(`${words.toLowerCase()}, ไทย, ความสำเร็จ, คุณภาพ, มืออาชีพ`);
      } else {
        setTitle(`${words} - Professional Solutions & Expert Insights`);
        setDescription(`Discover ${words.toLowerCase()} and expert insights to help you succeed. Read our comprehensive guide and get started today with proven strategies.`);
        setKeywords(`${words.toLowerCase()}, professional, expert, solutions, success, quality`);
      }
      
      setIsGenerating(false);
      toast({
        title: language === 'th' ? "สร้าง Meta Tags สำเร็จ!" : "Meta Tags Generated!",
        description: language === 'th' ? "Meta Tags ถูกสร้างโดย AI แล้ว" : "AI has generated optimized meta tags"
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    const metaHtml = `<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">`;
    
    navigator.clipboard.writeText(metaHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: language === 'th' ? "คัดลอกแล้ว!" : "Copied!",
      description: language === 'th' ? "Meta Tags ถูกคัดลอกไปยังคลิปบอร์ดแล้ว" : "Meta tags copied to clipboard"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {language === 'th' ? 'จัดการ Meta Tags อัจฉริยะ' : 'Smart Meta Tags Manager'}
            </CardTitle>
            <CardDescription>
              {language === 'th' 
                ? 'สร้าง Meta Tags ที่เหมาะสมด้วย AI และเพิ่มประสิทธิภาพ SEO'
                : 'Generate optimized meta tags with AI and boost your SEO performance'
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'th' ? 'เนื้อหาหลัก (สำหรับวิเคราะห์)' : 'Main Content (for analysis)'}
            </label>
            <Textarea
              placeholder={language === 'th' 
                ? 'วางเนื้อหาของคุณที่นี่ เพื่อให้ AI วิเคราะห์และสร้าง Meta Tags ที่เหมาะสม...'
                : 'Paste your content here for AI to analyze and generate appropriate meta tags...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button onClick={generateMetaTags} disabled={isGenerating} className="w-full">
            <Wand2 className="h-4 w-4 mr-2" />
            {isGenerating 
              ? (language === 'th' ? 'กำลังสร้าง...' : 'Generating...') 
              : (language === 'th' ? 'สร้าง Meta Tags ด้วย AI' : 'Generate Meta Tags with AI')
            }
          </Button>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">
              {language === 'th' ? 'Meta Tags พื้นฐาน' : 'Basic Meta Tags'}
            </TabsTrigger>
            <TabsTrigger value="social">
              {language === 'th' ? 'Social Media Tags' : 'Social Media Tags'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'th' ? 'หัวข้อหน้า (Title)' : 'Page Title'}
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'th' ? 'หัวข้อของหน้าเว็บ (50-60 ตัวอักษร)' : 'Page title (50-60 characters)'}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{title.length} {language === 'th' ? 'ตัวอักษร' : 'characters'}</span>
                <Badge variant={title.length > 60 ? 'destructive' : title.length > 50 ? 'secondary' : 'default'}>
                  {title.length > 60 ? (language === 'th' ? 'ยาวเกินไป' : 'Too long') : 
                   title.length > 50 ? (language === 'th' ? 'ดี' : 'Good') : 
                   (language === 'th' ? 'สามารถเพิ่มได้' : 'Can add more')}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'th' ? 'คำอธิบาย (Description)' : 'Meta Description'}
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'th' ? 'คำอธิบายของหน้าเว็บ (150-160 ตัวอักษร)' : 'Page description (150-160 characters)'}
                rows={3}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{description.length} {language === 'th' ? 'ตัวอักษร' : 'characters'}</span>
                <Badge variant={description.length > 160 ? 'destructive' : description.length > 150 ? 'secondary' : 'default'}>
                  {description.length > 160 ? (language === 'th' ? 'ยาวเกินไป' : 'Too long') : 
                   description.length > 150 ? (language === 'th' ? 'ดี' : 'Good') : 
                   (language === 'th' ? 'สามารถเพิ่มได้' : 'Can add more')}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'th' ? 'คำสำคัญ (Keywords)' : 'Keywords'}
              </label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={language === 'th' ? 'คำสำคัญคั่นด้วยจุลภาค' : 'Keywords separated by commas'}
              />
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Open Graph (Facebook)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>og:title:</strong> {title || (language === 'th' ? 'ไม่มีหัวข้อ' : 'No title')}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>og:description:</strong> {description || (language === 'th' ? 'ไม่มีคำอธิบาย' : 'No description')}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Twitter Cards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>twitter:title:</strong> {title || (language === 'th' ? 'ไม่มีหัวข้อ' : 'No title')}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>twitter:description:</strong> {description || (language === 'th' ? 'ไม่มีคำอธิบาย' : 'No description')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {(title || description || keywords) && (
          <div className="pt-4 border-t">
            <Button onClick={copyToClipboard} className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied 
                ? (language === 'th' ? 'คัดลอกแล้ว!' : 'Copied!') 
                : (language === 'th' ? 'คัดลอก HTML Meta Tags' : 'Copy HTML Meta Tags')
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaTagsManager;
