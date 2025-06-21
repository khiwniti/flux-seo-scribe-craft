
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Sparkles, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { TfIdf, PorterStemmer, SentimentAnalyzer, WordTokenizer, NGrams } from 'natural';

interface EnhancementSuggestion {
  value: string | string[];
  explanation: string;
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

    setTimeout(() => {
      const enhancements = {
        suggestedTitle: extractTitle(content),
        suggestedKeywords: extractKeywords(content),
        suggestedTone: detectTone(content),
        suggestedAudience: detectAudience(content),
        suggestedIndustry: detectIndustry(content),
        suggestedTemplate: detectTemplate(content)
      };

      setSuggestions(enhancements);
      setIsAnalyzing(false);

      toast({
        title: "Smart Analysis Complete!",
        description: "AI has analyzed your content and generated suggestions"
      });
    }, 100);
  };

  const extractTitle = (text: string): EnhancementSuggestion => {
    const tfidf = new TfIdf();
    tfidf.addDocument(text);

    const sentences = text.split('. ');
    if (sentences.length === 0) {
      return { value: '', explanation: 'No sentences found to extract a title.' };
    }

    let bestSentence = '';
    let highestScore = -1;

    sentences.forEach(sentence => {
      if (sentence.trim().length === 0) return;
      let score = 0;
      const terms = new WordTokenizer().tokenize(sentence.toLowerCase());
      if (!terms) return;
      terms.forEach(term => {
        score += tfidf.tfidf(term, 0);
      });
      if (score > highestScore) {
        highestScore = score;
        bestSentence = sentence.trim();
      }
    });

    if (bestSentence) {
      return { value: bestSentence, explanation: 'This title was identified as the most relevant sentence based on TF-IDF analysis.' };
    }
    const firstLine = text.split('\n')[0];
    if (firstLine.length > 10 && firstLine.length < 80) {
      return { value: firstLine.replace(/[^\w\s]/gi, ''), explanation: 'Used the first line as a fallback title.'};
    }
    const words = text.split(' ').slice(0, 8).join(' ');
    return { value: words.charAt(0).toUpperCase() + words.slice(1), explanation: 'Used the first few words as a fallback title.' };
  };

  const extractKeywords = (text: string): EnhancementSuggestion => {
    const tfidf = new TfIdf();
    tfidf.addDocument(text.toLowerCase());
    const keywords: string[] = [];
    const explanationLines: string[] = [];

    tfidf.listTerms(0).slice(0, 5).forEach(term => {
      keywords.push(term.term);
      explanationLines.push(`"${term.term}" (TF-IDF score: ${term.tfidf.toFixed(2)})`);
    });

    if (keywords.length > 0) {
      return { value: keywords, explanation: `Keywords identified based on TF-IDF scores: ${explanationLines.join(', ')}.` };
    }
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'a', 'an', 'this', 'that', 'these', 'those'];
    const words = text.toLowerCase().split(/\s+/)
      .map(word => word.replace(/[^\w]/g, '').toLowerCase())
      .filter(word => word.length > 3 && !commonWords.includes(word));
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    const fallbackKeywords = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
    return { value: fallbackKeywords, explanation: 'Used frequency analysis as a fallback for keyword extraction.'};
  };

  const detectTone = (text: string): EnhancementSuggestion => {
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const tokens = new WordTokenizer().tokenize(text.toLowerCase());
    if (!tokens) {
      return { value: 'conversational', explanation: 'Could not tokenize text to determine tone. Defaulted to conversational.' };
    }
    const sentimentScore = analyzer.getSentiment(tokens);

    let tone = 'conversational';
    let explanation = `Sentiment score: ${sentimentScore.toFixed(2)}. `;

    if (sentimentScore > 0.33) {
      tone = 'Positive';
      explanation += 'The text has a predominantly positive sentiment.';
    } else if (sentimentScore < -0.33) {
      tone = 'Negative';
      explanation += 'The text has a predominantly negative sentiment.';
    } else {
      tone = 'Neutral';
      explanation += 'The text has a relatively neutral sentiment.';
    }
    if (text.toLowerCase().includes('expert') || text.toLowerCase().includes('professional') || text.toLowerCase().includes('research')) {
      tone = 'authoritative';
      explanation = 'The text contains words like "expert", "professional", or "research", suggesting an authoritative tone. Sentiment analysis might be overridden.';
    } else if (text.toLowerCase().includes('easy') || text.toLowerCase().includes('simple') || text.toLowerCase().includes('beginner')) {
      tone = 'casual';
      explanation = 'The text contains words like "easy", "simple", or "beginner", suggesting a casual tone. Sentiment analysis might be overridden.';
    } else if (text.toLowerCase().includes('business') || text.toLowerCase().includes('corporate') || text.toLowerCase().includes('enterprise')) {
      tone = 'professional';
      explanation = 'The text contains words like "business", "corporate", or "enterprise", suggesting a professional tone. Sentiment analysis might be overridden.';
    }
    return { value: tone, explanation };
  };

  const detectAudience = (text: string): EnhancementSuggestion => {
    const lowerText = text.toLowerCase();
    const tokens = new WordTokenizer().tokenize(lowerText);
    if (!tokens) {
      return { value: 'general', explanation: 'Could not tokenize text to determine audience.' };
    }

    const audienceKeywords: { [key: string]: string[] } = {
      beginners: ['beginner', 'start', 'learn', 'introduction', 'easy', 'simple'],
      professionals: ['expert', 'advanced', 'professional', 'deep dive', 'technical'],
      executives: ['business', 'company', 'enterprise', 'strategy', 'leadership', 'ceo'],
    };

    let detectedAudience = 'general';
    let maxCount = 0;
    let evidence: string[] = [];

    for (const audience in audienceKeywords) {
      let currentCount = 0;
      const currentEvidence: string[] = [];
      audienceKeywords[audience].forEach(keyword => {
        if (lowerText.includes(keyword)) {
          currentCount++;
          currentEvidence.push(keyword);
        }
      });
      if (currentCount > maxCount) {
        maxCount = currentCount;
        detectedAudience = audience;
        evidence = currentEvidence;
      }
    }

    if (detectedAudience !== 'general') {
      return { value: detectedAudience, explanation: `Suggested audience is "${detectedAudience}" due to keywords like: ${evidence.join(', ')}.` };
    }
    return { value: 'general', explanation: 'The text appears to be for a general audience. No specific audience keywords were prominently found.' };
  };

  const detectIndustry = (text: string): EnhancementSuggestion => {
    const lowerText = text.toLowerCase();
    const tokens = new WordTokenizer().tokenize(lowerText);
    if (!tokens) {
      return { value: 'general', explanation: 'Could not tokenize text to determine industry.' };
    }

    const industryKeywords: { [key: string]: string[] } = {
      technology: ['technology', 'software', 'digital', 'ai', 'cloud', 'data', 'app'],
      marketing: ['marketing', 'brand', 'campaign', 'seo', 'social media', 'advertising'],
      healthcare: ['health', 'medical', 'wellness', 'hospital', 'pharma', 'patient'],
      education: ['education', 'learning', 'student', 'teacher', 'university', 'course'],
      finance: ['finance', 'investment', 'stocks', 'crypto', 'banking', 'fintech'],
    };

    let detectedIndustry = 'general';
    let maxCount = 0;
    let evidence: string[] = [];

    for (const industry in industryKeywords) {
      let currentCount = 0;
      const currentEvidence: string[] = [];
      industryKeywords[industry].forEach(keyword => {
        if (lowerText.includes(keyword)) {
          currentCount++;
          currentEvidence.push(keyword);
        }
      });
      if (currentCount > maxCount) {
        maxCount = currentCount;
        detectedIndustry = industry;
        evidence = currentEvidence;
      }
    }
    if (detectedIndustry !== 'general') {
      return { value: detectedIndustry, explanation: `Suggested industry is "${detectedIndustry}" due to keywords like: ${evidence.join(', ')}.` };
    }
    return { value: 'general', explanation: 'The text does not strongly indicate a specific industry. No specific industry keywords were prominently found.' };
  };

  const detectTemplate = (text: string): EnhancementSuggestion => {
    const lowerText = text.toLowerCase();
    const tokens = new WordTokenizer().tokenize(lowerText);
    if (!tokens) {
      return { value: 'standard', explanation: 'Could not tokenize text to determine template.' };
    }

    // N-gram analysis for common phrases
    const bigrams = NGrams.bigrams(tokens);
    const trigrams = NGrams.trigrams(tokens);

    if (lowerText.includes('how to') || bigrams.some(bi => bi[0] === 'step' && bi[1] === 'by') || lowerText.includes('guide')) {
      return { value: 'how-to', explanation: 'Contains phrases like "how to", "step by", or "guide", suggesting a How-to template.' };
    }
    if (lowerText.includes('vs') || lowerText.includes('versus') || lowerText.includes('compare') || lowerText.includes('comparison')) {
      return { value: 'comparison', explanation: 'Contains terms like "vs", "versus", or "compare", suggesting a Comparison template.' };
    }
    if (text.match(/\d+\s+(tips|ways|reasons|benefits|steps|strategies)/i)) {
      const match = text.match(/\d+\s+(tips|ways|reasons|benefits|steps|strategies)/i);
      return { value: 'listicle', explanation: `The content structure uses numbered lists (e.g., "${match ? match[0] : 'X items'}"), suggesting a Listicle.` };
    }
    // Check for question-like structure for FAQ or Q&A
    if (tokens.includes('?') && (lowerText.includes('faq') || lowerText.includes('frequently asked questions') || lowerText.includes('q&a'))) {
        return { value: 'faq', explanation: 'The text contains question marks and terms like "FAQ" or "Q&A", suggesting a FAQ/Q&A template.'};
    }
    // News-like characteristics
    const newsKeywords = ['breaking news', 'reports', 'according to', 'sources say', 'investigation'];
    if (newsKeywords.some(kw => lowerText.includes(kw))) {
        return { value: 'news-article', explanation: 'Contains keywords common in news reporting.'};
    }

    return { value: 'standard', explanation: 'The content does not strongly match a specific template type (e.g., How-to, Listicle, Comparison, FAQ), defaulting to Standard.' };
  };

  const applySuggestion = (field: string, suggestion?: EnhancementSuggestion) => {
    if (!suggestion) return;
    // Ensure we pass the correct type to onEnhance
    if (field === 'suggestedKeywords' && Array.isArray(suggestion.value)) {
       onEnhance({ [field]: suggestion.value.join(', ') });
    } else if (typeof suggestion.value === 'string') {
       onEnhance({ [field]: suggestion.value });
    }

    toast({
      title: "Suggestion Applied!",
      description: `${field.replace('suggested', '')} has been auto-filled with AI suggestion. Explanation: ${suggestion?.explanation}`
    });
  };

  if (!suggestions && !isAnalyzing) return null;

  // Helper to render suggestion items
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

    return (
      <div className="flex items-center justify-between bg-white p-2 rounded border group relative">
        <div className="flex-1 min-w-0">
          <span className="text-xs text-gray-500">{label}:</span>
          {displayValue}
           {suggestion.explanation && (
            <p className="text-xs text-gray-400 mt-1 italic opacity-0 group-hover:opacity-100 transition-opacity">
              {suggestion.explanation}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => applySuggestion(field as string, suggestion)}
          className="ml-2"
        >
          <Wand2 className="h-3 w-3" />
        </Button>
      </div>
    );
  };

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
          <div className="h-2 bg-purple-200 rounded w-3/4 mb-1"></div>
          <div className="h-2 bg-purple-200 rounded w-1/2"></div>
        </div>
      )}

      {suggestions && !isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
