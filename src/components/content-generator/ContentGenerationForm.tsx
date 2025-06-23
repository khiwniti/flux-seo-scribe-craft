
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Wand2, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BasicFormFields from './BasicFormFields';
import EnhancedAISettings from './EnhancedAISettings';
import AIFeaturesBadges from './AIFeaturesBadges';
import ErrorDisplay from './ErrorDisplay';

interface ContentGenerationFormProps {
  topic: string;
  setTopic: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  wordCount: string;
  setWordCount: (value: string) => void;
  contentType: string;
  setContentType: (value: string) => void;
  writingStyle: string;
  setWritingStyle: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  industryFocus: string;
  setIndustryFocus: (value: string) => void;
  contentTemplate: string;
  setContentTemplate: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
  error?: string | null;
}

const ContentGenerationForm = ({
  topic,
  setTopic,
  keywords,
  setKeywords,
  tone,
  setTone,
  wordCount,
  setWordCount,
  contentType,
  setContentType,
  writingStyle,
  setWritingStyle,
  targetAudience,
  setTargetAudience,
  industryFocus,
  setIndustryFocus,
  contentTemplate,
  setContentTemplate,
  isGenerating,
  onGenerate,
  error,
}: ContentGenerationFormProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    await onGenerate();
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          {t("Intelligent Content Generator", "เครื่องมือสร้างเนื้อหาอัจฉริยะ")}
        </CardTitle>
        <CardDescription>
          {t("AI-powered content generation with smart field enhancement and auto-completion", "การสร้างเนื้อหาด้วย AI พร้อมการเพิ่มประสิทธิภาพช่องข้อมูลอัจฉริยะและการเติมข้อความอัตโนมัติ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <ErrorDisplay error={error} />}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicFormFields
            topic={topic}
            setTopic={setTopic}
            keywords={keywords}
            setKeywords={setKeywords}
            tone={tone}
            setTone={setTone}
            wordCount={wordCount}
            setWordCount={setWordCount}
          />

          <Separator />

          <EnhancedAISettings
            contentType={contentType}
            setContentType={setContentType}
            writingStyle={writingStyle}
            setWritingStyle={setWritingStyle}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            industryFocus={industryFocus}
            setIndustryFocus={setIndustryFocus}
            contentTemplate={contentTemplate}
            setContentTemplate={setContentTemplate}
          />

          <Separator />

          <AIFeaturesBadges />

          <Button
            type="submit"
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-pulse" />
                {t("Generating AI-Enhanced Content...", "กำลังสร้างเนื้อหา AI ขั้นสูง...")}
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                {t("Generate Smart AI Content", "สร้างเนื้อหา AI อัจฉริยะ")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentGenerationForm;
