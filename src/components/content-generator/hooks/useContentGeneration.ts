
import { useState, useEffect } from 'react';
import { GeneratedImage, ContentInsights } from '../types';
import { useFormStates } from './useFormStates';
import { useAutoGeneration } from './useAutoGeneration';
import { useContentIntelligence } from './useContentIntelligence';
import { 
  generateIntroduction, 
  generateKeyPoints, 
  generateSEOContent, 
  generateConclusion 
} from '../utils/contentGenerator';

export const useContentGeneration = () => {
  const formStates = useFormStates();
  const autoGenStates = useAutoGeneration();
  const intelligenceStates = useContentIntelligence(formStates.topic);
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Analytics-based states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [blogSuggestions, setBlogSuggestions] = useState<any[]>([]);
  const [selectedAnalyticsSuggestion, setSelectedAnalyticsSuggestion] = useState<any>(null);

  // Auto-fill based on topic
  useEffect(() => {
    if (formStates.topic && formStates.topic.length > 10) {
      // Simulate AI-powered field enhancement
      setTimeout(() => {
        if (!formStates.keywords) {
          const autoKeywords = intelligenceStates.extractKeywordsFromTopic(formStates.topic);
          formStates.setKeywords(autoKeywords.join(', '));
        }
        
        if (!formStates.tone) {
          const detectedTone = intelligenceStates.detectToneFromTopic(formStates.topic);
          formStates.setTone(detectedTone);
        }
        
        if (!formStates.targetAudience) {
          const detectedAudience = intelligenceStates.detectAudienceFromTopic(formStates.topic);
          formStates.setTargetAudience(detectedAudience);
        }
        
        if (!formStates.contentType) {
          const detectedType = intelligenceStates.detectContentTypeFromTopic(formStates.topic);
          formStates.setContentType(detectedType);
        }
      }, 1000);
    }
  }, [formStates.topic]);

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI content generation with analytics enhancement
    setTimeout(() => {
      const content = `# ${formStates.topic}

## Introduction

${generateIntroduction(formStates.topic)}

## Key Points

${generateKeyPoints(formStates.topic)}

## SEO-Optimized Content

${generateSEOContent(formStates.topic)}

## Conclusion

${generateConclusion(formStates.topic)}

---

**Content Quality Score**: ${Math.floor(Math.random() * 20 + 80)}%
**SEO Score**: ${Math.floor(Math.random() * 15 + 85)}%
**Readability Score**: ${Math.floor(Math.random() * 10 + 90)}%`;
      
      setGeneratedContent(content);
      intelligenceStates.setContentQuality(Math.floor(Math.random() * 20 + 80));
      intelligenceStates.setSeoScore(Math.floor(Math.random() * 15 + 85));
      intelligenceStates.setReadabilityScore(Math.floor(Math.random() * 10 + 90));
      intelligenceStates.setSmartKeywords(intelligenceStates.extractKeywordsFromTopic(formStates.topic));
      
      // Set proper ContentInsights object
      intelligenceStates.setContentInsights({
        estimatedReadTime: Math.ceil(content.split(' ').length / 200),
        targetKeywordDensity: '2.5%',
        recommendedHeadings: content.split('\n').filter(line => line.trim().startsWith('#')).length,
        suggestedImages: 3,
        seoComplexity: 'Medium',
        competitiveLevel: 'Moderate'
      });

      // Generate sample images
      setGeneratedImages([
        {
          id: 1,
          url: '/placeholder.svg',
          alt: `${formStates.topic} illustration`,
          prompt: `Professional illustration for ${formStates.topic}`,
          enhanced: true,
          quality: 'high',
          seoOptimized: true
        },
        {
          id: 2,
          url: '/placeholder.svg',
          alt: `${formStates.topic} infographic`,
          prompt: `Infographic showing key concepts of ${formStates.topic}`,
          enhanced: true,
          quality: 'high',
          seoOptimized: true
        }
      ]);
      
      setIsGenerating(false);
    }, 3000);
  };

  const generateAutoContent = async () => {
    if (!autoGenStates.autoGenTopics.trim()) return;
    
    const topics = autoGenStates.autoGenTopics.split(',').map(t => t.trim());
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    formStates.setTopic(randomTopic);
    
    // Generate content with the random topic
    setTimeout(() => {
      generateContent();
    }, 1000);
    
    // Add to history
    const newEntry = {
      id: Date.now(),
      topic: randomTopic,
      date: new Date(),
      status: 'completed',
      wordCount: Math.floor(Math.random() * 1000 + 1500),
      seoScore: Math.floor(Math.random() * 20 + 80)
    };
    
    autoGenStates.setAutoGenHistory(prev => [newEntry, ...prev.slice(0, 9)]);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    // Form states
    ...formStates,
    
    // Generated content
    generatedContent,
    generatedImages,
    isGenerating,
    
    // Auto-generation states
    ...autoGenStates,
    
    // Intelligence states
    ...intelligenceStates,
    
    // Analytics-based states
    analyticsData,
    setAnalyticsData,
    blogSuggestions,
    setBlogSuggestions,
    selectedAnalyticsSuggestion,
    setSelectedAnalyticsSuggestion,
    
    // Actions
    generateContent,
    generateAutoContent,
    copyToClipboard,
    downloadImage
  };
};
