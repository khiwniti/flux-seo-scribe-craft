
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContentAnalyzer = () => {
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeContent = () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const wordCount = content.split(/\s+/).length;
      const readabilityScore = Math.floor(Math.random() * 40) + 60;
      const keywordDensity = keywords ? Math.floor(Math.random() * 3) + 1 : 0;
      const seoScore = Math.floor((readabilityScore + (keywordDensity * 10) + (title ? 10 : 0) + (metaDescription ? 10 : 0)) / 1.4);

      setAnalysis({
        wordCount,
        readabilityScore,
        keywordDensity,
        seoScore,
        suggestions: [
          'Add more internal links to improve navigation',
          'Include target keywords in subheadings',
          'Optimize image alt texts for better accessibility',
          'Add schema markup for better search visibility'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { variant: 'default', className: 'bg-green-100 text-green-700', text: 'Excellent' };
    if (score >= 60) return { variant: 'secondary', className: 'bg-yellow-100 text-yellow-700', text: 'Good' };
    return { variant: 'destructive', className: 'bg-red-100 text-red-700', text: 'Needs Work' };
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Content Input
          </CardTitle>
          <CardDescription>
            Enter your content and SEO parameters for analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              placeholder="Enter your page title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meta">Meta Description</Label>
            <Textarea
              id="meta"
              placeholder="Enter meta description..."
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              placeholder="SEO, optimization, content marketing..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your content here for analysis..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>

          <Button 
            onClick={analyzeContent} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Analysis Results
          </CardTitle>
          <CardDescription>
            SEO optimization insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysis ? (
            <div className="space-y-6">
              {/* Overall SEO Score */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.seoScore)}`}>
                  {analysis.seoScore}%
                </div>
                <div className="mt-2">
                  <Badge {...getScoreBadge(analysis.seoScore)}>
                    {getScoreBadge(analysis.seoScore).text}
                  </Badge>
                </div>
                <Progress value={analysis.seoScore} className="mt-3" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Word Count</div>
                  <div className="text-2xl font-bold text-blue-600">{analysis.wordCount}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">Readability</div>
                  <div className="text-2xl font-bold text-green-600">{analysis.readabilityScore}%</div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Optimization Suggestions
                </h4>
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter content above and click "Analyze Content" to see results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAnalyzer;
