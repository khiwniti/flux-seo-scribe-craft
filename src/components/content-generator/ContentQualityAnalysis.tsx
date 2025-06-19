
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

interface ContentInsights {
  estimatedReadTime?: number;
  targetKeywordDensity?: string;
  recommendedHeadings?: number;
  suggestedImages?: number;
  seoComplexity?: string;
  competitiveLevel?: string;
}

interface ContentQualityAnalysisProps {
  contentQuality: number;
  seoScore: number;
  readabilityScore: number;
  smartKeywords: string[];
  contentInsights: ContentInsights;
}

const ContentQualityAnalysis = ({
  contentQuality,
  seoScore,
  readabilityScore,
  smartKeywords,
  contentInsights
}: ContentQualityAnalysisProps) => {
  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mt-4 border">
      <div className="flex items-center gap-2 mb-3">
        <Award className="h-5 w-5 text-purple-600" />
        <Label className="text-base font-semibold">AI Quality Analysis</Label>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Content Quality</span>
            <span className="text-sm font-bold text-green-600">{contentQuality}%</span>
          </div>
          <Progress value={contentQuality} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SEO Score</span>
            <span className="text-sm font-bold text-blue-600">{seoScore}%</span>
          </div>
          <Progress value={seoScore} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Readability</span>
            <span className="text-sm font-bold text-purple-600">{readabilityScore}%</span>
          </div>
          <Progress value={readabilityScore} className="h-2" />
        </div>
      </div>

      {/* Smart Keywords */}
      {smartKeywords.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">AI-Generated Keywords</Label>
          <div className="flex flex-wrap gap-1">
            {smartKeywords.slice(0, 8).map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-white">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Content Insights */}
      {Object.keys(contentInsights).length > 0 && (
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Read Time:</span>
              <span className="font-medium">{contentInsights.estimatedReadTime} min</span>
            </div>
            <div className="flex justify-between">
              <span>Keyword Density:</span>
              <span className="font-medium">{contentInsights.targetKeywordDensity}</span>
            </div>
            <div className="flex justify-between">
              <span>Headings:</span>
              <span className="font-medium">{contentInsights.recommendedHeadings}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Images:</span>
              <span className="font-medium">{contentInsights.suggestedImages}</span>
            </div>
            <div className="flex justify-between">
              <span>SEO Complexity:</span>
              <span className="font-medium">{contentInsights.seoComplexity}</span>
            </div>
            <div className="flex justify-between">
              <span>Competition:</span>
              <span className="font-medium">{contentInsights.competitiveLevel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentQualityAnalysis;
