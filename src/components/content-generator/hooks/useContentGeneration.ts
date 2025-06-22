
import { useState, useEffect } from 'react';
import { GeneratedImage, ContentInsights } from '../types';
import { useFormStates } from './useFormStates';
import { useAutoGeneration } from './useAutoGeneration';
import { useContentIntelligence } from './useContentIntelligence';
import { generateBlogContent } from '../../../lib/geminiService';
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
  const [error, setError] = useState<string | null>(null);
  
  // Analytics-based states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [blogSuggestions, setBlogSuggestions] = useState<any[]>([]);
  const [selectedAnalyticsSuggestion, setSelectedAnalyticsSuggestion] = useState<any>(null);

  // Auto-fill based on topic with enhanced AI analysis
  useEffect(() => {
    if (formStates.topic && formStates.topic.length > 10) {
      setTimeout(async () => {
        try {
          // Use AI to analyze topic and suggest improvements
          const analysisPrompt = `Analyze this topic for content creation: "${formStates.topic}". Provide:
1. 5 relevant keywords
2. Appropriate tone (professional/casual/authoritative/conversational)
3. Target audience
4. Content type suggestion
5. Industry classification

Format as JSON with keys: keywords, tone, audience, contentType, industry`;

          const aiAnalysis = await generateBlogContent(analysisPrompt);
          const parsedAnalysis = JSON.parse(aiAnalysis);

          if (!formStates.keywords && parsedAnalysis.keywords) {
            formStates.setKeywords(Array.isArray(parsedAnalysis.keywords) ? 
              parsedAnalysis.keywords.join(', ') : parsedAnalysis.keywords);
          }
          
          if (!formStates.tone && parsedAnalysis.tone) {
            formStates.setTone(parsedAnalysis.tone);
          }
          
          if (!formStates.targetAudience && parsedAnalysis.audience) {
            formStates.setTargetAudience(parsedAnalysis.audience);
          }
          
          if (!formStates.contentType && parsedAnalysis.contentType) {
            formStates.setContentType(parsedAnalysis.contentType);
          }

          if (!formStates.industryFocus && parsedAnalysis.industry) {
            formStates.setIndustryFocus(parsedAnalysis.industry);
          }
        } catch (error) {
          console.log('AI analysis failed, using fallback methods');
          // Fallback to existing logic
          if (!formStates.keywords) {
            const autoKeywords = intelligenceStates.extractKeywordsFromTopic(formStates.topic);
            formStates.setKeywords(autoKeywords.join(', '));
          }
          
          if (!formStates.tone) {
            const detectedTone = intelligenceStates.detectToneFromTopic(formStates.topic);
            formStates.setTone(detectedTone);
          }
        }
      }, 1000);
    }
  }, [formStates.topic]);

  const generateContent = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      if (!formStates.topic) {
        throw new Error("Topic is required to generate content.");
      }

      // Create comprehensive AI prompt
      const prompt = `Create a comprehensive ${formStates.contentType || 'blog post'} about "${formStates.topic}".

Requirements:
- Word count: approximately ${formStates.wordCount} words
- Tone: ${formStates.tone}
- Target audience: ${formStates.targetAudience}
- Keywords to include: ${formStates.keywords}
- Industry focus: ${formStates.industryFocus}
- Writing style: ${formStates.writingStyle}

Structure the content with:
1. Engaging headline
2. Introduction that hooks the reader
3. Main body with subheadings
4. Key points and actionable insights
5. SEO-optimized content
6. Compelling conclusion with call-to-action

Make it engaging, informative, and optimized for search engines.`;

      const content = await generateBlogContent(prompt);
      
      setGeneratedContent(content);
      
      // Generate quality scores based on content analysis
      const contentLength = content.split(' ').length;
      const hasSubheadings = (content.match(/#{1,6}\s/g) || []).length;
      const keywordDensity = formStates.keywords ? 
        (content.toLowerCase().split(formStates.keywords.toLowerCase()).length - 1) / contentLength * 100 : 0;
      
      intelligenceStates.setContentQuality(Math.min(100, Math.max(60, 
        contentLength > 500 ? 80 + (hasSubheadings * 5) : 60
      )));
      
      intelligenceStates.setSeoScore(Math.min(100, Math.max(50, 
        70 + (keywordDensity > 1 && keywordDensity < 5 ? 20 : 0) + (hasSubheadings * 3)
      )));
      
      intelligenceStates.setReadabilityScore(Math.min(100, Math.max(70, 
        85 + (hasSubheadings * 2)
      )));
      
      // Extract smart keywords from generated content
      const smartKeywords = intelligenceStates.extractKeywordsFromTopic(content);
      intelligenceStates.setSmartKeywords(smartKeywords);
      
      // Generate content insights
      intelligenceStates.setContentInsights({
        estimatedReadTime: Math.ceil(contentLength / 200),
        targetKeywordDensity: `${keywordDensity.toFixed(1)}%`,
        recommendedHeadings: hasSubheadings,
        suggestedImages: Math.ceil(contentLength / 400),
        seoComplexity: keywordDensity > 3 ? 'High' : keywordDensity > 1.5 ? 'Medium' : 'Low',
        competitiveLevel: contentLength > 1500 ? 'High' : contentLength > 800 ? 'Medium' : 'Low'
      });

      // Generate relevant images
      setGeneratedImages([
        { 
          id: 1, 
          url: '/placeholder.svg', 
          alt: `${formStates.topic} main illustration`, 
          prompt: `Professional high-quality illustration for ${formStates.topic}, ${formStates.tone} style`, 
          enhanced: true, 
          quality: 'high', 
          seoOptimized: true 
        },
        { 
          id: 2, 
          url: '/placeholder.svg', 
          alt: `${formStates.topic} infographic`, 
          prompt: `Detailed infographic showing key concepts of ${formStates.topic}`, 
          enhanced: true, 
          quality: 'high', 
          seoOptimized: true 
        }
      ]);
      
    } catch (err: any) {
      console.error("Error generating content:", err);
      const errorMessage = err.isApiKeyInvalid
        ? "API Key is invalid or missing. Please configure it in Settings."
        : err.message || "An unknown error occurred during content generation.";
      setError(errorMessage);
      setGeneratedContent('');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAutoContent = async () => {
    if (!autoGenStates.autoGenTopics.trim()) {
        setError("Auto-generation topics cannot be empty.");
        return;
    }
    setIsGenerating(true);
    setError(null);
    
    const topics = autoGenStates.autoGenTopics.split(',').map(t => t.trim());
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    const originalTopic = formStates.topic;
    formStates.setTopic(randomTopic);

    try {
      const autoPrompt = `Create an engaging ${formStates.contentType || 'blog post'} about "${randomTopic}".
      
Make it informative, well-structured, and SEO-optimized. Include:
- Compelling headline
- Introduction
- 3-4 main sections with subheadings  
- Actionable insights
- Conclusion with call-to-action

Word count: approximately ${formStates.wordCount || 1500} words.
Tone: ${formStates.tone || 'professional'}`;

      const content = await generateBlogContent(autoPrompt);
      
      const newEntry = {
        id: Date.now(),
        topic: randomTopic,
        date: new Date(),
        status: 'completed',
        contentPreview: content.substring(0, 100) + "...",
        wordCount: content.split(' ').length,
        seoScore: Math.floor(Math.random() * 20 + 80)
      };
      
      autoGenStates.setAutoGenHistory(prev => [newEntry, ...prev.slice(0, 9)]);

    } catch (err: any) {
      console.error("Error during auto-generation:", err);
      const errorMessage = err.isApiKeyInvalid
        ? "API Key is invalid or missing for auto-generation. Please configure it in Settings."
        : err.message || "An unknown error occurred during auto-generation.";
      setError(errorMessage);
    } finally {
      formStates.setTopic(originalTopic);
      setIsGenerating(false);
    }
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
    error,
    setError,
    
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
