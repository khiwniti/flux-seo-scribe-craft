
import { useState, useEffect } from 'react';
import { ContentInsights } from '../types';
import { 
  extractKeywordsFromTopic, 
  detectToneFromTopic, 
  detectAudienceFromTopic, 
  detectContentTypeFromTopic 
} from '../utils/contentUtils';

export const useContentIntelligence = (topic: string) => {
  const [contentQuality, setContentQuality] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<string[]>([]);
  const [smartKeywords, setSmartKeywords] = useState<string[]>([]);
  const [contentInsights, setContentInsights] = useState<ContentInsights>({});

  // Initialize trending topics and suggestions
  useEffect(() => {
    setTrendingTopics([
      'AI Content Creation',
      'Voice Search SEO',
      'Local Business Marketing',
      'Content Personalization',
      'Video Marketing Trends'
    ]);
    
    setContentSuggestions([
      'Create evergreen content that maintains relevance over time',
      'Focus on solving specific problems your audience faces',
      'Include data-driven insights to boost credibility',
      'Optimize for featured snippets with structured content',
      'Add visual elements to improve engagement'
    ]);
  }, []);

  return {
    contentQuality,
    setContentQuality,
    seoScore,
    setSeoScore,
    readabilityScore,
    setReadabilityScore,
    trendingTopics,
    contentSuggestions,
    smartKeywords,
    setSmartKeywords,
    contentInsights,
    setContentInsights,
    extractKeywordsFromTopic,
    detectToneFromTopic,
    detectAudienceFromTopic,
    detectContentTypeFromTopic
  };
};
