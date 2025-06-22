import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, FileText, Image, BarChart3, Eye, Target } from 'lucide-react';
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

  const labels = {
    en: {
      title: 'Generated Professional Content',
      description: 'AI-generated content with professional quality analysis',
      contentPreview: 'Content Preview',
      qualityAnalysis: 'Quality Analysis',
      contentInsights: 'Content Insights',
      smartKeywords: 'AI-Extracted Keywords',
      generatedImages: 'Professional Images',
      copyContent: 'Copy Content',
      downloadImage: 'Download',
      wordCount: 'Word Count',
      readTime: 'Estimated Read Time',
      seoComplexity: 'SEO Complexity',
      competitive: 'Competitive Level'
    },
    th: {
      title: 'เนื้อหาระดับมืออาชีพที่สร้างขึ้น',
      description: 'เนื้อหาที่สร้างด้วย AI พร้อมการวิเคราะห์คุณภาพระดับมืออาชีพ',
      contentPreview: 'ตัวอย่างเนื้อหา',
      qualityAnalysis: 'การวิเคราะห์คุณภาพ',
      contentInsights: 'ข้อมูลเชิงลึกเนื้อหา',
      smartKeywords: 'คำสำคัญที่ AI สกัดออกมา',
      generatedImages: 'ภาพระดับมืออาชีพ',
      copyContent: 'คัดลอกเนื้อหา',
      downloadImage: 'ดาวน์โหลด',
      wordCount: 'จำนวนคำ',
      readTime: 'เวลาอ่านโดยประมาณ',
      seoComplexity: 'ความซับซ้อน SEO',
      competitive: 'ระดับการแข่งขัน'
    }
  };

  const currentLabels = labels[language];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <FileText className="h-5 w-5" />
            {currentLabels.title}
          </CardTitle>
          <CardDescription className="text-green-600">
            {currentLabels.description}
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
              {currentLabels.copyContent}
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
              
              <div className="bg-white rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {contentInsights.estimatedReadTime || 5}
                </div>
                <div className="text-xs text-gray-600">
                  {language === 'th' ? 'นาที' : 'min'}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-3 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {contentInsights.seoComplexity || 'Medium'}
                </div>
                <div className="text-xs text-gray-600">{currentLabels.seoComplexity}</div>
              </div>
              
              <div className="bg-white rounded-lg border p-3 text-center">
                <div className="text-lg font-bold text-orange-600">
                  {contentInsights.competitiveLevel || 'Medium'}
                </div>
                <div className="text-xs text-gray-600">{currentLabels.competitive}</div>
              </div>
            </div>
          </div>

          {/* Smart Keywords */}
          {smartKeywords.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {currentLabels.smartKeywords}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {smartKeywords.slice(0, 8).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Professional Images */}
          {generatedImages.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  {currentLabels.generatedImages}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedImages.map((img) => (
                    <div key={img.id} className="bg-white rounded-lg border p-3 space-y-3">
                      <img 
                        src={img.url} 
                        alt={img.alt}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{img.alt}</p>
                        <p className="text-xs text-gray-600">{img.prompt}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onDownloadImage(img.url, `${img.alt}.jpg`)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {currentLabels.downloadImage}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedContentDisplay;
