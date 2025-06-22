
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

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
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    mainLabel: t("AI Quality Analysis", "การวิเคราะห์คุณภาพโดย AI"),
    contentQualityLabel: t("Content Quality", "คุณภาพเนื้อหา"),
    seoScoreLabel: t("SEO Score", "คะแนน SEO"),
    readabilityLabel: t("Readability", "การอ่านง่าย"),
    aiKeywordsLabel: t("AI-Generated Keywords", "คีย์เวิร์ดที่สร้างโดย AI"),
    readTimeLabel: t("Read Time:", "เวลาอ่านโดยประมาณ:"),
    minSuffix: t("min", "นาที"),
    keywordDensityLabel: t("Keyword Density:", "ความหนาแน่นของคีย์เวิร์ด:"),
    headingsLabel: t("Headings:", "จำนวนหัวข้อ:"),
    imagesLabel: t("Images:", "จำนวนรูปภาพ:"),
    seoComplexityLabel: t("SEO Complexity:", "ความซับซ้อน SEO:"),
    competitionLabel: t("Competition:", "ระดับการแข่งขัน:"),
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mt-4 border">
      <div className="flex items-center gap-2 mb-3">
        <Award className="h-5 w-5 text-purple-600" />
        <Label className="text-base font-semibold">{T.mainLabel}</Label>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{T.contentQualityLabel}</span>
            <span className="text-sm font-bold text-green-600">{contentQuality}%</span>
          </div>
          <Progress value={contentQuality} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{T.seoScoreLabel}</span>
            <span className="text-sm font-bold text-blue-600">{seoScore}%</span>
          </div>
          <Progress value={seoScore} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{T.readabilityLabel}</span>
            <span className="text-sm font-bold text-purple-600">{readabilityScore}%</span>
          </div>
          <Progress value={readabilityScore} className="h-2" />
        </div>
      </div>

      {/* Smart Keywords */}
      {smartKeywords.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{T.aiKeywordsLabel}</Label>
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
              <span>{T.readTimeLabel}</span>
              <span className="font-medium">{contentInsights.estimatedReadTime} {T.minSuffix}</span>
            </div>
            <div className="flex justify-between">
              <span>{T.keywordDensityLabel}</span>
              <span className="font-medium">{contentInsights.targetKeywordDensity}</span>
            </div>
            <div className="flex justify-between">
              <span>{T.headingsLabel}</span>
              <span className="font-medium">{contentInsights.recommendedHeadings}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>{T.imagesLabel}</span>
              <span className="font-medium">{contentInsights.suggestedImages}</span>
            </div>
            <div className="flex justify-between">
              <span>{T.seoComplexityLabel}</span>
              <span className="font-medium">{contentInsights.seoComplexity}</span>
            </div>
            <div className="flex justify-between">
              <span>{T.competitionLabel}</span>
              <span className="font-medium">{contentInsights.competitiveLevel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentQualityAnalysis;
