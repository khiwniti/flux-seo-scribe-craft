import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


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



  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>

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
