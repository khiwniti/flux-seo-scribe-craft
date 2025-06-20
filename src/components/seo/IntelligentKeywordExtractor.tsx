
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Brain, TrendingUp, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IntelligentKeywordExtractorProps {
  content?: string;
  onKeywordsExtracted?: (keywords: string[]) => void;
}

const IntelligentKeywordExtractor = ({ content = '', onKeywordsExtracted }: IntelligentKeywordExtractorProps) => {
  const [extractedKeywords, setExtractedKeywords] = useState<Array<{
    keyword: string;
    relevance: number;
    density: number;
    type: 'primary' | 'secondary' | 'long-tail';
  }>>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [seedKeyword, setSeedKeyword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (content && content.length > 100) {
      extractKeywords();
    }
  }, [content]);

  const extractKeywords = async () => {
    if (!content) return;
    
    setIsExtracting(true);
    
    // Simulate AI keyword extraction
    setTimeout(() => {
      const analysis = analyzeContent(content);
      setExtractedKeywords(analysis);
      setIsExtracting(false);
      
      if (onKeywordsExtracted) {
        onKeywordsExtracted(analysis.map(k => k.keyword));
      }
      
      toast({
        title: "Keywords Extracted!",
        description: `Found ${analysis.length} relevant keywords`
      });
    }, 2000);
  };

  const analyzeContent = (text: string) => {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'a', 'an', 'this', 'that', 'these', 'those'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));
    
    const totalWords = words.length;
    const frequency: { [key: string]: number } = {};
    
    // Single word frequency
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Two-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      frequency[phrase] = (frequency[phrase] || 0) + 1;
    }
    
    // Three-word phrases
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (phrase.length < 50) {
        frequency[phrase] = (frequency[phrase] || 0) + 1;
      }
    }
    
    return Object.entries(frequency)
      .filter(([word, count]) => count > 1)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([keyword, count]) => ({
        keyword,
        relevance: Math.min(100, (count / totalWords) * 1000),
        density: Number(((count / totalWords) * 100).toFixed(2)),
        type: keyword.includes(' ') 
          ? (keyword.split(' ').length > 2 ? 'long-tail' : 'secondary')
          : 'primary' as 'primary' | 'secondary' | 'long-tail'
      }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-700';
      case 'secondary': return 'bg-green-100 text-green-700';
      case 'long-tail': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const copyKeywords = () => {
    const keywordsList = extractedKeywords.map(k => k.keyword).join(', ');
    navigator.clipboard.writeText(keywordsList);
    toast({
      title: "Keywords Copied!",
      description: "All extracted keywords copied to clipboard"
    });
  };

  const generateRelatedKeywords = () => {
    if (!seedKeyword) return;
    
    setIsExtracting(true);
    
    // Simulate AI-powered related keyword generation
    setTimeout(() => {
      const related = [
        `${seedKeyword} guide`,
        `${seedKeyword} tips`,
        `${seedKeyword} tutorial`,
        `${seedKeyword} benefits`,
        `${seedKeyword} examples`,
        `${seedKeyword} strategy`,
        `${seedKeyword} best practices`,
        `${seedKeyword} tools`,
        `${seedKeyword} techniques`,
        `${seedKeyword} mistakes`
      ].map(keyword => ({
        keyword,
        relevance: Math.floor(Math.random() * 40 + 60),
        density: Math.floor(Math.random() * 3 + 1),
        type: 'secondary' as const
      }));
      
      setExtractedKeywords(prev => [...prev, ...related].slice(0, 20));
      setIsExtracting(false);
      
      toast({
        title: "Related Keywords Generated!",
        description: `Added ${related.length} related keywords`
      });
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Intelligent Keyword Extractor
          <Brain className="h-4 w-4 text-purple-500" />
        </CardTitle>
        <CardDescription>
          AI-powered keyword extraction and analysis from your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {content && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {isExtracting ? 'Extracting Keywords...' : 'Content Analyzed'}
              </span>
            </div>
            <p className="text-xs text-blue-600">
              Content length: {content.split(' ').length} words
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Enter seed keyword to generate related terms..."
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
          />
          <Button 
            onClick={generateRelatedKeywords} 
            disabled={!seedKeyword || isExtracting}
            variant="outline"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>

        {extractedKeywords.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Extracted Keywords</h3>
              <Button onClick={copyKeywords} size="sm" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>
            
            <div className="grid gap-3">
              {extractedKeywords.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-medium">{item.keyword}</span>
                    <Badge className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>Relevance:</span>
                      <div className="w-20">
                        <Progress value={item.relevance} className="h-2" />
                      </div>
                      <span>{Math.round(item.relevance)}%</span>
                    </div>
                    <div>
                      <span>Density: {item.density}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!content && !extractedKeywords.length && (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Paste your content to automatically extract keywords</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligentKeywordExtractor;
