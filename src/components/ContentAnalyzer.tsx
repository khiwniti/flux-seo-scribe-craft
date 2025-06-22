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
  const { language } = useLanguage();
  const { toast } = useToast();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  // Translations
  const T = {
    contentInput: t("Content Input", "ข้อมูลเนื้อหา"),
    enterContentForAnalysis: t("Enter your content and SEO parameters for analysis", "ป้อนเนื้อหาและพารามิเตอร์ SEO ของคุณเพื่อการวิเคราะห์"),
    pageTitle: t("Page Title", "ชื่อหน้าเว็บ"),
    enterPageTitle: t("Enter your page title...", "ป้อนชื่อหน้าเว็บของคุณ..."),
    metaDescription: t("Meta Description", "คำอธิบายเมตา"),
    enterMetaDescription: t("Enter meta description...", "ป้อนคำอธิบายเมตา..."),
    targetKeywords: t("Target Keywords (comma-separated)", "คีย์เวิร์ดเป้าหมาย (คั่นด้วยจุลภาค)"),
    keywordsPlaceholder: t("SEO, optimization, content marketing...", "SEO, การเพิ่มประสิทธิภาพ, การตลาดเนื้อหา..."),
    content: t("Content", "เนื้อหา"),
    pasteContentForAnalysis: t("Paste your content here for analysis...", "วางเนื้อหาของคุณที่นี่เพื่อการวิเคราะห์..."),
    analyzing: t("Analyzing...", "กำลังวิเคราะห์..."),
    analyzeContent: t("Analyze Content", "วิเคราะห์เนื้อหา"),
    analysisResults: t("Analysis Results", "ผลการวิเคราะห์"),
    seoOptimizationInsights: t("SEO optimization insights and recommendations", "ข้อมูลเชิงลึกและคำแนะนำเพื่อเพิ่มประสิทธิภาพ SEO"),
    excellent: t("Excellent", "ยอดเยี่ยม"),
    good: t("Good", "ดี"),
    needsWork: t("Needs Work", "ต้องปรับปรุง"),
    wordCount: t("Word Count", "จำนวนคำ"),
    readability: t("Readability", "การอ่านง่าย"),
    optimizationSuggestions: t("Optimization Suggestions", "คำแนะนำในการปรับปรุง"),
    enterContentPrompt: t("Enter content above and click \"Analyze Content\" to see results", "ป้อนเนื้อหาด้านบนแล้วคลิก \"วิเคราะห์เนื้อหา\" เพื่อดูผลลัพธ์"),
    toastContentRequiredTitle: t("Content Required", "จำเป็นต้องมีเนื้อหา"),
    toastContentRequiredDesc: t("Please enter content to analyze.", "กรุณาป้อนเนื้อหาเพื่อวิเคราะห์"),
    toastAnalysisFailedTitle: t("Analysis Failed", "การวิเคราะห์ล้มเหลว"),
    toastAnalysisErrorDesc: t("An error occurred during content analysis.", "เกิดข้อผิดพลาดระหว่างการวิเคราะห์เนื้อหา"),
    apiKeyErrorMsg: t("The Gemini API key is invalid or missing. Please go to Settings to add it.", "คีย์ Gemini API ไม่ถูกต้องหรือขาดหายไป กรุณาไปที่การตั้งค่าเพื่อเพิ่มคีย์"),
    errorLabel: t("Error", "ข้อผิดพลาด"),
    analysisFailedLabel: t("Analysis failed.", "การวิเคราะห์ล้มเหลว"),
    noSuggestionsExtracted: t("No specific suggestions extracted. Review the raw Gemini output if provided.", "ไม่พบคำแนะนำเฉพาะ ตรวจสอบผลลัพธ์ดิบจาก Gemini หากมี"),
    geminiNoSuggestions: t("Gemini did not provide specific suggestions in the expected format.", "Gemini ไม่ได้ให้คำแนะนำเฉพาะในรูปแบบที่คาดไว้"),
    noJustification: t("No justification provided.", "ไม่ได้ให้เหตุผลประกอบ"),
    notAvailable: t("N/A", "ไม่มีข้อมูล"),
  };

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
    if (results.readabilityScore === undefined) results.readabilityScore = T.notAvailable;
    if (!results.suggestions || results.suggestions.length === 0) {
        results.suggestions = [T.noSuggestionsExtracted];
    }
    return results;
  };


  const analyzeContent = async () => {
    if (!content.trim()) {
      toast({
        title: T.toastContentRequiredTitle,
        description: T.toastContentRequiredDesc,
        variant: "destructive",
      });
      return;
    }
    setApiKeyError(null);
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
        wordCount: content.split(/\s+/).filter(Boolean).length,
        readabilityScore: parsedAnalysis.readabilityScore || T.notAvailable,
        seoScore: parsedAnalysis.seoScore || 0,
        suggestions: parsedAnalysis.suggestions && parsedAnalysis.suggestions.length > 0 ? parsedAnalysis.suggestions : [T.geminiNoSuggestions],
        keywordDensity: parsedAnalysis.keywordDensity || T.notAvailable,
        justification: parsedAnalysis.justification || T.noJustification,
      });

    } catch (error: any) {
      console.error("Error analyzing content with Gemini:", error);
      let errorDesc = T.toastAnalysisErrorDesc;
      if (error.isApiKeyInvalid) {
        errorDesc = T.apiKeyErrorMsg;
        setApiKeyError(errorDesc);
      } else if (error.message) {
        errorDesc = error.message;
      }
      toast({ title: T.toastAnalysisFailedTitle, description: errorDesc, variant: "destructive" });
      setAnalysis({
        wordCount: content.split(/\s+/).filter(Boolean).length,
        readabilityScore: T.errorLabel,
        seoScore: 0,
        suggestions: [errorDesc],
        justification: T.analysisFailedLabel,
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

  const getScoreBadgeText = (score: number | string) => {
    const numScore = typeof score === 'string' ? parseFloat(score) || 0 : score;
    if (numScore >= 80) return T.excellent;
    if (numScore >= 60) return T.good;
    return T.needsWork;
  }

  const getScoreBadgeVariantClass = (score: number | string) => {
    const numScore = typeof score === 'string' ? parseFloat(score) || 0 : score;
    if (numScore >= 80) return { variant: 'default' as const, className: 'bg-green-100 text-green-700' };
    if (numScore >= 60) return { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-700' };
    return { variant: 'destructive' as const, className: 'bg-red-100 text-red-700' };
  };


  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            {T.contentInput}
          </CardTitle>
          <CardDescription>
            {T.enterContentForAnalysis}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{T.pageTitle}</Label>
            <Input
              id="title"
              placeholder={T.enterPageTitle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meta">{T.metaDescription}</Label>
            <Textarea
              id="meta"
              placeholder={T.enterMetaDescription}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              disabled={isAnalyzing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">{T.targetKeywords}</Label>
            <Input
              id="keywords"
              placeholder={T.keywordsPlaceholder}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{T.content}</Label>
            <Textarea
              id="content"
              placeholder={T.pasteContentForAnalysis}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              disabled={isAnalyzing}
            />
          </div>
           {apiKeyError && (
            <div className="mt-2 p-2 text-xs bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-1">
              <AlertTriangleIcon className="h-4 w-4 flex-shrink-0" />
              {apiKeyError}
            </div>
          )}
          <Button 
            onClick={analyzeContent} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? T.analyzing : T.analyzeContent}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            {T.analysisResults}
          </CardTitle>
          <CardDescription>
            {T.seoOptimizationInsights}
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
                    variant={getScoreBadgeVariantClass(analysis.seoScore).variant}
                    className={getScoreBadgeVariantClass(analysis.seoScore).className}
                  >
                    {getScoreBadgeText(analysis.seoScore)}
                  </Badge>
                </div>
                <Progress value={typeof analysis.seoScore === 'number' ? analysis.seoScore : 0} className="mt-3" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">{T.wordCount}</div>
                  <div className="text-2xl font-bold text-blue-600">{analysis.wordCount}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">{T.readability}</div>
                  <div className="text-2xl font-bold text-green-600">
                    {typeof analysis.readabilityScore === 'number' ? `${analysis.readabilityScore}%` : analysis.readabilityScore}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  {T.optimizationSuggestions}
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
              <p>{T.enterContentPrompt}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAnalyzer;
