import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Copy, Check, Globe, Sparkles, CheckCircle, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateBlogContent as callGeminiApi } from '@/lib/geminiService';
import { useLanguage, Language } from '@/contexts/LanguageContext'; // Import useLanguage

const MetaTagsManager = () => {
  const { language } = useLanguage(); // Removed setGlobalLanguage as it's not used here
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoEnhanced, setAutoEnhanced] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const { toast } = useToast();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    // Card
    cardTitle: t("Smart Meta Tags Manager", "จัดการ Meta Tags อัจฉริยะ"),
    cardDescription: t("AI automatically generates meta tags for your content.", "AI สร้าง Meta Tags อัตโนมัติสำหรับเนื้อหาของคุณ"),
    // Content Input
    mainContentLabel: t("Main Content (AI will auto-analyze)", "เนื้อหาหลัก (AI จะวิเคราะห์อัตโนมัติ)"),
    mainContentPlaceholder: t("Paste your content here and AI will automatically generate meta tags...", "วางเนื้อหาของคุณที่นี่ AI จะสร้าง Meta Tags ให้อัตโนมัติ..."),
    analyzingHelperText: t("AI analyzing {count} words of content...", "AI กำลังวิเคราะห์เนื้อหา {count} คำ..."),
    // Generate Button
    generatingButton: t("Generating...", "กำลังสร้าง..."),
    generateButton: t("Generate Meta Tags with AI", "สร้าง Meta Tags ด้วย AI"),
    // AI Enhanced Notification
    aiEnhancedTitle: t("AI Enhanced!", "AI เพิ่มประสิทธิภาพแล้ว!"),
    aiEnhancedDescription: t("Meta tags automatically generated from content analysis", "Meta Tags ถูกสร้างอัตโนมัติจากการวิเคราะห์เนื้อหา"),
    // Tabs
    tabBasic: t("Meta Tags (Auto-Enhanced)", "Meta Tags (ปรับปรุงอัตโนมัติ)"),
    tabSocial: t("Social Media (Auto-Generated)", "โซเชียลมีเดีย (สร้างอัตโนมัติ)"),
    // Basic Tab Fields
    pageTitleLabel: t("Page Title (Auto-Generated)", "ชื่อหน้าเว็บ (สร้างอัตโนมัติ)"),
    pageTitlePlaceholder: t("AI will generate title automatically...", "AI จะสร้างหัวข้อให้อัตโนมัติ..."),
    metaDescriptionLabel: t("Meta Description (Auto-Generated)", "คำอธิบายเมตา (สร้างอัตโนมัติ)"),
    metaDescriptionPlaceholder: t("AI will generate description automatically...", "AI จะสร้างคำอธิบายให้อัตโนมัติ..."),
    keywordsLabel: t("Keywords (Auto-Extracted)", "คีย์เวิร์ด (ดึงข้อมูลอัตโนมัติ)"),
    keywordsPlaceholder: t("AI will extract keywords automatically...", "AI จะดึงคำสำคัญให้อัตโนมัติ..."),
    // Character Count & Badges
    charactersSuffix: t("characters", "ตัวอักษร"),
    badgeTooLong: t("Too long", "ยาวเกินไป"),
    badgePerfect: t("Perfect", "ดี"),
    badgeCanAddMore: t("Can add more", "สามารถเพิ่มได้"),
    // Social Tab
    ogTitle: t("Open Graph (Facebook)", "Open Graph (Facebook)"),
    twitterTitle: t("Twitter Cards", "Twitter Cards"),
    noTitleFallback: t("No title", "ไม่มีหัวข้อ"),
    noDescriptionFallback: t("No description", "ไม่มีคำอธิบาย"),
    // Copy Button
    copyButtonCopied: t("Copied!", "คัดลอกแล้ว!"),
    copyButtonDefault: t("Copy HTML Meta Tags", "คัดลอก HTML Meta Tags"),
    // Toasts
    toastContentRequiredTitle: t("Please enter content", "กรุณาใส่เนื้อหา"),
    toastContentRequiredDesc: t("Enter content to generate meta tags automatically", "ใส่เนื้อหาเพื่อสร้าง Meta Tags อัตโนมัติ"),
    toastGeneratedTitle: t("Smart Meta Tags Generated!", "สร้าง Meta Tags สำเร็จ!"),
    toastGeneratedDesc: t("AI has generated optimized meta tags.", "AI สร้าง Meta Tags ที่เหมาะสมแล้ว"),
    toastFailedTitle: t("Meta Tag Generation Failed", "การสร้าง Meta Tag ล้มเหลว"),
    toastFailedDescDefault: t("An error occurred while generating meta tags.", "เกิดข้อผิดพลาดขณะสร้าง Meta Tags"),
    toastFailedApiKey: t("The Gemini API key is invalid or missing. Please go to Settings to add it.", "คีย์ Gemini API ไม่ถูกต้องหรือขาดหายไป กรุณาไปที่การตั้งค่าเพื่อเพิ่มคีย์"),
    toastCopiedTitle: t("Copied!", "คัดลอกแล้ว!"),
    toastCopiedDesc: t("Meta tags copied to clipboard", "Meta Tags ถูกคัดลอกไปยังคลิปบอร์ดแล้ว"),
    // Fallback parsing
    fallbackNoTitle: t("Could not extract title", "ไม่สามารถดึงข้อมูลชื่อเรื่องได้"),
    fallbackNoDescription: t("Could not extract description", "ไม่สามารถดึงข้อมูลคำอธิบายได้"),
    fallbackNoKeywords: t("Could not extract keywords", "ไม่สามารถดึงข้อมูลคีย์เวิร์ดได้"),
  };

  // Auto-generate when content changes and length is sufficient
  useEffect(() => {
    if (content && content.length > 100 && !autoEnhanced && !isGenerating) {
      generateMetaTags();
    }
  }, [content, autoEnhanced, isGenerating, language]);

  const parseMetaTagResponse = (text: string): { title: string; description: string; keywords: string } => {
    let genTitle = '';
    let genDescription = '';
    let genKeywords = '';

    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.toLowerCase().startsWith('title:')) {
        genTitle = line.substring('title:'.length).trim();
      } else if (line.toLowerCase().startsWith('description:')) {
        genDescription = line.substring('description:'.length).trim();
      } else if (line.toLowerCase().startsWith('keywords:')) {
        genKeywords = line.substring('keywords:'.length).trim();
      }
    });

    // Fallbacks if parsing is not perfect
    if (!genTitle && !genDescription && !genKeywords && lines.length >= 3) {
        // Assuming first line is title, second description, third keywords if no labels found
        genTitle = lines[0] || '';
        genDescription = lines[1] || '';
        genKeywords = lines[2] || '';
    } else {
        if (!genTitle) genTitle = T.fallbackNoTitle;
        if (!genDescription) genDescription = T.fallbackNoDescription;
        if (!genKeywords) genKeywords = T.fallbackNoKeywords;
    }


    return { title: genTitle, description: genDescription, keywords: genKeywords };
  };

  const generateMetaTags = async () => {
    if (!content.trim()) {
      toast({
        title: T.toastContentRequiredTitle,
        description: T.toastContentRequiredDesc,
        variant: "destructive",
      });
      return;
    }
    setApiKeyError(null);
    setIsGenerating(true);
    setAutoEnhanced(false);

    const langInstruction = language === 'th' ? 'Thai' : 'English';
    const titleCharLimit = language === 'th' ? 65 : 60;
    const descCharLimit = language === 'th' ? 150 : 160;

    const prompt = `Based on the following content in ${langInstruction}, generate SEO-friendly meta tags.

Content:
---
${content.substring(0, 2000)}
---

Please generate the following, ensuring each is on a new line and clearly labeled:
1.  Title: An SEO-friendly title, around ${titleCharLimit} characters.
2.  Description: A compelling meta description, around ${descCharLimit} characters.
3.  Keywords: 5-7 relevant keywords, comma-separated.

Output format example:
Title: [Generated Title Here]
Description: [Generated Meta Description Here]
Keywords: [keyword1, keyword2, keyword3, keyword4, keyword5]

Generate the meta tags in ${langInstruction}.`;

    try {
      const response = await callGeminiApi(prompt);
      const { title: genTitle, description: genDescription, keywords: genKeywords } = parseMetaTagResponse(response);
      
      setTitle(genTitle);
      setDescription(genDescription);
      setKeywords(genKeywords);
      setAutoEnhanced(true);
      
      toast({
        title: T.toastGeneratedTitle,
        description: T.toastGeneratedDesc,
      });

    } catch (error: any) {
      console.error("Error generating meta tags with Gemini:", error);
      let errorDesc = T.toastFailedDescDefault;
      if (error.isApiKeyInvalid) {
        errorDesc = T.toastFailedApiKey;
        setApiKeyError(errorDesc);
      } else if (error.message) {
        errorDesc = error.message;
      }
      toast({ title: T.toastFailedTitle, description: errorDesc, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
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
      title: T.toastCopiedTitle,
      description: T.toastCopiedDesc,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {T.cardTitle}
              <Sparkles className="h-4 w-4 text-purple-500" />
            </CardTitle>
            <CardDescription>
              {T.cardDescription}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {T.mainContentLabel}
            </label>
            <Textarea
              placeholder={T.mainContentPlaceholder}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setAutoEnhanced(false);
              }}
              rows={4}
            />
            {content && content.length > 50 && (
              <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                🤖 {T.analyzingHelperText.replace("{count}", content.split(' ').length.toString())}
              </div>
            )}
             {apiKeyError && (
                <div className="mt-2 p-2 text-xs bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-1">
                  <AlertTriangleIcon className="h-4 w-4 flex-shrink-0" />
                  {apiKeyError}
                </div>
            )}
          </div>
          
          {!autoEnhanced && content && (
            <Button onClick={generateMetaTags} disabled={isGenerating} className="w-full">
              <Wand2 className="h-4 w-4 mr-2" />
              {isGenerating 
                ? T.generatingButton
                : T.generateButton
              }
            </Button>
          )}
          
          {autoEnhanced && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {T.aiEnhancedTitle}
                </span>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                {T.aiEnhancedDescription}
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">
              {T.tabBasic}
            </TabsTrigger>
            <TabsTrigger value="social">
              {T.tabSocial}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {T.pageTitleLabel}
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={T.pageTitlePlaceholder}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{title.length} {T.charactersSuffix}</span>
                <Badge variant={title.length > 60 ? 'destructive' : title.length > 50 ? 'secondary' : 'default'}>
                  {title.length > 60 ? T.badgeTooLong :
                   title.length > 50 ? T.badgePerfect :
                   T.badgeCanAddMore}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {T.metaDescriptionLabel}
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={T.metaDescriptionPlaceholder}
                rows={3}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{description.length} {T.charactersSuffix}</span>
                <Badge variant={description.length > 160 ? 'destructive' : description.length > 150 ? 'secondary' : 'default'}>
                  {description.length > 160 ? T.badgeTooLong :
                   description.length > 150 ? T.badgePerfect :
                   T.badgeCanAddMore}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {T.keywordsLabel}
              </label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={T.keywordsPlaceholder}
              />
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{T.ogTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>og:title:</strong> {title || T.noTitleFallback}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>og:description:</strong> {description || T.noDescriptionFallback}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{T.twitterTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>twitter:title:</strong> {title || T.noTitleFallback}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>twitter:description:</strong> {description || T.noDescriptionFallback}
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
                ? T.copyButtonCopied
                : T.copyButtonDefault
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaTagsManager;
