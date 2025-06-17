
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Wand2, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BlogGenerator = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a blog topic to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const sampleContent = `# ${topic}

## Introduction

In today's digital landscape, understanding ${topic.toLowerCase()} has become more crucial than ever. This comprehensive guide will walk you through everything you need to know about ${topic.toLowerCase()}, providing actionable insights and practical strategies.

## Key Benefits

- **Enhanced Performance**: Implementing proper ${topic.toLowerCase()} strategies can significantly improve your results
- **Cost Efficiency**: Smart approaches to ${topic.toLowerCase()} help optimize your budget and resources
- **Competitive Advantage**: Stay ahead of the competition with advanced ${topic.toLowerCase()} techniques

## Best Practices

### 1. Planning Phase
Before diving into ${topic.toLowerCase()}, it's essential to create a solid foundation. This involves:
- Conducting thorough research
- Setting clear objectives
- Identifying your target audience

### 2. Implementation
The implementation phase requires careful attention to detail and consistent execution.

### 3. Optimization
Continuous optimization ensures long-term success with your ${topic.toLowerCase()} strategy.

## Conclusion

Mastering ${topic.toLowerCase()} is a journey that requires dedication, continuous learning, and strategic thinking. By following the guidelines outlined in this article, you'll be well-equipped to succeed in your ${topic.toLowerCase()} endeavors.

---

*This content was generated with SEO optimization in mind, incorporating relevant keywords and maintaining readability for both users and search engines.*`;

      setGeneratedContent(sampleContent);
      setIsGenerating(false);
      
      toast({
        title: "Content Generated Successfully!",
        description: "Your SEO-optimized blog post is ready.",
      });
    }, 3000);
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
          <div className="space-y-2">
            <Label htmlFor="topic">Blog Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., Digital Marketing Strategies for 2024"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-keywords">Target Keywords</Label>
            <Input
              id="blog-keywords"
              placeholder="SEO, digital marketing, content strategy..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Writing Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
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
    </div>
  );
};

export default BlogGenerator;
