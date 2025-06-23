
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, BarChart3, Copy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductionContentQuality from './ProductionContentQuality';

interface ContentInsights {
  estimatedReadTime?: number;
  targetKeywordDensity?: string;
  recommendedHeadings?: number;
  suggestedImages?: number;
  seoComplexity?: string;
  competitiveLevel?: string;
}

interface GeneratedImage {
  id: number;
  url: string;
  alt: string;
  prompt: string;
  enhanced: boolean;
  quality: string;
  seoOptimized: boolean;
}

interface GeneratedContentDisplayProps {
  generatedContent: string;
  generatedImages: GeneratedImage[];
  contentQuality: number;
  seoScore: number;
  readabilityScore: number;
  smartKeywords: string[];
  contentInsights: ContentInsights;
  onCopyToClipboard: () => void;
  onDownloadImage: (url: string, filename: string) => void;
}

const GeneratedContentDisplay = ({
  generatedContent,
  generatedImages,
  contentQuality,
  seoScore,
  readabilityScore,
  smartKeywords,
  contentInsights,
  onCopyToClipboard,
  onDownloadImage
}: GeneratedContentDisplayProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const currentLabels = {
    contentPreview: t("Content Preview", "ตัวอย่างเนื้อหา"),
    contentInsights: t("Content Insights", "ข้อมูลเชิงลึกเนื้อหา"),
    wordCount: t("Words", "คำ"),
    copyToClipboard: t("Copy to Clipboard", "คัดลอกไปยังคลิปบอร์ด"),
    generatedContent: t("Generated Content", "เนื้อหาที่สร้างขึ้น")
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            {currentLabels.generatedContent}
          </CardTitle>
          <CardDescription>
            {t("AI-generated content with professional quality analysis", "เนื้อหาที่สร้างโดย AI พร้อมการวิเคราะห์คุณภาพระดับมืออาชีพ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Professional Quality Analysis */}
          <ProductionContentQuality 
            content={generatedContent}
            language={language}
            targetKeywords={smartKeywords}
          />

          <Separator />

          {/* Content Preview */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {currentLabels.contentPreview}
            </h4>
            <div className="bg-white rounded-lg border p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                {generatedContent}
              </pre>
            </div>
            <Button 
              onClick={onCopyToClipboard}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              {currentLabels.copyToClipboard}
            </Button>
          </div>

          <Separator />

          {/* Content Insights */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {currentLabels.contentInsights}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {generatedContent.split(' ').length}
                </div>
                <div className="text-xs text-gray-600">{currentLabels.wordCount}</div>
              </div>
              
              {contentInsights.estimatedReadTime && (
                <div className="bg-white rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {contentInsights.estimatedReadTime}
                  </div>
                  <div className="text-xs text-gray-600">{t("Min Read", "นาทีอ่าน")}</div>
                </div>
              )}
              
              {contentInsights.recommendedHeadings && (
                <div className="bg-white rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {contentInsights.recommendedHeadings}
                  </div>
                  <div className="text-xs text-gray-600">{t("Headings", "หัวข้อ")}</div>
                </div>
              )}
              
              {contentInsights.suggestedImages && (
                <div className="bg-white rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {contentInsights.suggestedImages}
                  </div>
                  <div className="text-xs text-gray-600">{t("Images", "รูปภาพ")}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedContentDisplay;
