import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Target, TrendingUp, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateBlogContent as callGeminiApi } from '@/lib/geminiService';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

interface AnalysisResults {
  wordCount: number;
  readabilityScore: number | string; // Can be qualitative like "Good" or a score
  seoScore: number;
  suggestions: string[];
  keywordDensity?: string; // Optional: Gemini might provide this as text
  justification?: string; // Justification for SEO score
}

const ContentAnalyzer = () => {
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const { language } = useLanguage(); // Consume global language context
  const { toast } = useToast();

  const parseGeminiResponse = (responseText: string): Partial<AnalysisResults> => {
    const results: Partial<AnalysisResults> = { suggestions: [] };
    const lines = responseText.split('\n');

    lines.forEach(line => {
      if (line.match(/Overall SEO Score: (\d+)/i)) {
        results.seoScore = parseInt(RegExp.$1, 10);
      } else if (line.match(/Justification: (.*)/i)) {
        results.justification = RegExp.$1;
      } else if (line.match(/Readability: (.*)/i)) {
        const readabilityValue = RegExp.$1;
        results.readabilityScore = isNaN(parseFloat(readabilityValue)) ? readabilityValue : parseFloat(readabilityValue);
      } else if (line.match(/Keyword Density: (.*)/i)) {
        results.keywordDensity = RegExp.$1;
      } else if (line.match(/Suggestion \d+: (.*)/i) || line.match(/- (.*)/i) || line.match(/\* (.*)/i) ) {
         // Try to capture suggestions prefixed with "Suggestion X:", "-", or "*"
        if (RegExp.$1.trim()) results.suggestions?.push(RegExp.$1.trim());
      }
    });
     // If no specific suggestion format matched, but we have lines that aren't other fields, treat them as suggestions.
    if (results.suggestions?.length === 0) {
        const potentialSuggestions = lines.filter(
            line => !line.startsWith("Overall SEO Score:") &&
                    !line.startsWith("Justification:") &&
                    !line.startsWith("Readability:") &&
                    !line.startsWith("Keyword Density:") &&
                    line.trim().length > 10 // Avoid empty or very short lines
        );
        if (potentialSuggestions.length > 0 && potentialSuggestions.length <= 7) { // Heuristic: if few lines left, might be suggestions
             results.suggestions = potentialSuggestions;
        }
    }


    // Fallback if parsing fails for some fields
    if (results.seoScore === undefined) results.seoScore = 0; // Default if not found
    if (results.readabilityScore === undefined) results.readabilityScore = "N/A";
    if (!results.suggestions || results.suggestions.length === 0) {
        results.suggestions = ["No specific suggestions extracted. Review the raw Gemini output if provided."];
    }
    return results;
  };


  const analyzeContent = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to analyze.",
        variant: "destructive",
      });
      return;
    }
    setApiKeyError(null); // Clear previous API key error
    setIsAnalyzing(true);
    setAnalysis(null);

    let prompt = `Analyze the following content for SEO quality. Provide the output with clear headings for each section.

Content to Analyze:
---
${content}
---
`;

    if (title) prompt += `\nPage Title: "${title}"`;
    if (metaDescription) prompt += `\nMeta Description: "${metaDescription}"`;
    if (keywords) prompt += `\nFocus Keywords: "${keywords}"`;

    prompt += `

Analysis Required (please provide your entire response in ${language === 'th' ? 'Thai' : 'English'}):
1.  Overall SEO Score: (Provide a score from 0 to 100)
2.  Justification: (Briefly explain the score)
3.  Readability: (Assess readability, e.g., Flesch-Kincaid score, or qualitative like 'Good', 'Difficult to read')
4.  Keyword Density: (Analyze usage of focus keywords if provided, otherwise general keyword cloudiness)
5.  Suggestions: (Provide 3-5 actionable SEO suggestions to improve the content. Each suggestion should start with "Suggestion X:" or be a bullet point like "-" or "*")

Format the response clearly.`;

    try {
      const rawResponse = await callGeminiApi(prompt);
      const parsedAnalysis = parseGeminiResponse(rawResponse);

      setAnalysis({
        wordCount: content.split(/\s+/).filter(Boolean).length, // Calculate locally
        readabilityScore: parsedAnalysis.readabilityScore || "N/A",
        seoScore: parsedAnalysis.seoScore || 0,
        suggestions: parsedAnalysis.suggestions && parsedAnalysis.suggestions.length > 0 ? parsedAnalysis.suggestions : ["Gemini did not provide specific suggestions in the expected format."],
        keywordDensity: parsedAnalysis.keywordDensity || "N/A",
        justification: parsedAnalysis.justification || "No justification provided.",
      });

    } catch (error: any) {
      console.error("Error analyzing content with Gemini:", error);
      let errorDesc = "An error occurred during content analysis.";
      if (error.isApiKeyInvalid) {
        errorDesc = "The Gemini API key is invalid or missing. Please go to Settings to add it.";
        setApiKeyError(errorDesc);
      } else if (error.message) {
        errorDesc = error.message;
      }
      toast({ title: "Analysis Failed", description: errorDesc, variant: "destructive" });
      setAnalysis({ // Provide some feedback in the analysis area
        wordCount: content.split(/\s+/).filter(Boolean).length,
        readabilityScore: "Error",
        seoScore: 0,
        suggestions: [errorDesc],
        justification: "Analysis failed."
      });
    } finally {
      setIsAnalyzing(false);
    }
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
                  <Badge 
                    variant={getScoreBadge(analysis.seoScore).variant}
                    className={getScoreBadge(analysis.seoScore).className}
                  >
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
