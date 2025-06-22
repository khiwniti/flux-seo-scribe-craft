
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageAwareContentGenerator } from '../LanguageAwareContentGenerator';

interface TopicAnalysisProps {
  topic: string;
  setKeywords: (keywords: string) => void;
  setTone: (tone: string) => void;
  setTargetAudience: (audience: string) => void;
  setContentType: (type: string) => void;
  setIndustryFocus: (industry: string) => void;
  keywords: string;
  tone: string;
  extractKeywordsFromTopic: (topic: string) => string[];
  detectToneFromTopic: (topic: string) => string;
}

export const useTopicAnalysis = ({
  topic,
  setKeywords,
  setTone,
  setTargetAudience,
  setContentType,
  setIndustryFocus,
  keywords,
  tone,
  extractKeywordsFromTopic,
  detectToneFromTopic
}: TopicAnalysisProps) => {
  const { language } = useLanguage();

  useEffect(() => {
    if (topic && topic.length > 10) {
      const timeout = setTimeout(async () => {
        try {
          const analysisPrompt = language === 'th' 
            ? `วิเคราะห์หัวข้อนี้สำหรับการสร้างเนื้อหา: "${topic}" ให้ข้อมูลในรูปแบบ JSON:
{
  "keywords": ["คำสำคัญ1", "คำสำคัญ2", "คำสำคัญ3", "คำสำคัญ4", "คำสำคัญ5"],
  "tone": "เป็นทางการ/สบายๆ/มีอำนาจ/เสมือนการสนทนา",
  "audience": "กลุ่มเป้าหมายที่เฉพาะเจาะจง",
  "contentType": "ประเภทเนื้อหาที่แนะนำ",
  "industry": "การจำแนกอุตสาหกรรม"
}`
            : `Analyze this topic for content creation: "${topic}". Provide:
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tone": "professional/casual/authoritative/conversational",
  "audience": "specific target audience",
  "contentType": "recommended content type",
  "industry": "industry classification"
}`;

          const aiAnalysis = await LanguageAwareContentGenerator.generateContent({
            topic: analysisPrompt,
            keywords: '',
            tone: 'professional',
            wordCount: 'short',
            contentType: 'analysis',
            writingStyle: 'analytical',
            targetAudience: 'content creators',
            industryFocus: 'content marketing',
            language
          });

          try {
            const parsedAnalysis = JSON.parse(aiAnalysis);

            if (!keywords && parsedAnalysis.keywords) {
              setKeywords(Array.isArray(parsedAnalysis.keywords) ? 
                parsedAnalysis.keywords.join(', ') : parsedAnalysis.keywords);
            }
            
            if (!tone && parsedAnalysis.tone) {
              setTone(parsedAnalysis.tone);
            }
            
            if (parsedAnalysis.audience) {
              setTargetAudience(parsedAnalysis.audience);
            }
            
            if (parsedAnalysis.contentType) {
              setContentType(parsedAnalysis.contentType);
            }

            if (parsedAnalysis.industry) {
              setIndustryFocus(parsedAnalysis.industry);
            }
          } catch (parseError) {
            console.log('JSON parsing failed, using fallback methods');
            if (!keywords) {
              const autoKeywords = extractKeywordsFromTopic(topic);
              setKeywords(autoKeywords.join(', '));
            }
            
            if (!tone) {
              const detectedTone = detectToneFromTopic(topic);
              setTone(detectedTone);
            }
          }
        } catch (error) {
          console.log('AI analysis failed, using fallback methods');
          if (!keywords) {
            const autoKeywords = extractKeywordsFromTopic(topic);
            setKeywords(autoKeywords.join(', '));
          }
          
          if (!tone) {
            const detectedTone = detectToneFromTopic(topic);
            setTone(detectedTone);
          }
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [topic, language]);
};
