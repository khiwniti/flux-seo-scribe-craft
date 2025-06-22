
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Lightbulb, Brain } from 'lucide-react';
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

interface BlogSuggestionsProps {
  suggestions: BlogSuggestion[];
  isAnalyzing: boolean;
  onGenerateContent: (suggestion: BlogSuggestion) => void;
}

const BlogSuggestions = ({ suggestions, isAnalyzing, onGenerateContent }: BlogSuggestionsProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    loadingSuggestions: t("Generating AI-powered blog suggestions...", "กำลังสร้างคำแนะนำบล็อกโพสต์ด้วย AI..."),
    prioritySuffix: t("priority", "ความสำคัญ"),
    priorityHigh: t("high", "สูง"),
    priorityMedium: t("medium", "ปานกลาง"),
    priorityLow: t("low", "ต่ำ"),
    estTrafficLabel: t("Est. Traffic/Month", "ประมาณทราฟฟิก/เดือน"),
    difficultyScoreLabel: t("Difficulty Score", "คะแนนความยาก"),
    targetWordsLabel: t("Target Words", "จำนวนคำเป้าหมาย"),
    contentTypeLabel: t("Content Type", "ประเภทเนื้อหา"),
    moreKeywordsSuffix: t("more", "เพิ่มเติม"),
    generateContentButton: t("Generate Content", "สร้างเนื้อหา"),
  };

  const getPriorityText = (priority: 'high' | 'medium' | 'low') => {
    let translatedPriority = '';
    if (priority === 'high') translatedPriority = T.priorityHigh;
    else if (priority === 'medium') translatedPriority = T.priorityMedium;
    else translatedPriority = T.priorityLow;
    return `${translatedPriority} ${T.prioritySuffix}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 40) return 'text-green-600';
    if (difficulty < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-pulse" />
          <p className="text-gray-600">{T.loadingSuggestions}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {suggestions.map((suggestion, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
                <p className="text-gray-600 mb-3">{suggestion.angle}</p>
              </div>
              <Badge className={getPriorityColor(suggestion.priority)}>
                {getPriorityText(suggestion.priority)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-lg font-bold text-blue-600">{suggestion.potentialTraffic.toLocaleString()}</div>
                <div className="text-xs text-gray-600">{T.estTrafficLabel}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className={`text-lg font-bold ${getDifficultyColor(suggestion.estimatedDifficulty)}`}>
                  {suggestion.estimatedDifficulty}
                </div>
                <div className="text-xs text-gray-600">{T.difficultyScoreLabel}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-lg font-bold text-green-600">{suggestion.wordCount}</div>
                <div className="text-xs text-gray-600">{T.targetWordsLabel}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium text-purple-600">{suggestion.contentType}</div>
                <div className="text-xs text-gray-600">{T.contentTypeLabel}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {suggestion.keywords.slice(0, 3).map((keyword, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
                {suggestion.keywords.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{suggestion.keywords.length - 3} {T.moreKeywordsSuffix}
                  </Badge>
                )}
              </div>
              <Button 
                onClick={() => onGenerateContent(suggestion)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {T.generateContentButton}
              </Button>
            </div>
            
            <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
              <Lightbulb className="h-4 w-4 inline mr-1" />
              {suggestion.reasoning}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogSuggestions;
