import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Copy, Check, Globe, Sparkles, CheckCircle, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { generateBlogContent, GeminiServiceError, GeneratedContentResponse } from '@/lib/geminiService';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useMutation } from '@tanstack/react-query';

const MetaTagsManager = () => {
  const { language, setLanguage: setGlobalLanguage } = useLanguage();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  // const [isGenerating, setIsGenerating] = useState(false); // To be replaced by mutation.isPending
  const [copied, setCopied] = useState(false);
  const [autoEnhanced, setAutoEnhanced] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  // const { toast } = useToast(); // Replaced by sonnerToast

  const metaTagMutation = useMutation<
    GeneratedContentResponse, // Expecting the service to return this structure
    GeminiServiceError,
    { currentContent: string; currentLanguage: Language }
  >({
    mutationFn: async (vars) => {
      const promptForMetaTags = `Based on the following content in ${vars.currentLanguage === 'th' ? 'Thai' : 'English'}, generate SEO-friendly meta tags.

Content:
---
${vars.currentContent.substring(0, 2000)}
---

Please generate the following, ensuring each is on a new line and clearly labeled:
1.  Title: An SEO-friendly title, around ${vars.currentLanguage === 'th' ? 65 : 60} characters.
2.  Description: A compelling meta description, around ${vars.currentLanguage === 'th' ? 150 : 160} characters.
3.  Keywords: 5-7 relevant keywords, comma-separated.

Output format example:
Title: [Generated Title Here]
Description: [Generated Meta Description Here]
Keywords: [keyword1, keyword2, keyword3, keyword4, keyword5]

Generate the meta tags in ${vars.currentLanguage === 'th' ? 'Thai' : 'English'}.`;

      // We use generateBlogContent and rely on the PHP backend to use the 'meta_tags_generation' contentType
      // The 'topic' will be the prompt itself, and 'keywords' can be empty or context if needed.
      // However, the service function generateBlogContent expects topic, lang, contentType, keywords.
      // For meta tags, the content itself is the primary input.
      return generateBlogContent(
        vars.currentContent, // Main content as "topic" for the service
        vars.currentLanguage,
        'meta_tags_generation', // Specific content type for backend to handle
        "" // No separate keywords needed if content is rich enough
      );
    },
    onMutate: () => {
      setApiKeyError(null);
      setAutoEnhanced(false);
      sonnerToast.info(language === 'th' ? "กำลังสร้าง Meta Tags..." : "Generating meta tags...");
    },
    onSuccess: (data) => {
      // data.content should contain the raw text from Gemini with Title:, Description:, Keywords:
      const { title: genTitle, description: genDescription, keywords: genKeywords } = parseMetaTagResponse(data.content || "");
      setTitle(genTitle);
      setDescription(genDescription);
      setKeywords(genKeywords);
      setAutoEnhanced(true);
      sonnerToast.success(language === 'th' ? "สร้าง Meta Tags สำเร็จ!" : "Smart Meta Tags Generated!");
    },
    onError: (error: GeminiServiceError) => {
      console.error("Error generating meta tags:", error);
      let errorDesc = language === 'th' ? "เกิดข้อผิดพลาดขณะสร้าง Meta Tags" : "An error occurred while generating meta tags.";
      if (error.isApiKeyInvalid) {
        errorDesc = language === 'th' ? "API Key ไม่ถูกต้องหรือหายไป กรุณาตรวจสอบการตั้งค่า" : "The Gemini API key is invalid or missing. Please go to Settings to add it.";
        setApiKeyError(errorDesc);
      } else if (error.message) {
        errorDesc = error.message;
      }
      sonnerToast.error(language === 'th' ? "การสร้าง Meta Tag ล้มเหลว" : "Meta Tag Generation Failed", { description: errorDesc });
    }
  });

  // Auto-generate when content changes and length is sufficient
  useEffect(() => {
    if (content && content.length > 100 && !autoEnhanced && !isGenerating) {
      // Debounce or make this user-initiated if it causes too many API calls on fast typing.
      // For now, direct call.
      generateMetaTags();
    }
  }, [content, autoEnhanced, isGenerating, language]); // Added language to dependencies

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
        if (!genTitle) genTitle = "Could not extract title";
        if (!genDescription) genDescription = "Could not extract description";
        if (!genKeywords) genKeywords = "Could not extract keywords";
    }


    return { title: genTitle, description: genDescription, keywords: genKeywords };
  };

  const generateMetaTags = () => {
    if (!content.trim()) {
      sonnerToast.error(
        language === 'th' ? "กรุณาใส่เนื้อหา" : "Please enter content",
        { description: language === 'th' ? "ใส่เนื้อหาเพื่อสร้าง Meta Tags อัตโนมัติ" : "Enter content to generate meta tags automatically" }
      );
      return;
    }
    metaTagMutation.mutate({ currentContent: content, currentLanguage: language });
  };

  // Removed old API call logic and manual isGenerating flags

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
              <Sparkles className="h-4 w-4 text-purple-500" />
            </CardTitle>
            <CardDescription>
              {language === 'th' 
                ? 'AI สร้าง Meta Tags อัตโนมัติสำหรับเนื้อหาของคุณ'
                : 'AI automatically generates meta tags for your content.'
              }
            </CardDescription>
          </div>
          {/* Language switcher is now global, so no local buttons here.
              The global LanguageSwitcher component in SEODashboard handles this. */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'th' ? 'เนื้อหาหลัก (AI จะวิเคราะห์อัตโนมัติ)' : 'Main Content (AI will auto-analyze)'}
            </label>
            <Textarea
              placeholder={language === 'th' 
                ? 'วางเนื้อหาของคุณที่นี่ AI จะสร้าง Meta Tags ให้อัตโนมัติ...'
                : 'Paste your content here and AI will automatically generate meta tags...'
              }
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setAutoEnhanced(false); // Reset auto-enhanced flag when content changes
              }}
              rows={4}
            />
            {content && content.length > 50 && (
              <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                🤖 {language === 'th' 
                  ? `AI กำลังวิเคราะห์เนื้อหา ${content.split(' ').length} คำ...`
                  : `AI analyzing ${content.split(' ').length} words of content...`
                }
              </div>
            )}
          </div>
          
          {!autoEnhanced && content && (
            <Button onClick={generateMetaTags} disabled={metaTagMutation.isPending} className="w-full">
              <Wand2 className="h-4 w-4 mr-2" />
              {metaTagMutation.isPending
                ? (language === 'th' ? 'กำลังสร้าง...' : 'Generating...') 
                : (language === 'th' ? 'สร้าง Meta Tags ด้วย AI' : 'Generate Meta Tags with AI')
              }
            </Button>
          )}

          {apiKeyError && (
            <div className="mt-2 p-2 text-xs bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-1">
              <AlertTriangleIcon className="h-4 w-4 flex-shrink-0" />
              {apiKeyError}
            </div>
          )}
          
          {autoEnhanced && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === 'th' ? 'AI เพิ่มประสิทธิภาพแล้ว!' : 'AI Enhanced!'}
                </span>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                {language === 'th' 
                  ? 'Meta Tags ถูกสร้างอัตโนมัติจากการวิเคราะห์เนื้อหา'
                  : 'Meta tags automatically generated from content analysis'
                }
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">
              {language === 'th' ? 'Meta Tags (Auto-Enhanced)' : 'Meta Tags (Auto-Enhanced)'}
            </TabsTrigger>
            <TabsTrigger value="social">
              {language === 'th' ? 'Social Media (Auto-Generated)' : 'Social Media (Auto-Generated)'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'th' ? 'หัวข้อหน้า (Auto-Generated)' : 'Page Title (Auto-Generated)'}
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'th' ? 'AI จะสร้างหัวข้อให้อัตโนมัติ...' : 'AI will generate title automatically...'}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{title.length} {language === 'th' ? 'ตัวอักษร' : 'characters'}</span>
                <Badge variant={title.length > 60 ? 'destructive' : title.length > 50 ? 'secondary' : 'default'}>
                  {title.length > 60 ? (language === 'th' ? 'ยาวเกินไป' : 'Too long') : 
                   title.length > 50 ? (language === 'th' ? 'ดี' : 'Perfect') : 
                   (language === 'th' ? 'สามารถเพิ่มได้' : 'Can add more')}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'th' ? 'คำอธิบาย (Auto-Generated)' : 'Meta Description (Auto-Generated)'}
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'th' ? 'AI จะสร้างคำอธิบายให้อัตโนมัติ...' : 'AI will generate description automatically...'}
                rows={3}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{description.length} {language === 'th' ? 'ตัวอักษร' : 'characters'}</span>
                <Badge variant={description.length > 160 ? 'destructive' : description.length > 150 ? 'secondary' : 'default'}>
                  {description.length > 160 ? (language === 'th' ? 'ยาวเกินไป' : 'Too long') : 
                   description.length > 150 ? (language === 'th' ? 'ดี' : 'Perfect') : 
                   (language === 'th' ? 'สามารถเพิ่มได้' : 'Can add more')}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'th' ? 'คำสำคัญ (Auto-Extracted)' : 'Keywords (Auto-Extracted)'}
              </label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={language === 'th' ? 'AI จะดึงคำสำคัญให้อัตโนมัติ...' : 'AI will extract keywords automatically...'}
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
