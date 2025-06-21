
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { generateBlogContent, GeneratedContentResponse, GeminiServiceError } from '@/lib/geminiService'; // Adjusted path
import { makeWpAjaxRequest, WpAjaxError } from '@/lib/wpApiService';

// Define structure for history items from backend
interface HistoryItem {
  id: number;
  title: string;
  // content: string; // if needed
  meta_description: string;
  language: string;
  seo_score: number;
  status: string;
  created_at: string;
}

export const useContentGeneration = () => {
  // Form states
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState(''); // Keep for now, though not directly used by generateBlogContent
  const [wordCount, setWordCount] = useState(''); // Keep for now, not directly used
  const [language, setLanguage] = useState('en'); // Added language state

  // Generated content
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  // isGenerating will be derived from mutation.isPending
  
  // Auto-generation states
  const [autoGenEnabled, setAutoGenEnabled] = useState(false);
  const [autoGenFrequency, setAutoGenFrequency] = useState('weekly');
  const [autoGenTime, setAutoGenTime] = useState('09:00');
  const [autoGenDay, setAutoGenDay] = useState('monday');
  const [autoGenTopics, setAutoGenTopics] = useState('');
  const [autoGenKeywords, setAutoGenKeywords] = useState('');
  // const [autoGenHistory, setAutoGenHistory] = useState<any[]>([]); // To be replaced by useQuery
  const [nextScheduledRun, setNextScheduledRun] = useState<Date | null>(null);

  const { data: autoGenHistory = [], isLoading: isLoadingHistory, error: historyError } = useQuery<HistoryItem[], WpAjaxError>({
    queryKey: ['contentGenerationHistory'],
    queryFn: async () => {
      return makeWpAjaxRequest<HistoryItem[]>({
        wpAjaxAction: 'flux_seo_proxy',
        action: 'get_content_list', // PHP action to fetch history
      });
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (err) => {
      toast.error("Failed to load generation history: " + err.message);
    }
  });
  
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

  const mutation = useMutation<
    GeneratedContentResponse,
    GeminiServiceError,
    { currentTopic: string; currentLanguage: string; currentContentType: string; currentKeywords: string }
  >({
    mutationFn: async (variables) => {
      const { currentTopic, currentLanguage, currentContentType, currentKeywords } = variables;
      if (!currentTopic.trim()) {
        throw new Error("Topic cannot be empty."); // Simple validation
      }
      return generateBlogContent(currentTopic, currentLanguage, currentContentType, currentKeywords);
    },
    onMutate: () => {
      setGeneratedContent(''); // Clear previous content
      // setIsGenerating(true) is handled by mutation.isPending
      toast.info("Generating AI content, please wait...");
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content); // Assuming 'content' has the main text
      setSeoScore(data.seo_score || 0); // Update from actual response
      // setContentQuality, setReadabilityScore if available in 'data'
      // setSmartKeywords if available
      toast.success("Content generated successfully!");
    },
    onError: (error) => {
      console.error("Error generating content:", error);
      if (error.isApiKeyInvalid) {
        toast.error("API Key is invalid or missing. Please check plugin settings.");
      } else {
        toast.error(`Error generating content: ${error.message}`);
      }
    },
    // onSettled: () => { // Handled by mutation.isPending for isGenerating state }
  });

  const generateContent = useCallback(() => {
    // Basic validation before calling mutation
    if (!topic.trim()) {
      toast.error("Please enter a topic to generate content.");
      return;
    }
    if (!contentType.trim()){
      toast.error("Please select a content type.");
      return;
    }
    // Language is defaulted to 'en', keywords can be empty
    mutation.mutate({
      currentTopic: topic,
      currentLanguage: language,
      currentContentType: contentType,
      currentKeywords: keywords
    });
  }, [topic, language, contentType, keywords, mutation]);

  // These are placeholder/simulated functions from the original hook
  // They are not directly used by the new generateContent logic but kept for structure
  // In a real scenario, these might be replaced or removed if not needed.
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
    language,
    setLanguage,
    
    // Generated content
    generatedContent,
    generatedImages, // Keep for now, though image generation isn't wired up via this mutation
    isGenerating: mutation.isPending, // Use mutation's pending state
    
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
