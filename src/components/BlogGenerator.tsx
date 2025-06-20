
import React, { useState, useEffect } from 'react';
// Duplicate ShadCN imports were removed here by only keeping one block
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Wand2, Copy, Download, AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react'; // Added ImageIcon, Loader2
import { useToast } from '@/hooks/use-toast';
import { SentimentAnalyzer, WordTokenizer, PorterStemmer } from 'natural';
import { generateBlogContent, generateImagePromptForText } from '@/lib/geminiService'; // Import Gemini services
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

const BlogGenerator = () => {
  const { language } = useLanguage(); // Consume global language context
  const [topic, setTopic] = useState('');
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [tone, setTone] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [writingStyle, setWritingStyle] = useState('Informative'); // Default style
  const [analyzedContentForSuggestions, setAnalyzedContentForSuggestions] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState<string | null>(null);
  const [isGeneratingImagePrompt, setIsGeneratingImagePrompt] = useState(false);
  const { toast } = useToast();

  // AI-Suggestion for Tone
  useEffect(() => {
    if (analyzedContentForSuggestions.trim() && tone === '') { // Only suggest if tone is not manually set
      const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
      const tokenizer = new WordTokenizer();
      const tokens = tokenizer.tokenize(analyzedContentForSuggestions.toLowerCase());

      if (tokens && tokens.length > 0) {
        const sentimentScore = analyzer.getSentiment(tokens);
        let suggestedTone = 'Neutral'; // Default
        if (sentimentScore > 0.33) {
          suggestedTone = 'Positive';
        } else if (sentimentScore < -0.33) {
          suggestedTone = 'Negative';
        }
        // More specific heuristic from SmartFieldEnhancer (simplified)
        const lowerContent = analyzedContentForSuggestions.toLowerCase();
        if (lowerContent.includes('expert') || lowerContent.includes('professional') || lowerContent.includes('research')) {
            suggestedTone = 'authoritative';
        } else if (lowerContent.includes('easy') || lowerContent.includes('simple') || lowerContent.includes('beginner')) {
            suggestedTone = 'casual';
        } else if (lowerContent.includes('business') || lowerContent.includes('corporate') || lowerContent.includes('enterprise')) {
            suggestedTone = 'professional';
        } else if (lowerContent.includes('friend') || lowerContent.includes('welcome')) { // Example for friendly
            suggestedTone = 'friendly';
        }


        // Only set if it's one of the predefined valid tones in the Select
        const validTones = ["professional", "casual", "friendly", "authoritative", "conversational", "Positive", "Negative", "Neutral"];
        if (validTones.includes(suggestedTone)) {
            setTone(suggestedTone);
             toast({
                title: "AI Suggestion",
                description: `Writing tone auto-suggested: ${suggestedTone}`,
            });
        }
      }
    }
  }, [analyzedContentForSuggestions, tone]); // Re-run if content changes or if tone is reset to auto

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a blog topic to generate content.",
        variant: "destructive",
      });
      return;
    }
    setApiKeyError(null); // Clear previous API key error before trying
    setIsGenerating(true);
    setGeneratedContent(''); // Clear previous content

    // Construct the prompt
    // For now, we'll use the fields available in BlogGenerator's state:
    // topic, primaryKeyword, tone, wordCount.
    // Other fields like contentType, writingStyle, etc., are from ContentGenerationForm
    // and not directly available here unless BlogGenerator is refactored.
    let prompt = `Generate a blog post about "${topic}".`;
    if (primaryKeyword) {
      prompt += ` The primary focus keyword is "${primaryKeyword}".`;
    }
    if (tone && tone !== "") { // Ensure tone is not "Auto-suggest" (empty string)
      prompt += ` The desired writing tone is "${tone}".`;
    }
    if (wordCount) {
      // Map wordCount to a more descriptive phrase if needed, or use as is.
      // Example: 'short' -> 'around 500-800 words'
      let targetLength = wordCount;
      if (wordCount === "short") targetLength = "around 500-800 words";
      else if (wordCount === "medium") targetLength = "around 800-1200 words";
      else if (wordCount === "long") targetLength = "around 1200-2000 words";
      else if (wordCount === "extended") targetLength = "over 2000 words";
      prompt += ` The target length is ${targetLength}.`;
    }
    // Add writing style instruction
    if (writingStyle && writingStyle !== "Informative") { // Assuming "Informative" is default and implies no special instruction
        prompt += ` Write the blog post in a ${writingStyle} style.`;
        // More specific instructions could be added per style:
        if (writingStyle === "Casual & Engaging") prompt += " Use conversational language and a friendly tone.";
        if (writingStyle === "Authoritative & Expert") prompt += " Convey expertise and authority on the subject.";
        if (writingStyle === "Storytelling / Narrative") prompt += " Weave a narrative or story throughout the post.";
        if (writingStyle === "Technical & Precise") prompt += " Be technically accurate and precise in language.";
        if (writingStyle === "Humorous & Witty") prompt += " Incorporate humor and wit where appropriate.";
        if (writingStyle === "Persuasive & Marketing-focused") prompt += " Aim to persuade the reader or market an idea/product.";
    } else {
        prompt += " Write in a clear and informative style.";
    }

    if (language === 'th') {
        prompt += " Please write this blog post entirely in Thai.";
    } else {
        prompt += " Please write this blog post entirely in English."; // Default or explicit English
    }
    prompt += "\n\nThe blog post should be well-structured with headings, subheadings, and engaging content suitable for SEO."

    try {
      const content = await generateBlogContent(prompt);
      setGeneratedContent(content);
      setGeneratedImagePrompt(null);
      toast({
        title: "Content Generated Successfully!",
        description: "Your AI-generated blog post is ready. Generating image prompt next...",
      });

      // Now, automatically generate image prompt
      setIsGeneratingImagePrompt(true);
      try {
        // The generateImagePromptForText in geminiService already has a detailed internal prompt structure
        // asking for an image prompt. We just pass the blog content (which might be in Thai)
        // and an additional instruction for the desired language of the image prompt itself.
        let imagePromptInput = `Based on the following ${language === 'th' ? 'Thai' : 'English'} text, generate a suitable image prompt.`;
        imagePromptInput += ` The image prompt itself should be in ${language === 'th' ? 'Thai' : 'English'}.`;
        imagePromptInput += `\n\nText for context: "${content.substring(0, 500)}..."`; // Provide a snippet of the content

        const imagePromptResult = await generateImagePromptForText(imagePromptInput);
        setGeneratedImagePrompt(imagePromptResult);
        toast({
          title: "Image Prompt Generated!",
          description: "AI-suggested image prompt is ready.",
        });
      } catch (imgError: any) {
        console.error("Error generating image prompt:", imgError);
        let imgErrorDesc = imgError.message || "Could not generate image prompt.";
        if (imgError.isApiKeyInvalid) {
            imgErrorDesc = "API Key error during image prompt generation. Check Settings.";
            setApiKeyError(imgErrorDesc);
        }
        toast({
          title: "Image Prompt Generation Failed",
          description: imgErrorDesc,
          variant: "destructive",
        });
        setGeneratedImagePrompt("Error: " + imgErrorDesc);
      } finally {
        setIsGeneratingImagePrompt(false);
      }

    } catch (error: any) {
      console.error("Error generating blog content:", error);
      let description = "An unexpected error occurred while generating content.";
      if (error.isApiKeyInvalid) {
        description = "The Google Gemini API key is invalid or missing. Please go to Settings to add it.";
        setApiKeyError(description);
      } else if (error.message) {
        description = error.message;
      }
      toast({
        title: "Content Generation Failed",
        description: description,
        variant: "destructive",
      });
      setGeneratedContent(`Error: ${description}\n\nPrompt sent:\n${prompt}`); // Show error in content area
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to Clipboard",
      description: "Blog content has been copied to your clipboard.",
    });
  };

  const exportContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-blog-post.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Content Exported",
      description: "Blog post has been downloaded as a Markdown file.",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Generator Settings */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            Blog Generator
          </CardTitle>
          <CardDescription>
            Generate SEO-optimized blog posts with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* The first, simpler Blog Topic input was removed here */}
          <div className="space-y-2">
            <Label htmlFor="topic">Blog Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., Digital Marketing Strategies for 2024"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setAnalyzedContentForSuggestions(e.target.value + (primaryKeyword ? ' ' + primaryKeyword : ''));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary-keyword">Primary Keyword</Label>
            <Input
              id="primary-keyword"
              placeholder="Enter one primary keyword"
              value={primaryKeyword}
              onChange={(e) => {
                setPrimaryKeyword(e.target.value);
                setAnalyzedContentForSuggestions(topic + (e.target.value ? ' ' + e.target.value : ''));
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Writing Tone (AI Suggested)</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone or let AI suggest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto-suggest</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  {/* Add other tones from SmartFieldEnhancer if needed */}
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Word Count</Label>
              <Select value={wordCount} onValueChange={setWordCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (500-800 words)</SelectItem>
                  <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                  <SelectItem value="long">Long (1200-2000 words)</SelectItem>
                  <SelectItem value="extended">Extended (2000+ words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="writing-style">Writing Style</Label>
            <Select value={writingStyle} onValueChange={setWritingStyle}>
              <SelectTrigger id="writing-style">
                <SelectValue placeholder="Select writing style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Informative">Default / Informative</SelectItem>
                <SelectItem value="Casual & Engaging">Casual & Engaging</SelectItem>
                <SelectItem value="Authoritative & Expert">Authoritative & Expert</SelectItem>
                <SelectItem value="Storytelling / Narrative">Storytelling / Narrative</SelectItem>
                <SelectItem value="Technical & Precise">Technical & Precise</SelectItem>
                <SelectItem value="Humorous & Witty">Humorous & Witty</SelectItem>
                <SelectItem value="Persuasive & Marketing-focused">Persuasive & Marketing-focused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>SEO Features</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Keyword Optimization
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Meta Tags
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Header Structure
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Internal Links
              </Badge>
            </div>
          </div>

          <Button 
            onClick={generateBlog} 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating Content...' : 'Generate Blog Post'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Generated Content
          </CardTitle>
          <CardDescription>
            Your AI-generated, SEO-optimized blog post
          </CardDescription>
          {generatedContent && (
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportContent}
                className="flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Export
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {generatedContent ? (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {generatedContent}
                </pre>
              </div>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {generatedContent.split(' ').length}
                  </div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {generatedContent.split('\n').filter(line => line.trim().startsWith('#')).length}
                  </div>
                  <div className="text-sm text-gray-600">Headers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.ceil(generatedContent.split(' ').length / 200)}
                  </div>
                  <div className="text-sm text-gray-600">Min Read</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Generated blog content will appear here</p>
              <p className="text-sm mt-2">Fill in the details and click "Generate Blog Post"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Image Prompt Section */}
      {(generatedContent && !apiKeyError) && (isGeneratingImagePrompt || generatedImagePrompt) && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              Suggested Image Prompt
            </CardTitle>
            <CardDescription>
              Use this AI-generated prompt with your favorite image generation tool.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGeneratingImagePrompt ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating image prompt...
              </div>
            ) : generatedImagePrompt ? (
              <Textarea
                readOnly
                value={generatedImagePrompt}
                className="min-h-[100px] bg-gray-50 text-sm"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogGenerator;
