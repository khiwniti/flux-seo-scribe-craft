
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Image, Copy, Download, Wand2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IntegratedContentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a blog topic to generate content and images.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Generate enhanced image prompts based on content
    const imagePrompts = [
      `Professional ${topic.toLowerCase()} concept, modern office setting, high quality photography`,
      `${topic.toLowerCase()} infographic style, clean design, professional presentation`,
      `People working on ${topic.toLowerCase()}, collaborative environment, business photography`,
      `${topic.toLowerCase()} dashboard or interface, modern UI design, clean aesthetic`
    ];

    // Simulate content and image generation
    setTimeout(() => {
      const sampleContent = `# ${topic}

## Introduction

Understanding ${topic.toLowerCase()} is crucial for modern businesses looking to stay competitive. This comprehensive guide provides actionable insights and proven strategies that have helped thousands of companies achieve remarkable results.

## Why ${topic} Matters in 2024

- **Market Impact**: Companies implementing effective ${topic.toLowerCase()} strategies see 40% better performance
- **Competitive Edge**: Stay ahead with cutting-edge ${topic.toLowerCase()} techniques
- **ROI Enhancement**: Maximize your investment with data-driven ${topic.toLowerCase()} approaches

## Advanced Strategies

### 1. Data-Driven Approach
Leverage analytics to optimize your ${topic.toLowerCase()} implementation:
- Track key performance indicators
- Monitor user engagement metrics
- Analyze conversion patterns

### 2. Content Optimization
Create compelling content that resonates with your audience:
- Use semantic keywords naturally
- Structure content for readability
- Include multimedia elements

### 3. Technical Excellence
Ensure your ${topic.toLowerCase()} foundation is solid:
- Optimize page loading speeds
- Implement proper schema markup
- Mobile-first responsive design

## Implementation Checklist

✅ Keyword research and mapping
✅ Content calendar development
✅ Technical SEO audit
✅ Performance monitoring setup
✅ Competitor analysis
✅ Link building strategy

## Measuring Success

Track these essential metrics:
- Organic traffic growth
- Keyword ranking improvements
- User engagement rates
- Conversion optimization

## Conclusion

Mastering ${topic.toLowerCase()} requires a strategic approach, continuous learning, and data-driven decision making. Implement these strategies consistently to achieve sustainable growth.

---

*This content includes SEO-optimized structure, relevant keywords, and actionable insights for maximum search engine visibility.*`;

      // Generate contextual images with enhanced prompts
      const newImages = imagePrompts.map((prompt, index) => ({
        id: index + 1,
        url: `https://images.unsplash.com/photo-${1558655146 + index}?w=600&h=400&fit=crop&crop=entropy&cs=tinysrgb`,
        alt: `${topic} - ${prompt}`,
        prompt: prompt,
        enhanced: true
      }));

      setGeneratedContent(sampleContent);
      setGeneratedImages(newImages);
      setIsGenerating(false);
      
      toast({
        title: "Content & Images Generated!",
        description: "Your SEO-optimized blog post with matching images is ready.",
      });
    }, 4000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to Clipboard",
      description: "Blog content has been copied to your clipboard.",
    });
  };

  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'blog-image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Image Downloaded",
        description: "Image has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Settings */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            Integrated Content & Image Generator
          </CardTitle>
          <CardDescription>
            Generate SEO-optimized blog posts with contextual images automatically
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
            <Label htmlFor="keywords">Target Keywords</Label>
            <Input
              id="keywords"
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Integrated Features</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                SEO-Optimized Content
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Contextual Images
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Enhanced Prompts
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Ready to Publish
              </Badge>
            </div>
          </div>

          <Button 
            onClick={generateContent} 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating Content & Images...' : 'Generate Complete Blog Post'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Generated Content
              </CardTitle>
              <CardDescription>
                SEO-optimized blog post ready for publication
              </CardDescription>
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {generatedContent}
                </pre>
              </div>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mt-4">
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
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-pink-600" />
                Contextual Images
              </CardTitle>
              <CardDescription>
                AI-generated images optimized for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadImage(image.url, `blog-image-${image.id}.jpg`)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {image.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IntegratedContentGenerator;
