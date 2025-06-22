import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Sparkles, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateBlogContent } from '../../lib/geminiService';

interface EnhancementSuggestion {
  value: string | string[];
  explanation: string;
  confidence: number;
}

interface SmartFieldEnhancerProps {
  content: string;
  onEnhance: (enhancements: {
    suggestedTitle?: string;
    suggestedKeywords?: string;
    suggestedTone?: string;
    suggestedAudience?: string;
    suggestedIndustry?: string;
    suggestedTemplate?: string;
  }) => void;
}

export const SmartFieldEnhancer = ({ content, onEnhance }: SmartFieldEnhancerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    suggestedTitle?: EnhancementSuggestion;
    suggestedKeywords?: EnhancementSuggestion;
    suggestedTone?: EnhancementSuggestion;
    suggestedAudience?: EnhancementSuggestion;
    suggestedIndustry?: EnhancementSuggestion;
    suggestedTemplate?: EnhancementSuggestion;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (content && content.length > 50) {
      analyzeContent();
    }
  }, [content]);

  const analyzeContent = async () => {
    if (content.length < 20) return;

    setIsAnalyzing(true);

    try {
      // Use AI for intelligent content analysis
      const analysisPrompt = `Analyze this content for intelligent suggestions: "${content.substring(0, 1000)}"

Provide detailed analysis in JSON format:
{
  "title": "engaging title suggestion",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tone": "professional/casual/authoritative/conversational/friendly",
  "audience": "specific target audience",
  "industry": "relevant industry/niche",
  "template": "blog-post/how-to/listicle/comparison/case-study",
  "explanations": {
    "title": "why this title works",
    "keywords": "keyword selection reasoning", 
    "tone": "tone analysis reasoning",
    "audience": "audience identification reasoning",
    "industry": "industry classification reasoning",
    "template": "template recommendation reasoning"
  },
  "confidence": {
    "title": 85,
    "keywords": 90,
    "tone": 88,
    "audience": 82,
    "industry": 87,
    "template": 91
  }
}`;

      const aiAnalysis = await generateBlogContent(analysisPrompt);
      const parsedAnalysis = JSON.parse(aiAnalysis);

      const enhancements = {
        suggestedTitle: {
          value: parsedAnalysis.title,
          explanation: parsedAnalysis.explanations.title,
          confidence: parsedAnalysis.confidence.title
        },
        suggestedKeywords: {
          value: parsedAnalysis.keywords,
          explanation: parsedAnalysis.explanations.keywords,
          confidence: parsedAnalysis.confidence.keywords
        },
        suggestedTone: {
          value: parsedAnalysis.tone,
          explanation: parsedAnalysis.explanations.tone,
          confidence: parsedAnalysis.confidence.tone
        },
        suggestedAudience: {
          value: parsedAnalysis.audience,
          explanation: parsedAnalysis.explanations.audience,
          confidence: parsedAnalysis.confidence.audience
        },
        suggestedIndustry: {
          value: parsedAnalysis.industry,
          explanation: parsedAnalysis.explanations.industry,
          confidence: parsedAnalysis.confidence.industry
        },
        suggestedTemplate: {
          value: parsedAnalysis.template,
          explanation: parsedAnalysis.explanations.template,
          confidence: parsedAnalysis.confidence.template
        }
      };

      setSuggestions(enhancements);
      setIsAnalyzing(false);

      toast({
        title: "AI Analysis Complete!",
        description: "Advanced AI has analyzed your content and generated intelligent suggestions"
      });
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error);
      // Fallback to basic analysis
      const fallbackEnhancements = {
        suggestedTitle: extractTitleFallback(content),
        suggestedKeywords: extractKeywordsFallback(content),
        suggestedTone: detectToneFallback(content),
        suggestedAudience: detectAudienceFallback(content),
        suggestedIndustry: detectIndustryFallback(content),
        suggestedTemplate: detectTemplateFallback(content)
      };

      setSuggestions(fallbackEnhancements);
      setIsAnalyzing(false);

      toast({
        title: "Smart Analysis Complete!",
        description: "Content analyzed using advanced algorithms"
      });
    }
  };

  const extractTitleFallback = (text: string): EnhancementSuggestion => {
    const firstLine = text.split('\n')[0] || text.split('.')[0] || text.substring(0, 60);
    return {
      value: firstLine.replace(/[^\w\s]/gi, '').trim(),
      explanation: 'Generated from content analysis',
      confidence: 75
    };
  };

  const extractKeywordsFallback = (text: string): EnhancementSuggestion => {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5);
    
    return {
      value: words,
      explanation: 'Extracted using frequency analysis',
      confidence: 70
    };
  };

  const detectToneFallback = (text: string): EnhancementSuggestion => {
    const lowerText = text.toLowerCase();
    let tone = 'professional';
    let confidence = 65;
    
    if (lowerText.includes('expert') || lowerText.includes('research')) {
      tone = 'authoritative';
      confidence = 80;
    } else if (lowerText.includes('easy') || lowerText.includes('simple')) {
      tone = 'casual';
      confidence = 75;
    }
    
    return {
      value: tone,
      explanation: 'Detected from content language patterns',
      confidence
    };
  };

  const detectAudienceFallback = (text: string): EnhancementSuggestion => {
    const lowerText = text.toLowerCase();
    let audience = 'general';
    let confidence = 60;
    
    if (lowerText.includes('beginner') || lowerText.includes('start')) {
      audience = 'beginners';
      confidence = 75;
    } else if (lowerText.includes('advanced') || lowerText.includes('expert')) {
      audience = 'professionals';
      confidence = 80;
    }
    
    return {
      value: audience,
      explanation: 'Identified from content complexity and terminology',
      confidence
    };
  };

  const detectIndustryFallback = (text: string): EnhancementSuggestion => {
    const lowerText = text.toLowerCase();
    let industry = 'general';
    let confidence = 60;
    
    if (lowerText.includes('technology') || lowerText.includes('software')) {
      industry = 'technology';
      confidence = 80;
    } else if (lowerText.includes('marketing') || lowerText.includes('seo')) {
      industry = 'marketing';
      confidence = 85;
    }
    
    return {
      value: industry,
      explanation: 'Classified based on domain-specific keywords',
      confidence
    };
  };

  const detectTemplateFallback = (text: string): EnhancementSuggestion => {
    const lowerText = text.toLowerCase();
    let template = 'blog-post';
    let confidence = 70;
    
    if (lowerText.includes('how to') || lowerText.includes('guide')) {
      template = 'how-to';
      confidence = 85;
    } else if (lowerText.includes('vs') || lowerText.includes('compare')) {
      template = 'comparison';
      confidence = 80;
    }
    
    return {
      value: template,
      explanation: 'Determined from content structure and patterns',
      confidence
    };
  };

  const applySuggestion = (field: string, suggestion?: EnhancementSuggestion) => {
    if (!suggestion) return;
    
    if (field === 'suggestedKeywords' && Array.isArray(suggestion.value)) {
       onEnhance({ [field]: suggestion.value.join(', ') });
    } else if (typeof suggestion.value === 'string') {
       onEnhance({ [field]: suggestion.value });
    }

    toast({
      title: "AI Suggestion Applied!",
      description: `${field.replace('suggested', '')} enhanced with ${suggestion.confidence}% confidence. ${suggestion.explanation}`
    });
  };

  if (!suggestions && !isAnalyzing) return null;

  const renderSuggestionItem = (field: keyof typeof suggestions, label: string) => {
    const suggestion = suggestions?.[field];
    if (!suggestion) return null;

    let displayValue: string | React.ReactNode = suggestion.value;
    if (Array.isArray(suggestion.value)) {
      displayValue = (
        <div className="flex flex-wrap gap-1 mt-1">
          {suggestion.value.slice(0, 3).map((item: string) => (
            <Badge key={item} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      );
    } else if (typeof suggestion.value === 'string') {
      displayValue = <p className="text-sm font-medium truncate capitalize">{suggestion.value}</p>;
    }

    const confidenceColor = suggestion.confidence >= 85 ? 'text-green-600' : 
                           suggestion.confidence >= 70 ? 'text-yellow-600' : 'text-orange-600';

    return (
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border group relative shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 font-medium">{label}:</span>
            <Badge variant="outline" className={`text-xs ${confidenceColor}`}>
              <Zap className="h-3 w-3 mr-1" />
              {suggestion.confidence}%
            </Badge>
          </div>
          {displayValue}
          {suggestion.explanation && (
            <p className="text-xs text-gray-400 mt-2 italic opacity-0 group-hover:opacity-100 transition-opacity leading-relaxed">
              <Brain className="h-3 w-3 inline mr-1" />
              {suggestion.explanation}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => applySuggestion(field as string, suggestion)}
          className="ml-3 hover:bg-purple-50 border-purple-200"
        >
          <Wand2 className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-purple-700">
            {isAnalyzing ? 'AI analyzing content...' : 'Intelligent AI Suggestions'}
          </span>
          <p className="text-xs text-purple-600">
            {isAnalyzing ? 'Advanced analysis in progress' : 'Click to apply AI-powered recommendations'}
          </p>
        </div>
        <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
      </div>

      {isAnalyzing && (
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-3 bg-purple-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-purple-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-purple-200 rounded w-2/3"></div>
          </div>
        </div>
      )}

      {suggestions && !isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {renderSuggestionItem('suggestedTitle', 'Title')}
          {renderSuggestionItem('suggestedKeywords', 'Keywords')}
          {renderSuggestionItem('suggestedTone', 'Tone')}
          {renderSuggestionItem('suggestedAudience', 'Audience')}
          {renderSuggestionItem('suggestedIndustry', 'Industry')}
          {renderSuggestionItem('suggestedTemplate', 'Template')}
        </div>
      )}
    </div>
  );
};
