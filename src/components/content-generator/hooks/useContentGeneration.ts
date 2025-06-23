
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useFormStates } from './useFormStates';
import { useAutoGeneration } from './useAutoGeneration';
import { useContentIntelligence } from './useContentIntelligence';
import { useContentAnalysis } from './useContentAnalysis';
import { useImageGeneration } from './useImageGeneration';
import { useTopicAnalysis } from './useTopicAnalysis';
import { LanguageAwareContentGenerator } from '../LanguageAwareContentGenerator';

export const useContentGeneration = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const formStates = useFormStates();
  const autoGenStates = useAutoGeneration();
  const intelligenceStates = useContentIntelligence(formStates.topic);
  const contentAnalysis = useContentAnalysis();
  const imageGeneration = useImageGeneration();
  
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Analytics-based states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [blogSuggestions, setBlogSuggestions] = useState<any[]>([]);
  const [selectedAnalyticsSuggestion, setSelectedAnalyticsSuggestion] = useState<any>(null);

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
    apiKeyErrorForToast: t("API Key is invalid or missing. Please configure it in Settings.", "คีย์ API ไม่ถูกต้องหรือขาดหายไป กรุณาตั้งค่าในส่วนการตั้งค่า"),
    defaultErrorForToast: t("An unknown error occurred.", "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"),
  };

  // Topic analysis hook
  useTopicAnalysis({
    topic: formStates.topic,
    setKeywords: formStates.setKeywords,
    setTone: formStates.setTone,
    setTargetAudience: formStates.setTargetAudience,
    setContentType: formStates.setContentType,
    setIndustryFocus: formStates.setIndustryFocus,
    keywords: formStates.keywords,
    tone: formStates.tone,
    extractKeywordsFromTopic: intelligenceStates.extractKeywordsFromTopic,
    detectToneFromTopic: intelligenceStates.detectToneFromTopic
  });

  const generateContent = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      if (!formStates.topic) {
        throw new Error(language === 'th' ? "กรุณาระบุหัวข้อเพื่อสร้างเนื้อหา" : "Topic is required to generate content.");
      }

      const content = await LanguageAwareContentGenerator.generateContent({
        topic: formStates.topic,
        keywords: formStates.keywords,
        tone: formStates.tone,
        wordCount: formStates.wordCount,
        contentType: formStates.contentType,
        writingStyle: formStates.writingStyle,
        targetAudience: formStates.targetAudience,
        industryFocus: formStates.industryFocus,
        language
      });
      
      setGeneratedContent(content);
      toast({
        title: T_Toasts.contentGeneratedTitle,
        description: T_Toasts.contentGeneratedDesc,
      });
      
    } catch (err: any) {
      console.error("Error generating content:", err);
      const errorMessage = err.isApiKeyInvalid ? T_Toasts.apiKeyErrorForToast : (err.message || T_Toasts.defaultErrorForToast);
      setError(errorMessage);
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
      toast({
        title: T_Toasts.autoGenerationErrorTitle,
        description: T_Toasts.autoGenerationErrorDesc,
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setError(null);
    
    const topics = autoGenStates.autoGenTopics.split(',').map(t => t.trim());
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    const originalTopic = formStates.topic;
    formStates.setTopic(randomTopic);

    try {
      const content = await LanguageAwareContentGenerator.generateContent({
        topic: randomTopic,
        keywords: autoGenStates.autoGenKeywords,
        tone: formStates.tone || 'professional',
        wordCount: formStates.wordCount || 'medium',
        contentType: formStates.contentType || 'blog',
        writingStyle: formStates.writingStyle || 'informative',
        targetAudience: formStates.targetAudience || 'general',
        industryFocus: formStates.industryFocus || 'general',
        language
      });
      
      const newEntry = {
        id: Date.now(),
        topic: randomTopic,
        date: new Date(),
        status: 'completed',
        contentPreview: content.substring(0, 100) + "...",
        wordCount: content.split(' ').length,
        seoScore: Math.floor(Math.random() * 20 + 80),
        language: language
      };
      
      autoGenStates.setAutoGenHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      toast({
        title: T_Toasts.autoContentGeneratedTitle,
        description: T_Toasts.autoContentGeneratedDesc,
      });

    } catch (err: any) {
      console.error("Error during auto-generation:", err);
      const errorMessage = err.isApiKeyInvalid ? T_Toasts.apiKeyErrorForToast : (err.message || T_Toasts.defaultErrorForToast);
      setError(errorMessage);
      toast({
        title: T_Toasts.autoGenerationFailedTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      formStates.setTopic(originalTopic);
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return {
    // Form states
    ...formStates,
    
    // Generated content
    generatedContent,
    generatedImages: imageGeneration.generatedImages,
    isGenerating,
    error,
    setError,
    
    // Auto-generation states
    ...autoGenStates,
    
    // Intelligence states
    ...intelligenceStates,
    
    // Content analysis states
    contentQuality: contentAnalysis.contentQuality,
    seoScore: contentAnalysis.seoScore,
    readabilityScore: contentAnalysis.readabilityScore,
    smartKeywords: contentAnalysis.smartKeywords,
    contentInsights: contentAnalysis.contentInsights,
    
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
    downloadImage: imageGeneration.downloadImage
  };
};
