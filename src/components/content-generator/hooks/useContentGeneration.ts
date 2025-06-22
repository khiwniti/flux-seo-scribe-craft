
import { useState } from 'react';
import { useFormStates } from './useFormStates';
import { useAutoGeneration } from './useAutoGeneration';
import { useContentIntelligence } from './useContentIntelligence';
import { useContentAnalysis } from './useContentAnalysis';
import { useImageGeneration } from './useImageGeneration';
import { useTopicAnalysis } from './useTopicAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageAwareContentGenerator } from '../LanguageAwareContentGenerator';

export const useContentGeneration = () => {
  const formStates = useFormStates();
  const autoGenStates = useAutoGeneration();
  const intelligenceStates = useContentIntelligence(formStates.topic);
  const contentAnalysis = useContentAnalysis();
  const imageGeneration = useImageGeneration();
  const { language } = useLanguage();
  
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Analytics-based states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [blogSuggestions, setBlogSuggestions] = useState<any[]>([]);
  const [selectedAnalyticsSuggestion, setSelectedAnalyticsSuggestion] = useState<any>(null);

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
      
      // Analyze content quality
      contentAnalysis.analyzeContent(content, formStates.keywords, language);
      
      // Extract keywords and generate images
      const smartKeywords = intelligenceStates.extractKeywordsFromTopic(content);
      contentAnalysis.setSmartKeywords(smartKeywords);
      imageGeneration.generateImages(formStates.topic, formStates.tone, language);
      
    } catch (err: any) {
      console.error("Error generating content:", err);
      const errorMessage = err.isApiKeyInvalid
        ? (language === 'th' ? "API Key ไม่ถูกต้องหรือไม่พบ กรุณาตั้งค่าในหน้า Settings" : "API Key is invalid or missing. Please configure it in Settings.")
        : err.message || (language === 'th' ? "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการสร้างเนื้อหา" : "An unknown error occurred during content generation.");
      setError(errorMessage);
      setGeneratedContent('');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAutoContent = async () => {
    if (!autoGenStates.autoGenTopics.trim()) {
        setError(language === 'th' ? "กรุณาระบุหัวข้อสำหรับการสร้างอัตโนมัติ" : "Auto-generation topics cannot be empty.");
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

    } catch (err: any) {
      console.error("Error during auto-generation:", err);
      const errorMessage = err.isApiKeyInvalid
        ? (language === 'th' ? "API Key ไม่ถูกต้องหรือไม่พบ กรุณาตั้งค่าในหน้า Settings" : "API Key is invalid or missing for auto-generation. Please configure it in Settings.")
        : err.message || (language === 'th' ? "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการสร้างอัตโนมัติ" : "An unknown error occurred during auto-generation.");
      setError(errorMessage);
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
