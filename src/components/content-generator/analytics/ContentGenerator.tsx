
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

interface BlogSuggestion {
  title: string;
  angle: string;
  keywords: string[];
  estimatedDifficulty: number;
  potentialTraffic: number;
  contentType: string;
  wordCount: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

interface ContentGeneratorProps {
  isGenerating: boolean;
  generatedContent: string;
  selectedSuggestion: BlogSuggestion | null;
  onReset: () => void;
}

const ContentGenerator = ({ isGenerating, generatedContent, selectedSuggestion, onReset }: ContentGeneratorProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    loadingMessage: t("Generating SEO-optimized content...", "กำลังสร้างเนื้อหาที่ปรับให้เหมาะกับ SEO..."),
    loadingSubMessage: t("This may take a few moments", "อาจใช้เวลาสักครู่"),
    cardTitle: t("Generated Blog Content", "เนื้อหาบล็อกที่สร้างขึ้น"),
    cardDescription: t("AI-generated content based on analytics: {title}", "เนื้อหาที่สร้างโดย AI จากข้อมูลวิเคราะห์: {title}"),
    copyButton: t("Copy Content", "คัดลอกเนื้อหา"),
    downloadButton: t("Download", "ดาวน์โหลด"),
    generateNewButton: t("Generate New Content", "สร้างเนื้อหาใหม่"),
    placeholderTitle: t("Select a blog suggestion to generate optimized content", "เลือกคำแนะนำบล็อกเพื่อสร้างเนื้อหาที่ปรับให้เหมาะสม"),
    placeholderSubtitle: t("Content will be tailored based on your SEO analytics", "เนื้อหาจะถูกปรับแต่งตามข้อมูลการวิเคราะห์ SEO ของคุณ"),
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-green-600 animate-pulse" />
          <p className="text-gray-600">{T.loadingMessage}</p>
          <p className="text-sm text-gray-500 mt-2">{T.loadingSubMessage}</p>
        </div>
      </div>
    );
  }

  if (generatedContent && selectedSuggestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            {T.cardTitle}
          </CardTitle>
          <CardDescription>
            {T.cardDescription.replace("{title}", selectedSuggestion.title)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {generatedContent}
            </pre>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigator.clipboard.writeText(generatedContent)}
              variant="outline"
            >
              {T.copyButton}
            </Button>
            <Button 
              onClick={() => {
                const blob = new Blob([generatedContent], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedSuggestion.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              variant="outline"
            >
              {T.downloadButton}
            </Button>
            <Button 
              onClick={onReset}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {T.generateNewButton}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-center py-12 text-gray-500">
      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>{T.placeholderTitle}</p>
      <p className="text-sm mt-2">{T.placeholderSubtitle}</p>
    </div>
  );
};

export default ContentGenerator;
