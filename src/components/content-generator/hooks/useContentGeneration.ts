
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
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage
import { useToast } from '@/hooks/use-toast'; // Import useToast

export const useContentGeneration = () => {
  const { language } = useLanguage(); // Consume language context
  const { toast } = useToast(); // Get toast function
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

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  // Translations for toasts
  const T_Toasts = {
    contentGeneratedTitle: t("Content Generated", "สร้างเนื้อหาสำเร็จ"),
    contentGeneratedDesc: t("AI content has been successfully generated and analyzed.", "AI สร้างและวิเคราะห์เนื้อหาเรียบร้อยแล้ว"),
    generationFailedTitle: t("Generation Failed", "การสร้างล้มเหลว"),
    autoContentGeneratedTitle: t("Auto Content Generated", "สร้างเนื้อหาอัตโนมัติสำเร็จ"),
    autoContentGeneratedDesc: t("New content generated automatically.", "เนื้อหาใหม่ถูกสร้างขึ้นอัตโนมัติแล้ว"),
    autoGenerationFailedTitle: t("Auto-generation Failed", "การสร้างอัตโนมัติล้มเหลว"),
    autoGenerationErrorTitle: t("Auto-generation Error", "ข้อผิดพลาดการสร้างอัตโนมัติ"),
    autoGenerationErrorDesc: t("Topics and keywords must be set for auto-generation.", "ต้องตั้งค่าหัวข้อและคีย์เวิร์ดสำหรับการสร้างอัตโนมัติ"),
    // API key error message is already handled by components that call this hook if error.isApiKeyInvalid
    apiKeyErrorForToast: t("API Key is invalid or missing. Please configure it in Settings.", "คีย์ API ไม่ถูกต้องหรือขาดหายไป กรุณาตั้งค่าในส่วนการตั้งค่า"),
    defaultErrorForToast: t("An unknown error occurred.", "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"),
  };
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
    setError(null); // Clear previous errors
    
    try {
      // Simulate AI content generation with analytics enhancement
      // In a real scenario, this would involve API calls to generateBlogContent from geminiService
      // For now, we'll keep the setTimeout to simulate async behavior.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

      if (!formStates.topic) {
        throw new Error("Topic is required to generate content.");
      }

      // This part remains largely simulated as per original logic
      // Replace with actual call to generateBlogContent(prompt) if integrating fully
      const prompt = `Topic: ${formStates.topic}, Keywords: ${formStates.keywords}, Tone: ${formStates.tone}, Word Count: ${formStates.wordCount}, Content Type: ${formStates.contentType}`;
      // const actualContentFromAI = await generateBlogContent(prompt); // Example of actual call

      // Simulated content generation:
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
      
      setGeneratedContent(content); // Use actualContentFromAI if making real calls
      intelligenceStates.setContentQuality(Math.floor(Math.random() * 20 + 80));
      intelligenceStates.setSeoScore(Math.floor(Math.random() * 15 + 85));
      intelligenceStates.setReadabilityScore(Math.floor(Math.random() * 10 + 90));
      intelligenceStates.setSmartKeywords(intelligenceStates.extractKeywordsFromTopic(formStates.topic));
      
      intelligenceStates.setContentInsights({
        estimatedReadTime: Math.ceil(content.split(' ').length / 200),
        targetKeywordDensity: '2.5%',
        recommendedHeadings: content.split('\n').filter(line => line.trim().startsWith('#')).length,
        suggestedImages: 3,
        seoComplexity: 'Medium',
        competitiveLevel: 'Moderate'
      });

      setGeneratedImages([
        { id: 1, url: '/placeholder.svg', alt: `${formStates.topic} illustration`, prompt: `Professional illustration for ${formStates.topic}`, enhanced: true, quality: 'high', seoOptimized: true },
        { id: 2, url: '/placeholder.svg', alt: `${formStates.topic} infographic`, prompt: `Infographic showing key concepts of ${formStates.topic}`, enhanced: true, quality: 'high', seoOptimized: true }
      ]);
      toast({
        title: T_Toasts.contentGeneratedTitle,
        description: T_Toasts.contentGeneratedDesc,
      });
      
    } catch (err: any) {
      console.error("Error generating content:", err);
      const errorMessage = err.isApiKeyInvalid
        ? T_Toasts.apiKeyErrorForToast
        : err.message || T_Toasts.defaultErrorForToast;
      setError(errorMessage);
      setGeneratedContent(''); // Clear any partial content
      toast({
        title: T_Toasts.generationFailedTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAutoContent = async () => {
    if (!autoGenStates.autoGenTopics.trim()) {
        const errMessage = T_Toasts.autoGenerationErrorDesc;
        setError(errMessage);
        toast({ title: T_Toasts.autoGenerationErrorTitle, description: errMessage, variant: "destructive"});
        return;
    }
    setIsGenerating(true);
    setError(null);
    
    const topics = autoGenStates.autoGenTopics.split(',').map(t => t.trim());
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    // Temporarily set form topic for generation logic if it relies on it
    const originalTopic = formStates.topic;
    formStates.setTopic(randomTopic);

    try {
      // Simulate delay and AI call for auto-generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      // const promptForAuto = `Generate content for topic: ${randomTopic}`;
      // const autoGeneratedText = await generateBlogContent(promptForAuto); // Example actual call

      // Using existing simulation logic for now
      const content = `# ${randomTopic} (Auto-Generated)
## Introduction
${generateIntroduction(randomTopic)}
## Conclusion
${generateConclusion(randomTopic)}`;
      // setGeneratedContent(autoGeneratedText); // If using actual call

      const newEntry = {
        id: Date.now(),
        topic: randomTopic,
        date: new Date(),
        status: 'completed',
        contentPreview: content.substring(0, 100) + "...", // Store a preview
        wordCount: Math.floor(Math.random() * 1000 + 1500),
        seoScore: Math.floor(Math.random() * 20 + 80)
      };
      autoGenStates.setAutoGenHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      toast({
        title: T_Toasts.autoContentGeneratedTitle,
        description: T_Toasts.autoContentGeneratedDesc,
      });

    } catch (err: any) {
      console.error("Error during auto-generation:", err);
      const errorMessage = err.isApiKeyInvalid
        ? T_Toasts.apiKeyErrorForToast
        : err.message || T_Toasts.defaultErrorForToast;
      setError(errorMessage);
      toast({
        title: T_Toasts.autoGenerationFailedTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      formStates.setTopic(originalTopic); // Restore original topic if it was changed
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
    error, // Expose error state
    setError, // Expose setError to allow clearing error from component if needed
    
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
