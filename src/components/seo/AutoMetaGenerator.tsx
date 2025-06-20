
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2, Copy, Check, Globe, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutoMetaGeneratorProps {
  content?: string;
  url?: string;
}

const AutoMetaGenerator = ({ content = '', url = '' }: AutoMetaGeneratorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (content && content.length > 100) {
      autoGenerateMetaTags();
    }
  }, [content]);

  const autoGenerateMetaTags = async () => {
    if (!content) return;
    
    setIsGenerating(true);
    
    // Simulate AI meta tag generation
    setTimeout(() => {
      const words = content.split(' ');
      const firstSentence = content.split('.')[0];
      
      // Auto-generate title
      const autoTitle = firstSentence.length > 60 
        ? words.slice(0, 8).join(' ') + '...'
        : firstSentence;
      
      // Auto-generate description
      const sentences = content.split('.').slice(0, 2);
      const autoDescription = sentences.join('. ').substring(0, 155) + 
        (sentences.join('. ').length > 155 ? '...' : '');
      
      // Auto-generate keywords
      const autoKeywords = extractKeywords(content).slice(0, 5).join(', ');
      
      setTitle(autoTitle);
      setDescription(autoDescription);
      setKeywords(autoKeywords);
      setIsGenerating(false);
      
      toast({
        title: "Meta Tags Auto-Generated!",
        description: "AI has created optimized meta tags from your content"
      });
    }, 2000);
  };

  const extractKeywords = (text: string): string[] => {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);
  };

  const copyToClipboard = () => {
    const metaHtml = `<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">`;
    
    navigator.clipboard.writeText(metaHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Meta tags copied to clipboard"
    });
  };

  const getScoreColor = (length: number, min: number, max: number) => {
    if (length < min) return 'text-red-500';
    if (length > max) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Auto Meta Generator
          <Sparkles className="h-4 w-4 text-purple-500" />
        </CardTitle>
        <CardDescription>
          AI automatically generates optimized meta tags from your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {content && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Auto-Generated from Content
              </span>
            </div>
            <p className="text-xs text-blue-600">
              Content detected: {content.split(' ').length} words
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Page Title
              {isGenerating && <span className="ml-2 text-purple-500 text-xs">Generating...</span>}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Auto-generating title..."
              disabled={isGenerating}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={getScoreColor(title.length, 30, 60)}>
                {title.length} characters
              </span>
              <Badge variant={title.length > 60 ? 'destructive' : title.length > 30 ? 'default' : 'secondary'}>
                {title.length > 60 ? 'Too long' : title.length > 30 ? 'Good' : 'Can add more'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Meta Description
              {isGenerating && <span className="ml-2 text-purple-500 text-xs">Generating...</span>}
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Auto-generating description..."
              disabled={isGenerating}
              rows={3}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={getScoreColor(description.length, 120, 160)}>
                {description.length} characters
              </span>
              <Badge variant={description.length > 160 ? 'destructive' : description.length > 120 ? 'default' : 'secondary'}>
                {description.length > 160 ? 'Too long' : description.length > 120 ? 'Good' : 'Can add more'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Keywords
              {isGenerating && <span className="ml-2 text-purple-500 text-xs">Extracting...</span>}
            </label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Auto-extracting keywords..."
              disabled={isGenerating}
            />
          </div>
        </div>

        {!isGenerating && content && (
          <Button onClick={autoGenerateMetaTags} className="w-full" variant="outline">
            <Wand2 className="h-4 w-4 mr-2" />
            Regenerate Meta Tags
          </Button>
        )}

        {(title || description) && !isGenerating && (
          <Button onClick={copyToClipboard} className="w-full">
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy HTML Meta Tags'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoMetaGenerator;
