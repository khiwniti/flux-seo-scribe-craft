
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wand2, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IntelligentContentOptimizer = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const { toast } = useToast();

  const analyzeContent = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const wordCount = content.split(' ').length;
      const sentences = content.split('.').length;
      const avgWordsPerSentence = Math.round(wordCount / sentences);
      
      setAnalysis({
        score: Math.min(85, Math.max(45, wordCount * 0.1 + Math.random() * 20)),
        wordCount,
        readabilityScore: Math.max(60, 100 - avgWordsPerSentence * 2),
        keywordDensity: Math.random() * 3 + 1,
        suggestions: [
          'Add more transition words to improve flow',
          'Include relevant internal links',
          'Consider adding subheadings for better structure',
          'Optimize for featured snippets with bullet points'
        ],
        strengths: [
          'Good keyword usage',
          'Appropriate content length',
          'Clear topic focus'
        ]
      });
      setIsAnalyzing(false);
      
      toast({
        title: "Content Analysis Complete!",
        description: "AI has analyzed your content and provided optimization suggestions"
      });
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Intelligent Content Optimizer
        </CardTitle>
        <CardDescription>
          AI-powered content analysis and optimization suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Content to Optimize
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here for AI analysis and optimization..."
            rows={8}
            className="min-h-[200px]"
          />
        </div>

        <Button 
          onClick={analyzeContent} 
          disabled={isAnalyzing || !content.trim()}
          className="w-full"
        >
          <Target className="h-4 w-4 mr-2" />
          {isAnalyzing ? 'Analyzing Content...' : 'Optimize with AI'}
        </Button>

        {analysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                    {Math.round(analysis.score)}%
                  </div>
                  <div className="text-sm text-gray-600">SEO Score</div>
                  <Progress value={analysis.score} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.wordCount}
                  </div>
                  <div className="text-sm text-gray-600">Words</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(analysis.readabilityScore)}%
                  </div>
                  <div className="text-sm text-gray-600">Readability</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysis.keywordDensity.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Keyword Density</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Optimization Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Content Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligentContentOptimizer;
