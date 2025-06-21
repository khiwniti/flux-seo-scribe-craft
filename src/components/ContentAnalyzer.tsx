import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Target, TrendingUp, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { toast as sonnerToast } from 'sonner'; // Using sonner directly
import { analyzeContentWithGemini, GeminiServiceError, ContentAnalysisResponse } from '@/lib/geminiService'; // Changed import
import { useLanguage } from '@/contexts/LanguageContext';
import { useMutation } from '@tanstack/react-query';

// This interface now directly matches ContentAnalysisResponse for simplicity,
// plus the locally calculated wordCount.
interface DisplayableAnalysisResults {
  wordCount: number;
  seo_score: number;
  justification: string;
  readability_assessment: string;
  keyword_analysis: string;
  suggestions_list: string[];
}

const ContentAnalyzer = () => {
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [analysis, setAnalysis] = useState<DisplayableAnalysisResults | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const { language } = useLanguage();

  const analysisMutation = useMutation<
    ContentAnalysisResponse, // Expecting the direct analysis object
    GeminiServiceError,
    { currentContent: string; currentTitle: string; currentMeta: string; currentKeywords: string; currentLanguage: string }
  >({
    mutationFn: async (vars) => {
      let analysisContextKeywords = vars.currentKeywords;
      if (vars.currentTitle) analysisContextKeywords = `Title: ${vars.currentTitle}\nMeta: ${vars.currentMeta}\nKeywords: ${vars.currentKeywords}`;

      return analyzeContentWithGemini( // Use the new service function
        vars.currentContent,
        vars.currentLanguage,
        analysisContextKeywords
      );
    },
    onMutate: () => {
      setAnalysis(null);
      setApiKeyError(null);
      sonnerToast.info("Analyzing content...");
    },
    onSuccess: (data) => {
      // Data is now the direct JSON object from Gemini/PHP
      setAnalysis({
        wordCount: content.split(/\s+/).filter(Boolean).length, // content is from component state
        seo_score: data.seo_score || 0,
        justification: data.justification || "No justification provided.",
        readability_assessment: data.readability_assessment || "N/A",
        keyword_analysis: data.keyword_analysis || "N/A",
        suggestions_list: data.suggestions_list && data.suggestions_list.length > 0 ? data.suggestions_list : ["No specific suggestions provided."],
      });
      sonnerToast.success("Analysis complete!");
    },
    onError: (error: GeminiServiceError) => {
      console.error("Error analyzing content:", error);
      let errorDesc = "An error occurred during content analysis.";
      if (error.isApiKeyInvalid) {
        errorDesc = "The Gemini API key is invalid or missing. Please go to Settings to add it.";
        setApiKeyError(errorDesc);
      } else if (error.message) {
        errorDesc = error.message;
      }
      sonnerToast.error("Analysis Failed", { description: errorDesc });
      // Optionally set some error state in 'analysis' for UI display
      setAnalysis({
        wordCount: content.split(/\s+/).filter(Boolean).length,
        seo_score: 0,
        justification: "Analysis failed.",
        readability_assessment: "Error",
        keyword_analysis: "Error",
        suggestions_list: [errorDesc],
      });
    }
  });

  // parseGeminiResponse is no longer needed if backend sends structured JSON directly matching ContentAnalysisResponse.
  // const parseGeminiResponse = (responseText: string): Partial<DisplayableAnalysisResults> => { ... } // Keep old type for reference if needed


  const analyzeContent = () => {
    if (!content.trim()) {
      sonnerToast.error("Content Required", { description: "Please enter content to analyze." });
      return;
    }
    analysisMutation.mutate({
      currentContent: content,
      currentTitle: title,
      currentMeta: metaDescription,
      currentKeywords: keywords,
      currentLanguage: language,
    });
  };

  const getScoreColor = (score: number | string) => {
    const numScore = typeof score === 'string' ? parseFloat(score) || 0 : score;
    if (numScore >= 80) return 'text-green-600';
    if (numScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number | string) => {
    const numScore = typeof score === 'string' ? parseFloat(score) || 0 : score;
    if (numScore >= 80) return { variant: 'default' as const, className: 'bg-green-100 text-green-700', text: 'Excellent' };
    if (numScore >= 60) return { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-700', text: 'Good' };
    return { variant: 'destructive' as const, className: 'bg-red-100 text-red-700', text: 'Needs Work' };
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
            disabled={analysisMutation.isPending}
          >
            {analysisMutation.isPending ? 'Analyzing...' : 'Analyze Content'}
          </Button>
          {apiKeyError && (
             <div className="mt-2 p-2 text-xs bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-1">
               <AlertTriangleIcon className="h-4 w-4 flex-shrink-0" />
               {apiKeyError}
             </div>
          )}
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
                <div className={`text-4xl font-bold ${getScoreColor(analysis.seo_score)}`}>
                  {analysis.seo_score}%
                </div>
                <div className="mt-2">
                  <Badge 
                    variant={getScoreBadge(analysis.seo_score).variant}
                    className={getScoreBadge(analysis.seo_score).className}
                  >
                    {getScoreBadge(analysis.seo_score).text}
                  </Badge>
                </div>
                <Progress value={analysis.seo_score} className="mt-3" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Word Count</div>
                  <div className="text-2xl font-bold text-blue-600">{analysis.wordCount}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">Readability</div>
                  <div className="text-2xl font-bold text-green-600">{analysis.readability_assessment}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Justification</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{analysis.justification}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Keyword Analysis</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{analysis.keyword_analysis}</p>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Optimization Suggestions
                </h4>
                {analysis.suggestions_list.map((suggestion, index) => (
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
              <p>Enter content above and click "Analyze Content" to see results</p> {/* Ensure apiKeyError is shown if relevant */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAnalyzer;
