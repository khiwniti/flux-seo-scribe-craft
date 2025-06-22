
import { useState } from 'react';
import { ContentInsights } from '../types';

export const useContentAnalysis = () => {
  const [contentQuality, setContentQuality] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [smartKeywords, setSmartKeywords] = useState<string[]>([]);
  const [contentInsights, setContentInsights] = useState<ContentInsights>({});

  const analyzeContent = (content: string, keywords: string, language: 'en' | 'th') => {
    const contentLength = content.split(' ').length;
    const hasSubheadings = (content.match(/#{1,6}\s/g) || []).length;
    const keywordDensity = keywords ? 
      (content.toLowerCase().split(keywords.toLowerCase()).length - 1) / contentLength * 100 : 0;
    
    // Calculate quality scores
    const qualityScore = Math.min(100, Math.max(70, 
      contentLength > 800 ? 85 + (hasSubheadings * 3) + (keywordDensity > 1 && keywordDensity < 4 ? 10 : 0) : 70
    ));
    
    const seoScoreValue = Math.min(100, Math.max(60, 
      75 + (keywordDensity > 1 && keywordDensity < 3 ? 20 : 0) + (hasSubheadings * 2) + (contentLength > 1000 ? 5 : 0)
    ));
    
    const readabilityScoreValue = Math.min(100, Math.max(75, 
      80 + (hasSubheadings * 2) + (contentLength > 500 && contentLength < 2000 ? 10 : 0)
    ));

    setContentQuality(qualityScore);
    setSeoScore(seoScoreValue);
    setReadabilityScore(readabilityScoreValue);

    // Generate insights
    setContentInsights({
      estimatedReadTime: Math.ceil(contentLength / (language === 'th' ? 150 : 200)),
      targetKeywordDensity: `${keywordDensity.toFixed(1)}%`,
      recommendedHeadings: hasSubheadings,
      suggestedImages: Math.ceil(contentLength / 300),
      seoComplexity: keywordDensity > 3 ? 'High' : keywordDensity > 1.5 ? 'Medium' : 'Low',
      competitiveLevel: contentLength > 1500 ? 'High' : contentLength > 800 ? 'Medium' : 'Low',
      languageOptimization: language === 'th' ? 'Thai-optimized' : 'English-optimized',
      professionalGrade: contentLength > 1000 && hasSubheadings >= 3 ? 'Publication Ready' : 'Good Quality'
    });
  };

  return {
    contentQuality,
    seoScore,
    readabilityScore,
    smartKeywords,
    setSmartKeywords,
    contentInsights,
    analyzeContent
  };
};
