
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Target, TrendingUp } from 'lucide-react';

interface ContentQualityMetrics {
  overallScore: number;
  readabilityScore: number;
  seoScore: number;
  originalityScore: number;
  expertiseScore: number;
  engagementScore: number;
  language: 'en' | 'th';
}

interface ProductionContentQualityProps {
  content: string;
  language: 'en' | 'th';
  targetKeywords: string[];
}

export const ProductionContentQuality: React.FC<ProductionContentQualityProps> = ({
  content,
  language,
  targetKeywords
}) => {
  const analyzeContentQuality = (content: string, language: 'en' | 'th'): ContentQualityMetrics => {
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const headings = (content.match(/#{1,6}\s/g) || []).length;
    
    // Calculate readability (simplified Flesch Reading Ease adaptation)
    const avgWordsPerSentence = wordCount / sentences;
    const readabilityScore = language === 'th' 
      ? calculateThaiReadability(content, avgWordsPerSentence)
      : calculateEnglishReadability(content, avgWordsPerSentence);
    
    // Calculate SEO score based on structure and keyword usage
    const seoScore = calculateSEOScore(content, targetKeywords, headings, wordCount);
    
    // Calculate originality score (based on content structure and uniqueness indicators)
    const originalityScore = calculateOriginalityScore(content, headings, paragraphs);
    
    // Calculate expertise score (based on depth, examples, and technical content)
    const expertiseScore = calculateExpertiseScore(content, language);
    
    // Calculate engagement score (based on content structure and readability)
    const engagementScore = calculateEngagementScore(content, readabilityScore, headings);
    
    const overallScore = Math.round(
      (readabilityScore * 0.2) +
      (seoScore * 0.25) +
      (originalityScore * 0.2) +
      (expertiseScore * 0.2) +
      (engagementScore * 0.15)
    );
    
    return {
      overallScore,
      readabilityScore,
      seoScore,
      originalityScore,
      expertiseScore,
      engagementScore,
      language
    };
  };

  const calculateThaiReadability = (content: string, avgWordsPerSentence: number): number => {
    // Thai readability calculation adapted for Thai language characteristics
    const thaiCharCount = (content.match(/[ก-๙]/g) || []).length;
    const totalChars = content.length;
    const thaiRatio = thaiCharCount / totalChars;
    
    let score = 85; // Base score for Thai content
    
    // Adjust for sentence length (Thai tends to have longer sentences)
    if (avgWordsPerSentence > 25) score -= 10;
    else if (avgWordsPerSentence > 20) score -= 5;
    else if (avgWordsPerSentence < 10) score += 5;
    
    // Adjust for Thai character usage
    if (thaiRatio > 0.7) score += 10;
    else if (thaiRatio < 0.3) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  };

  const calculateEnglishReadability = (content: string, avgWordsPerSentence: number): number => {
    // Simplified Flesch Reading Ease calculation
    const avgSyllablesPerWord = estimateEnglishSyllables(content) / content.split(/\s+/).length;
    
    let score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  };

  const estimateEnglishSyllables = (text: string): number => {
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;
    
    words.forEach(word => {
      const syllableCount = word.replace(/[^aeiou]/g, '').length || 1;
      totalSyllables += syllableCount;
    });
    
    return totalSyllables;
  };

  const calculateSEOScore = (content: string, keywords: string[], headings: number, wordCount: number): number => {
    let score = 60; // Base SEO score
    
    // Check keyword usage
    const keywordDensity = keywords.reduce((density, keyword) => {
      const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      return density + (keywordCount / wordCount * 100);
    }, 0);
    
    // Optimal keyword density: 1-3%
    if (keywordDensity >= 1 && keywordDensity <= 3) score += 20;
    else if (keywordDensity > 0.5 && keywordDensity < 5) score += 10;
    
    // Check content structure
    if (headings >= 3) score += 15;
    else if (headings >= 1) score += 10;
    
    // Check content length
    if (wordCount >= 800 && wordCount <= 2500) score += 15;
    else if (wordCount >= 500) score += 10;
    
    return Math.min(100, score);
  };

  const calculateOriginalityScore = (content: string, headings: number, paragraphs: number): number => {
    let score = 70; // Base originality score
    
    // Check content structure diversity
    const structureScore = Math.min(20, (headings + paragraphs) * 2);
    score += structureScore;
    
    // Check for unique content indicators
    const hasExamples = /example|instance|case study|for example/i.test(content) ? 10 : 0;
    const hasData = /\d+%|\d+ percent|statistics|data shows/i.test(content) ? 10 : 0;
    
    score += hasExamples + hasData;
    
    return Math.min(100, score);
  };

  const calculateExpertiseScore = (content: string, language: 'en' | 'th'): number => {
    let score = 60; // Base expertise score
    
    // Check for expertise indicators
    const expertiseIndicators = language === 'th' 
      ? ['ตัวอย่าง', 'กรณีศึกษา', 'การวิจัย', 'ข้อมูล', 'ประสบการณ์', 'เทคนิค']
      : ['research', 'study', 'analysis', 'data', 'experience', 'methodology', 'framework'];
    
    expertiseIndicators.forEach(indicator => {
      if (content.toLowerCase().includes(indicator.toLowerCase())) {
        score += 8;
      }
    });
    
    // Check for technical depth
    const hasTechnicalContent = language === 'th'
      ? /เทคนิค|วิธีการ|กระบวนการ|ขั้นตอน/i.test(content)
      : /technique|methodology|process|implementation|strategy/i.test(content);
    
    if (hasTechnicalContent) score += 15;
    
    return Math.min(100, score);
  };

  const calculateEngagementScore = (content: string, readabilityScore: number, headings: number): number => {
    let score = readabilityScore * 0.5; // Base on readability
    
    // Add points for engaging elements
    const hasQuestions = (content.match(/\?/g) || []).length;
    const hasLists = (content.match(/^\s*[-*•]\s/gm) || []).length;
    const hasCallToAction = /learn more|get started|try|download|subscribe/i.test(content);
    
    score += Math.min(15, hasQuestions * 3);
    score += Math.min(10, hasLists * 2);
    score += hasCallToAction ? 10 : 0;
    score += Math.min(15, headings * 3);
    
    return Math.min(100, score);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const metrics = analyzeContentQuality(content, language);

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {language === 'th' ? 'คุณภาพเนื้อหาระดับมืออาชีพ' : 'Professional Content Quality'}
        </h3>
        <div className="flex items-center gap-2">
          {getScoreIcon(metrics.overallScore)}
          <span className={`text-2xl font-bold ${getScoreColor(metrics.overallScore)}`}>
            {metrics.overallScore}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {language === 'th' ? 'ความอ่านง่าย' : 'Readability'}
            </span>
            <span className={`font-semibold ${getScoreColor(metrics.readabilityScore)}`}>
              {metrics.readabilityScore}/100
            </span>
          </div>
          <Progress value={metrics.readabilityScore} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {language === 'th' ? 'คะแนน SEO' : 'SEO Score'}
            </span>
            <span className={`font-semibold ${getScoreColor(metrics.seoScore)}`}>
              {metrics.seoScore}/100
            </span>
          </div>
          <Progress value={metrics.seoScore} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {language === 'th' ? 'ความเป็นต้นฉบับ' : 'Originality'}
            </span>
            <span className={`font-semibold ${getScoreColor(metrics.originalityScore)}`}>
              {metrics.originalityScore}/100
            </span>
          </div>
          <Progress value={metrics.originalityScore} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {language === 'th' ? 'ความเชี่ยวชาญ' : 'Expertise'}
            </span>
            <span className={`font-semibold ${getScoreColor(metrics.expertiseScore)}`}>
              {metrics.expertiseScore}/100
            </span>
          </div>
          <Progress value={metrics.expertiseScore} className="h-2" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {metrics.overallScore >= 90 && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Target className="h-3 w-3 mr-1" />
            {language === 'th' ? 'คุณภาพเยี่ยม' : 'Excellent Quality'}
          </Badge>
        )}
        {metrics.seoScore >= 85 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <TrendingUp className="h-3 w-3 mr-1" />
            {language === 'th' ? 'SEO ดีเยี่ยม' : 'SEO Optimized'}
          </Badge>
        )}
        {metrics.readabilityScore >= 80 && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'th' ? 'อ่านง่าย' : 'Highly Readable'}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ProductionContentQuality;
