
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Calendar, Clock, BarChart } from 'lucide-react';
import ContentGenerationForm from './content-generator/ContentGenerationForm';
import AutoGenerationSettings from './content-generator/AutoGenerationSettings';
import GenerationHistory from './content-generator/GenerationHistory';
import GeneratedContentDisplay from './content-generator/GeneratedContentDisplay';
import AnalyticsBasedGenerator from './content-generator/AnalyticsBasedGenerator';
import { useContentGeneration } from './content-generator/useContentGeneration';

const IntegratedContentGenerator = () => {
  const {
    // Form states
    topic,
    setTopic,
    keywords,
    setKeywords,
    tone,
    setTone,
    wordCount,
    setWordCount,
    generatedContent,
    generatedImages,
    isGenerating,
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
    generateContent,
    generateAutoContent,
    toggleAutoGeneration,
    copyToClipboard,
    downloadImage,
    // History related props from useContentGeneration
    isLoadingHistory,
    historyError
  } = useContentGeneration();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics Generation
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Manual Generation
          </TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Auto Generation
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Generation History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsBasedGenerator />
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <ContentGenerationForm
            topic={topic}
            setTopic={setTopic}
            keywords={keywords}
            setKeywords={setKeywords}
            tone={tone}
            setTone={setTone}
            wordCount={wordCount}
            setWordCount={setWordCount}
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
            onGenerate={generateContent}
          />

          {generatedContent && (
            <GeneratedContentDisplay
              generatedContent={generatedContent}
              generatedImages={generatedImages || []}
              contentQuality={contentQuality}
              seoScore={seoScore}
              readabilityScore={readabilityScore}
              smartKeywords={smartKeywords || []}
              contentInsights={contentInsights || {}}
              onCopyToClipboard={() => copyToClipboard(generatedContent)}
              onDownloadImage={downloadImage}
            />
          )}
        </TabsContent>

        <TabsContent value="auto" className="space-y-6">
          <AutoGenerationSettings
            autoGenEnabled={autoGenEnabled}
            setAutoGenEnabled={() => {}} // Handled by toggleAutoGeneration
            autoGenFrequency={autoGenFrequency}
            setAutoGenFrequency={setAutoGenFrequency}
            autoGenTime={autoGenTime}
            setAutoGenTime={setAutoGenTime}
            autoGenDay={autoGenDay}
            setAutoGenDay={setAutoGenDay}
            autoGenTopics={autoGenTopics}
            setAutoGenTopics={setAutoGenTopics}
            autoGenKeywords={autoGenKeywords}
            setAutoGenKeywords={setAutoGenKeywords}
            nextScheduledRun={nextScheduledRun}
            contentType={contentType}
            setContentType={setContentType}
            writingStyle={writingStyle}
            setWritingStyle={setWritingStyle}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            industryFocus={industryFocus}
            setIndustryFocus={setIndustryFocus}
            trendingTopics={trendingTopics}
            contentSuggestions={contentSuggestions}
            onToggleAutoGeneration={toggleAutoGeneration}
            onGenerateAutoContent={generateAutoContent}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <GenerationHistory
            autoGenHistory={autoGenHistory}
            isLoading={isLoadingHistory}
            error={historyError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegratedContentGenerator;
