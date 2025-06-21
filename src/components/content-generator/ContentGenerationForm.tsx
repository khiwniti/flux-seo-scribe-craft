
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wand2, Brain, CheckCircle, Eye, Target, TrendingUp, Zap } from 'lucide-react';

interface ContentGenerationFormProps {
  topic: string;
  setTopic: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  wordCount: string;
  setWordCount: (value: string) => void;
  contentType: string;
  setContentType: (value: string) => void;
  writingStyle: string;
  setWritingStyle: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  industryFocus: string;
  setIndustryFocus: (value: string) => void;
  contentTemplate: string;
  setContentTemplate: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => Promise<void>; // Changed to Promise
  error?: string | null; // Added error prop
}

const ContentGenerationForm = ({
  topic,
  setTopic,
  keywords,
  setKeywords,
  tone,
  setTone,
  wordCount,
  setWordCount,
  contentType,
  setContentType,
  writingStyle,
  setWritingStyle,
  targetAudience,
  setTargetAudience,
  industryFocus,
  setIndustryFocus,
  contentTemplate,
  setContentTemplate,
  isGenerating,
  onGenerate,
  error, // Destructure error
}: ContentGenerationFormProps) => {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    await onGenerate();
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          Intelligent Content Generator
        </CardTitle>
        <CardDescription>
          AI-powered content generation with smart field enhancement and auto-completion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4"> {/* Added form element */}
          <div className="space-y-2">
            <Label htmlFor="topic">Blog Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., Digital Marketing Strategies for 2024"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
              required
            />
            {topic && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                💡 AI will automatically suggest keywords, tone, and audience based on your topic
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Target Keywords</Label>
            <Input
              id="keywords"
              placeholder="AI will auto-suggest keywords..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isGenerating}
            />
            {!keywords && topic && (
              <div className="text-xs text-green-600">
                ✨ Keywords will be auto-generated from your topic
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Writing Tone</Label>
              <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="AI will auto-detect..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                </SelectContent>
              </Select>
              {!tone && (
                <div className="text-xs text-purple-600">
                  🎯 Tone auto-detected from content
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Word Count</Label>
              <Select value={wordCount} onValueChange={setWordCount} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (500-800 words)</SelectItem>
                  <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                  <SelectItem value="long">Long (1200-2000 words)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Enhanced Intelligence Settings */}
        <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-blue-600" />
            <Label className="text-base font-semibold">Enhanced AI Settings</Label>
            <Badge className="bg-purple-100 text-purple-700">Auto-Enhanced</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="AI will detect..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="how-to">How-To Guide</SelectItem>
                  <SelectItem value="listicle">Listicle</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Writing Style</Label>
              <Select value={writingStyle} onValueChange={setWritingStyle} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-optimized..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="AI will identify..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Public</SelectItem>
                  <SelectItem value="beginners">Beginners</SelectItem>
                  <SelectItem value="professionals">Professionals</SelectItem>
                  <SelectItem value="experts">Industry Experts</SelectItem>
                  <SelectItem value="executives">Business Executives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Industry Focus</Label>
              <Select value={industryFocus} onValueChange={setIndustryFocus} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-categorized..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Business</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content Template</Label>
            <Select value={contentTemplate} onValueChange={setContentTemplate} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Smart template selection..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Article</SelectItem>
                <SelectItem value="how-to">How-To Guide</SelectItem>
                <SelectItem value="listicle">List Article</SelectItem>
                <SelectItem value="comparison">Comparison Guide</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>AI-Powered Features</Label>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Auto-SEO Optimization
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Eye className="h-3 w-3 mr-1" />
              Smart Image Generation
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Brain className="h-3 w-3 mr-1" />
              Keyword Auto-Detection
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              <Target className="h-3 w-3 mr-1" />
              Content Quality Analysis
            </Badge>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trend Integration
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              <Zap className="h-3 w-3 mr-1" />
              One-Click Publishing
            </Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
            <div className="mt-4 p-3 text-sm bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 flex-shrink-0" /> {/* Use imported AlertTriangleIcon */}
              {error}
            </div>
        )}

        <Button 
          type="submit" // Changed from onClick to type="submit" for form
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating AI-Enhanced Content...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Generate Smart AI Content
            </div>
          )}
        </Button>
        </form> {/* Close form element */}
      </CardContent>
    </Card>
  );
};

export default ContentGenerationForm;
