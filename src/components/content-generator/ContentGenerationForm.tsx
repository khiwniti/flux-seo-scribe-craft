
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Wand2, Brain } from 'lucide-react';
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
          Intelligent Content Generator
        </CardTitle>
        <CardDescription>
          AI-powered content generation with smart field enhancement and auto-completion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            isGenerating={isGenerating}
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
            isGenerating={isGenerating}
          />

          <AIFeaturesBadges />

          <ErrorDisplay error={error} />

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating AI-Enhanced Content...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Generate Smart AI Content
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentGenerationForm;
