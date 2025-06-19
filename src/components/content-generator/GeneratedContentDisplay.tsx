
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Image, Copy, Download } from 'lucide-react';
import ContentQualityAnalysis from './ContentQualityAnalysis';

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
  onDownloadImage: (imageUrl: string, fileName: string) => void;
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
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Generated Content
          </CardTitle>
          <CardDescription>
            SEO-optimized blog post ready for publication
          </CardDescription>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCopyToClipboard}
              className="flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {generatedContent}
            </pre>
          </div>
          
          {/* Content Statistics */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {generatedContent.split(' ').length}
              </div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {generatedContent.split('\n').filter(line => line.trim().startsWith('#')).length}
              </div>
              <div className="text-sm text-gray-600">Headers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {Math.ceil(generatedContent.split(' ').length / 200)}
              </div>
              <div className="text-sm text-gray-600">Min Read</div>
            </div>
          </div>

          {/* AI Quality Analysis */}
          <ContentQualityAnalysis
            contentQuality={contentQuality}
            seoScore={seoScore}
            readabilityScore={readabilityScore}
            smartKeywords={smartKeywords}
            contentInsights={contentInsights}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-pink-600" />
            Contextual Images
          </CardTitle>
          <CardDescription>
            AI-generated images optimized for your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {generatedImages.map((image) => (
              <div key={image.id} className="group relative">
                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDownloadImage(image.url, `blog-image-${image.id}.jpg`)}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {image.prompt}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedContentDisplay;
