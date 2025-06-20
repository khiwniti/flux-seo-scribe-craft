
import { useState, useEffect } from 'react';

export const useContentGeneration = () => {
  // Form states
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [wordCount, setWordCount] = useState('');
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Auto-generation states
  const [autoGenEnabled, setAutoGenEnabled] = useState(false);
  const [autoGenFrequency, setAutoGenFrequency] = useState('weekly');
  const [autoGenTime, setAutoGenTime] = useState('09:00');
  const [autoGenDay, setAutoGenDay] = useState('monday');
  const [autoGenTopics, setAutoGenTopics] = useState('');
  const [autoGenKeywords, setAutoGenKeywords] = useState('');
  const [autoGenHistory, setAutoGenHistory] = useState<any[]>([]);
  const [nextScheduledRun, setNextScheduledRun] = useState<Date | null>(null);
  
  // Intelligence states
  const [contentQuality, setContentQuality] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState('');
  const [contentType, setContentType] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [industryFocus, setIndustryFocus] = useState('');
  const [contentTemplate, setContentTemplate] = useState('');
  const [smartKeywords, setSmartKeywords] = useState<string[]>([]);
  const [contentInsights, setContentInsights] = useState<string[]>([]);

  // Analytics-based states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [blogSuggestions, setBlogSuggestions] = useState<any[]>([]);
  const [selectedAnalyticsSuggestion, setSelectedAnalyticsSuggestion] = useState<any>(null);

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

  // Auto-fill based on topic
  useEffect(() => {
    if (topic && topic.length > 10) {
      // Simulate AI-powered field enhancement
      setTimeout(() => {
        if (!keywords) {
          const autoKeywords = extractKeywordsFromTopic(topic);
          setKeywords(autoKeywords.join(', '));
        }
        
        if (!tone) {
          const detectedTone = detectToneFromTopic(topic);
          setTone(detectedTone);
        }
        
        if (!targetAudience) {
          const detectedAudience = detectAudienceFromTopic(topic);
          setTargetAudience(detectedAudience);
        }
        
        if (!contentType) {
          const detectedType = detectContentTypeFromTopic(topic);
          setContentType(detectedType);
        }
      }, 1000);
    }
  }, [topic]);

  const extractKeywordsFromTopic = (topicText: string): string[] => {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return topicText
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5);
  };

  const detectToneFromTopic = (topicText: string): string => {
    if (topicText.includes('guide') || topicText.includes('how to')) return 'professional';
    if (topicText.includes('tips') || topicText.includes('tricks')) return 'casual';
    if (topicText.includes('strategy') || topicText.includes('analysis')) return 'authoritative';
    return 'conversational';
  };

  const detectAudienceFromTopic = (topicText: string): string => {
    if (topicText.includes('beginner') || topicText.includes('basic')) return 'beginners';
    if (topicText.includes('advanced') || topicText.includes('expert')) return 'experts';
    if (topicText.includes('business') || topicText.includes('enterprise')) return 'professionals';
    return 'general';
  };

  const detectContentTypeFromTopic = (topicText: string): string => {
    if (topicText.includes('how to') || topicText.includes('guide')) return 'how-to';
    if (topicText.includes('best') || topicText.includes('top')) return 'listicle';
    if (topicText.includes('vs') || topicText.includes('compare')) return 'comparison';
    return 'blog';
  };

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI content generation with analytics enhancement
    setTimeout(() => {
      const content = `# ${topic}

## Introduction

${generateIntroduction()}

## Key Points

${generateKeyPoints()}

## SEO-Optimized Content

${generateSEOContent()}

## Conclusion

${generateConclusion()}

---

**Content Quality Score**: ${Math.floor(Math.random() * 20 + 80)}%
**SEO Score**: ${Math.floor(Math.random() * 15 + 85)}%
**Readability Score**: ${Math.floor(Math.random() * 10 + 90)}%`;
      
      setGeneratedContent(content);
      setContentQuality(Math.floor(Math.random() * 20 + 80));
      setSeoScore(Math.floor(Math.random() * 15 + 85));
      setReadabilityScore(Math.floor(Math.random() * 10 + 90));
      setSmartKeywords(extractKeywordsFromTopic(topic));
      setContentInsights([
        'Content is optimized for target keywords',
        'Reading level is appropriate for target audience',
        'Structure follows SEO best practices',
        'Content length is optimal for topic depth'
      ]);
      
      setIsGenerating(false);
    }, 3000);
  };

  const generateIntroduction = (): string => {
    return `In today's digital landscape, understanding ${topic.toLowerCase()} has become increasingly important. This comprehensive guide will explore the key aspects of ${topic.toLowerCase()} and provide you with actionable insights to improve your results.`;
  };

  const generateKeyPoints = (): string => {
    const points = [
      `Understanding the fundamentals of ${topic.toLowerCase()}`,
      `Best practices and proven strategies`,
      `Common mistakes to avoid`,
      `Tools and resources for success`,
      `Measuring and optimizing performance`
    ];
    
    return points.map((point, index) => `${index + 1}. ${point}`).join('\n');
  };

  const generateSEOContent = (): string => {
    return `When implementing ${topic.toLowerCase()}, it's crucial to focus on both quality and search engine optimization. The key is to create content that serves your audience while incorporating relevant keywords naturally.

### Best Practices:
- Focus on user intent and search behavior
- Create comprehensive, valuable content
- Optimize for featured snippets
- Include internal and external links
- Monitor performance and adjust strategies`;
  };

  const generateConclusion = (): string => {
    return `Mastering ${topic.toLowerCase()} requires a strategic approach, continuous learning, and consistent implementation. By following the guidelines outlined in this article, you'll be well-positioned to achieve your goals and drive meaningful results.`;
  };

  const generateAutoContent = async () => {
    if (!autoGenTopics.trim()) return;
    
    const topics = autoGenTopics.split(',').map(t => t.trim());
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    setTopic(randomTopic);
    
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
    
    setAutoGenHistory(prev => [newEntry, ...prev.slice(0, 9)]);
  };

  const toggleAutoGeneration = () => {
    setAutoGenEnabled(!autoGenEnabled);
    
    if (!autoGenEnabled) {
      // Calculate next scheduled run
      const now = new Date();
      const nextRun = new Date(now);
      
      if (autoGenFrequency === 'daily') {
        nextRun.setDate(now.getDate() + 1);
      } else {
        nextRun.setDate(now.getDate() + 7);
      }
      
      const [hours, minutes] = autoGenTime.split(':');
      nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      setNextScheduledRun(nextRun);
    } else {
      setNextScheduledRun(null);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    // Form states
    topic,
    setTopic,
    keywords,
    setKeywords,
    tone,
    setTone,
    wordCount,
    setWordCount,
    
    // Generated content
    generatedContent,
    generatedImages,
    isGenerating,
    
    // Auto-generation states
    autoGenEnabled,
    autoGenFrequency,
    setAutoGenFrequency,
    autoGenTime,
    setAutoGenTime,
    autoGenDay,
    setAutoGenDay,
    autoGenTopics,
    setAutoGenTopics,
    autoGenKeywords,
    setAutoGenKeywords,
    autoGenHistory,
    nextScheduledRun,
    
    // Intelligence states
    contentQuality,
    seoScore,
    readabilityScore,
    trendingTopics,
    contentSuggestions,
    targetAudience,
    setTargetAudience,
    contentType,
    setContentType,
    writingStyle,
    setWritingStyle,
    industryFocus,
    setIndustryFocus,
    contentTemplate,
    setContentTemplate,
    smartKeywords,
    contentInsights,
    
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
    toggleAutoGeneration,
    copyToClipboard,
    downloadImage
  };
};
