
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Sparkles, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartFieldEnhancerProps {
  content: string;
  onEnhance: (enhancements: {
    suggestedTitle?: string;
    suggestedKeywords?: string[];
    suggestedTone?: string;
    suggestedAudience?: string;
    suggestedIndustry?: string;
    suggestedTemplate?: string;
  }) => void;
}

export const SmartFieldEnhancer = ({ content, onEnhance }: SmartFieldEnhancerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (content && content.length > 50) {
      analyzeContent();
    }
  }, [content]);

  const analyzeContent = async () => {
    if (content.length < 20) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis based on content
    setTimeout(() => {
      const words = content.toLowerCase();
      const enhancements = {
        suggestedTitle: extractTitle(content),
        suggestedKeywords: extractKeywords(words),
        suggestedTone: detectTone(words),
        suggestedAudience: detectAudience(words),
        suggestedIndustry: detectIndustry(words),
        suggestedTemplate: detectTemplate(words)
      };
      
      setSuggestions(enhancements);
      setIsAnalyzing(false);
      
      toast({
        title: "Smart Analysis Complete!",
        description: "AI has analyzed your content and generated suggestions"
      });
    }, 1500);
  };

  const extractTitle = (text: string): string => {
    const firstLine = text.split('\n')[0];
    if (firstLine.length > 10 && firstLine.length < 80) {
      return firstLine.replace(/[^\w\s]/gi, '');
    }
    
    const words = text.split(' ').slice(0, 8).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  };

  const extractKeywords = (text: string): string[] => {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'a', 'an', 'this', 'that', 'these', 'those'];
    
    const words = text.split(/\s+/)
      .map(word => word.replace(/[^\w]/g, '').toLowerCase())
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  const detectTone = (text: string): string => {
    if (text.includes('expert') || text.includes('professional') || text.includes('research')) {
      return 'authoritative';
    }
    if (text.includes('easy') || text.includes('simple') || text.includes('beginner')) {
      return 'casual';
    }
    if (text.includes('business') || text.includes('corporate') || text.includes('enterprise')) {
      return 'professional';
    }
    return 'conversational';
  };

  const detectAudience = (text: string): string => {
    if (text.includes('beginner') || text.includes('start') || text.includes('learn')) {
      return 'beginners';
    }
    if (text.includes('expert') || text.includes('advanced') || text.includes('professional')) {
      return 'professionals';
    }
    if (text.includes('business') || text.includes('company') || text.includes('enterprise')) {
      return 'executives';
    }
    return 'general';
  };

  const detectIndustry = (text: string): string => {
    if (text.includes('technology') || text.includes('software') || text.includes('digital')) {
      return 'technology';
    }
    if (text.includes('marketing') || text.includes('brand') || text.includes('campaign')) {
      return 'marketing';
    }
    if (text.includes('health') || text.includes('medical') || text.includes('wellness')) {
      return 'healthcare';
    }
    if (text.includes('education') || text.includes('learning') || text.includes('student')) {
      return 'education';
    }
    return 'general';
  };

  const detectTemplate = (text: string): string => {
    if (text.includes('how to') || text.includes('step') || text.includes('guide')) {
      return 'how-to';
    }
    if (text.includes('vs') || text.includes('versus') || text.includes('compare')) {
      return 'comparison';
    }
    if (text.match(/\d+\s+(tips|ways|reasons|benefits)/)) {
      return 'listicle';
    }
    return 'standard';
  };

  const applySuggestion = (field: string, value: any) => {
    onEnhance({ [field]: value });
    toast({
      title: "Suggestion Applied!",
      description: `${field} has been auto-filled with AI suggestion`
    });
  };

  if (!suggestions && !isAnalyzing) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-700">
          {isAnalyzing ? 'Analyzing content...' : 'AI Suggestions Available'}
        </span>
        <Sparkles className="h-4 w-4 text-purple-500" />
      </div>

      {isAnalyzing && (
        <div className="animate-pulse">
          <div className="h-2 bg-purple-200 rounded w-full"></div>
        </div>
      )}

      {suggestions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.suggestedTitle && (
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500">Title:</span>
                <p className="text-sm font-medium truncate">{suggestions.suggestedTitle}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applySuggestion('suggestedTitle', suggestions.suggestedTitle)}
                className="ml-2"
              >
                <Wand2 className="h-3 w-3" />
              </Button>
            </div>
          )}

          {suggestions.suggestedKeywords && (
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500">Keywords:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {suggestions.suggestedKeywords.slice(0, 3).map((keyword: string) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applySuggestion('suggestedKeywords', suggestions.suggestedKeywords.join(', '))}
                className="ml-2"
              >
                <Wand2 className="h-3 w-3" />
              </Button>
            </div>
          )}

          {suggestions.suggestedTone && (
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex-1">
                <span className="text-xs text-gray-500">Tone:</span>
                <p className="text-sm font-medium capitalize">{suggestions.suggestedTone}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applySuggestion('suggestedTone', suggestions.suggestedTone)}
                className="ml-2"
              >
                <Wand2 className="h-3 w-3" />
              </Button>
            </div>
          )}

          {suggestions.suggestedAudience && (
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex-1">
                <span className="text-xs text-gray-500">Audience:</span>
                <p className="text-sm font-medium capitalize">{suggestions.suggestedAudience}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applySuggestion('suggestedAudience', suggestions.suggestedAudience)}
                className="ml-2"
              >
                <Wand2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
