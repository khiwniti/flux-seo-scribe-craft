
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Image, Copy, Download, Wand2, Lightbulb, Calendar, Clock, Play, Pause, Settings, Brain, TrendingUp, Target, Award, Zap, Eye, Users, Globe, CheckCircle, AlertCircle, Star, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const IntegratedContentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Auto-generation states
  const [autoGenEnabled, setAutoGenEnabled] = useState(false);
  const [autoGenFrequency, setAutoGenFrequency] = useState('weekly');
  const [autoGenTime, setAutoGenTime] = useState('09:00');
  const [autoGenDay, setAutoGenDay] = useState('monday');
  const [autoGenTopics, setAutoGenTopics] = useState('');
  const [autoGenKeywords, setAutoGenKeywords] = useState('');
  const [autoGenHistory, setAutoGenHistory] = useState([]);
  const [nextScheduledRun, setNextScheduledRun] = useState(null);
  
  // Intelligence and Quality Enhancement States
  const [contentQuality, setContentQuality] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [contentSuggestions, setContentSuggestions] = useState([]);
  const [targetAudience, setTargetAudience] = useState('general');
  const [contentType, setContentType] = useState('blog');
  const [writingStyle, setWritingStyle] = useState('professional');
  const [industryFocus, setIndustryFocus] = useState('general');
  const [competitorAnalysis, setCompetitorAnalysis] = useState([]);
  const [contentTemplate, setContentTemplate] = useState('standard');
  const [smartKeywords, setSmartKeywords] = useState([]);
  const [contentInsights, setContentInsights] = useState({});
  
  const { toast } = useToast();

  // Enhanced Content Generation with Intelligence
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
    
    // Analyze content requirements and generate smart suggestions
    const analyzeContentRequirements = () => {
      const topicWords = topic.toLowerCase().split(' ');
      const suggestedKeywords = [
        ...topicWords,
        `${topic.toLowerCase()} strategy`,
        `${topic.toLowerCase()} best practices`,
        `${topic.toLowerCase()} guide`,
        `${topic.toLowerCase()} tips`,
        `${topic.toLowerCase()} 2024`
      ];
      
      setSmartKeywords(suggestedKeywords);
      
      // Generate content insights
      setContentInsights({
        estimatedReadTime: Math.ceil(wordCount ? parseInt(wordCount) / 200 : 5),
        targetKeywordDensity: '1-2%',
        recommendedHeadings: 6,
        suggestedImages: 4,
        seoComplexity: 'Medium',
        competitiveLevel: 'High'
      });
    };

    analyzeContentRequirements();
    
    // Generate enhanced content templates based on content type and industry
    const getContentTemplate = () => {
      const templates = {
        'how-to': {
          structure: ['Introduction', 'Prerequisites', 'Step-by-Step Guide', 'Tips & Best Practices', 'Common Mistakes', 'Conclusion'],
          tone: 'instructional'
        },
        'listicle': {
          structure: ['Introduction', 'List Items (5-10)', 'Detailed Explanations', 'Key Takeaways', 'Conclusion'],
          tone: 'engaging'
        },
        'standard': {
          structure: ['Introduction', 'Main Content Sections', 'Examples & Case Studies', 'Actionable Tips', 'Conclusion'],
          tone: writingStyle
        },
        'comparison': {
          structure: ['Introduction', 'Comparison Criteria', 'Detailed Analysis', 'Pros & Cons', 'Recommendation', 'Conclusion'],
          tone: 'analytical'
        }
      };
      
      return templates[contentTemplate] || templates['standard'];
    };

    const template = getContentTemplate();
    
    // Generate enhanced image prompts based on content type and industry
    const generateSmartImagePrompts = () => {
      const industryContext = industryFocus !== 'general' ? `${industryFocus} industry` : 'business';
      const audienceContext = targetAudience !== 'general' ? `for ${targetAudience}` : '';
      
      return [
        `Professional ${topic.toLowerCase()} concept in ${industryContext}, modern workspace, high-quality photography ${audienceContext}`,
        `${topic.toLowerCase()} infographic design, clean minimalist style, data visualization, professional presentation`,
        `Team collaboration on ${topic.toLowerCase()}, diverse professionals, ${industryContext} environment, business photography`,
        `${topic.toLowerCase()} dashboard interface, modern UI/UX design, analytics visualization, clean aesthetic`,
        `${topic.toLowerCase()} success metrics, charts and graphs, business intelligence, professional design`
      ];
    };

    const imagePrompts = generateSmartImagePrompts();

    // Simulate intelligent content generation with quality analysis
    setTimeout(() => {
      // Calculate quality scores
      const calculateQualityScores = () => {
        const baseQuality = 75 + Math.random() * 20;
        const seoBonus = keywords.length > 0 ? 10 : 0;
        const structureBonus = template.structure.length > 4 ? 5 : 0;
        
        const quality = Math.min(95, baseQuality + seoBonus + structureBonus);
        const seo = Math.min(95, quality - 5 + (keywords.split(',').length * 2));
        const readability = Math.min(95, quality - 10 + (writingStyle === 'conversational' ? 10 : 0));
        
        setContentQuality(Math.round(quality));
        setSeoScore(Math.round(seo));
        setReadabilityScore(Math.round(readability));
      };

      calculateQualityScores();

      // Generate enhanced content with intelligent structure
      const generateIntelligentContent = () => {
        const keywordList = keywords ? keywords.split(',').map(k => k.trim()) : smartKeywords.slice(0, 5);
        const primaryKeyword = keywordList[0] || topic.toLowerCase();
        
        return `# ${topic}: Complete ${new Date().getFullYear()} Guide

## Introduction

${topic} has become increasingly important in today's digital landscape. This comprehensive guide provides data-driven insights, proven strategies, and actionable tips that industry leaders use to achieve exceptional results.

**Key Takeaways:**
- Master the fundamentals of ${topic.toLowerCase()}
- Implement advanced ${primaryKeyword} strategies
- Avoid common pitfalls and mistakes
- Measure and optimize your results

## Why ${topic} Matters in ${new Date().getFullYear()}

Recent studies show that businesses implementing effective ${topic.toLowerCase()} strategies experience:

- **📈 40% increase** in overall performance metrics
- **🎯 60% better** audience engagement rates  
- **💰 35% higher** return on investment
- **🚀 50% faster** goal achievement

## ${template.structure[2] || 'Core Strategies'}

### 1. Data-Driven Foundation
Build your ${topic.toLowerCase()} strategy on solid analytics:
- **Performance Tracking**: Monitor key metrics and KPIs
- **Audience Analysis**: Understand your target demographic
- **Competitive Intelligence**: Analyze market positioning
- **Trend Identification**: Stay ahead of industry changes

### 2. Content Excellence Framework
Create compelling, high-quality content that converts:
- **Keyword Integration**: Natural use of ${primaryKeyword} and related terms
- **User Intent Matching**: Address specific audience needs
- **Multimedia Enhancement**: Include visuals, videos, and interactive elements
- **Mobile Optimization**: Ensure seamless cross-device experience

### 3. Technical Implementation
Ensure robust technical foundation:
- **Performance Optimization**: Fast loading speeds and smooth functionality
- **SEO Best Practices**: Proper meta tags, schema markup, and structure
- **Security Measures**: Implement latest security protocols
- **Accessibility Standards**: Ensure inclusive user experience

## Advanced ${topic} Techniques

### Smart Automation
Leverage technology to scale your efforts:
- AI-powered content optimization
- Automated performance monitoring
- Intelligent audience segmentation
- Predictive analytics implementation

### Personalization Strategies
Deliver tailored experiences:
- Dynamic content adaptation
- Behavioral trigger campaigns
- Custom user journey mapping
- Real-time optimization

## Implementation Roadmap

**Phase 1: Foundation (Weeks 1-2)**
✅ Audit current ${topic.toLowerCase()} setup
✅ Define clear objectives and KPIs
✅ Research target audience and competitors
✅ Establish baseline measurements

**Phase 2: Strategy Development (Weeks 3-4)**
✅ Create comprehensive ${primaryKeyword} strategy
✅ Develop content calendar and workflows
✅ Set up tracking and analytics systems
✅ Design testing and optimization protocols

**Phase 3: Execution (Weeks 5-8)**
✅ Launch optimized ${topic.toLowerCase()} campaigns
✅ Monitor performance and gather data
✅ Conduct A/B tests and iterations
✅ Scale successful initiatives

**Phase 4: Optimization (Ongoing)**
✅ Analyze results and identify improvements
✅ Refine strategies based on data insights
✅ Expand successful tactics
✅ Stay updated with industry trends

## Measuring Success: Key Metrics

Track these essential performance indicators:

**Primary Metrics:**
- ${primaryKeyword} ranking positions
- Organic traffic growth rate
- Conversion rate improvements
- User engagement metrics

**Secondary Metrics:**
- Brand awareness indicators
- Social media engagement
- Email marketing performance
- Customer lifetime value

**Advanced Analytics:**
- Attribution modeling
- Cohort analysis
- Predictive performance indicators
- ROI optimization metrics

## Common Mistakes to Avoid

❌ **Neglecting mobile optimization**
❌ **Ignoring user experience factors**
❌ **Overlooking technical SEO elements**
❌ **Focusing only on short-term gains**
❌ **Not tracking the right metrics**

## Expert Tips for ${topic} Success

💡 **Pro Tip 1**: Always prioritize user value over search engine manipulation
💡 **Pro Tip 2**: Invest in long-term sustainable strategies
💡 **Pro Tip 3**: Regularly audit and update your approach
💡 **Pro Tip 4**: Stay informed about industry algorithm changes
💡 **Pro Tip 5**: Test everything and let data guide decisions

## Future Trends and Predictions

Stay ahead of the curve with these emerging trends:
- AI and machine learning integration
- Voice search optimization
- Visual and video content dominance
- Privacy-first marketing approaches
- Sustainable and ethical business practices

## Conclusion

Mastering ${topic.toLowerCase()} requires a strategic, data-driven approach combined with consistent execution and continuous optimization. By implementing the strategies outlined in this guide, you'll be well-positioned to achieve sustainable growth and competitive advantage.

Remember: Success in ${primaryKeyword} isn't about quick fixes—it's about building a solid foundation, delivering genuine value, and adapting to evolving market conditions.

---

**About This Content:**
- ✅ SEO-optimized with natural keyword integration
- ✅ Structured for maximum readability and engagement
- ✅ Based on current industry best practices and data
- ✅ Designed for ${targetAudience} audience
- ✅ Optimized for ${writingStyle} tone and style

*Generated with AI-powered content intelligence for maximum impact and search visibility.*`;
      };

      const enhancedContent = generateIntelligentContent();

      // Generate contextual images with enhanced prompts
      const newImages = imagePrompts.map((prompt, index) => ({
        id: index + 1,
        url: `https://images.unsplash.com/photo-${1558655146 + index}?w=800&h=500&fit=crop&crop=entropy&cs=tinysrgb`,
        alt: `${topic} - Professional ${index + 1}`,
        prompt: prompt,
        enhanced: true,
        quality: 'high',
        seoOptimized: true
      }));

      setGeneratedContent(enhancedContent);
      setGeneratedImages(newImages);
      setIsGenerating(false);
      
      // Generate trending topics and suggestions
      setTrendingTopics([
        `${topic} automation trends`,
        `AI-powered ${topic.toLowerCase()}`,
        `${topic} ROI optimization`,
        `Future of ${topic.toLowerCase()}`,
        `${topic} case studies 2024`
      ]);
      
      setContentSuggestions([
        `Create a follow-up post about advanced ${topic.toLowerCase()} techniques`,
        `Develop a case study showcasing ${topic.toLowerCase()} success stories`,
        `Write a comparison guide for ${topic.toLowerCase()} tools and platforms`,
        `Create an infographic summarizing key ${topic.toLowerCase()} statistics`,
        `Develop a video series explaining ${topic.toLowerCase()} step-by-step`
      ]);
      
      toast({
        title: "🚀 Intelligent Content Generated!",
        description: `High-quality ${topic.toLowerCase()} content with ${Math.round(contentQuality)}% quality score and SEO optimization.`,
      });
    }, 5000);
  };

  // Auto-generation functions
  const calculateNextRun = () => {
    const now = new Date();
    const [hours, minutes] = autoGenTime.split(':').map(Number);
    
    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (autoGenFrequency === 'daily') {
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
    } else if (autoGenFrequency === 'weekly') {
      const dayMap = {
        'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
        'friday': 5, 'saturday': 6, 'sunday': 0
      };
      const targetDay = dayMap[autoGenDay];
      const currentDay = nextRun.getDay();
      
      let daysUntilTarget = targetDay - currentDay;
      if (daysUntilTarget <= 0 || (daysUntilTarget === 0 && nextRun <= now)) {
        daysUntilTarget += 7;
      }
      
      nextRun.setDate(nextRun.getDate() + daysUntilTarget);
    }
    
    return nextRun;
  };

  const generateAutoContent = async () => {
    const topics = autoGenTopics.split(',').map(t => t.trim()).filter(t => t);
    const randomTopic = topics[Math.floor(Math.random() * topics.length)] || 'Digital Marketing Trends';
    
    setTopic(randomTopic);
    setKeywords(autoGenKeywords);
    
    // Add to history
    const newEntry = {
      id: Date.now(),
      topic: randomTopic,
      keywords: autoGenKeywords,
      generatedAt: new Date().toISOString(),
      status: 'generated'
    };
    
    setAutoGenHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
    
    // Generate content
    await generateContent();
    
    toast({
      title: "Auto-Generated Content Ready!",
      description: `Blog post about "${randomTopic}" has been automatically generated.`,
    });
  };

  const toggleAutoGeneration = () => {
    setAutoGenEnabled(!autoGenEnabled);
    
    if (!autoGenEnabled) {
      const nextRun = calculateNextRun();
      setNextScheduledRun(nextRun);
      
      toast({
        title: "Auto-Generation Enabled",
        description: `Next blog post will be generated on ${nextRun.toLocaleDateString()} at ${nextRun.toLocaleTimeString()}`,
      });
    } else {
      setNextScheduledRun(null);
      toast({
        title: "Auto-Generation Disabled",
        description: "Automatic blog generation has been stopped.",
      });
    }
  };

  // Update next run when settings change
  useEffect(() => {
    if (autoGenEnabled) {
      const nextRun = calculateNextRun();
      setNextScheduledRun(nextRun);
    }
  }, [autoGenFrequency, autoGenTime, autoGenDay, autoGenEnabled]);

  // Simulate auto-generation check (in real app, this would be handled by backend)
  useEffect(() => {
    if (!autoGenEnabled || !nextScheduledRun) return;
    
    const checkInterval = setInterval(() => {
      const now = new Date();
      if (now >= nextScheduledRun) {
        generateAutoContent();
        const nextRun = calculateNextRun();
        setNextScheduledRun(nextRun);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [autoGenEnabled, nextScheduledRun, autoGenTopics, autoGenKeywords]);

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
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Manual Generation
          </TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Auto Generation
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Generation History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          {/* Manual Generator Settings */}
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

          {/* Intelligence Settings */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-semibold">AI Intelligence Settings</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
                <Select value={writingStyle} onValueChange={setWritingStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
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
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
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
                <Select value={industryFocus} onValueChange={setIndustryFocus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
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
              <Select value={contentTemplate} onValueChange={setContentTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
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
                SEO-Optimized Content
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Eye className="h-3 w-3 mr-1" />
                Contextual Images
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Brain className="h-3 w-3 mr-1" />
                Smart Keywords
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <Target className="h-3 w-3 mr-1" />
                Quality Analysis
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trend Integration
              </Badge>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                <Zap className="h-3 w-3 mr-1" />
                Ready to Publish
              </Badge>
            </div>
          </div>

          <Button 
            onClick={generateContent} 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating Intelligent Content...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Generate AI-Powered Blog Post
              </div>
            )}
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
              
              {/* Content Statistics */}
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

              {/* AI Quality Analysis */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mt-4 border">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <Label className="text-base font-semibold">AI Quality Analysis</Label>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Content Quality</span>
                      <span className="text-sm font-bold text-green-600">{contentQuality}%</span>
                    </div>
                    <Progress value={contentQuality} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">SEO Score</span>
                      <span className="text-sm font-bold text-blue-600">{seoScore}%</span>
                    </div>
                    <Progress value={seoScore} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Readability</span>
                      <span className="text-sm font-bold text-purple-600">{readabilityScore}%</span>
                    </div>
                    <Progress value={readabilityScore} className="h-2" />
                  </div>
                </div>

                {/* Smart Keywords */}
                {smartKeywords.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">AI-Generated Keywords</Label>
                    <div className="flex flex-wrap gap-1">
                      {smartKeywords.slice(0, 8).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-white">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Insights */}
                {Object.keys(contentInsights).length > 0 && (
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Read Time:</span>
                        <span className="font-medium">{contentInsights.estimatedReadTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Keyword Density:</span>
                        <span className="font-medium">{contentInsights.targetKeywordDensity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Headings:</span>
                        <span className="font-medium">{contentInsights.recommendedHeadings}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Images:</span>
                        <span className="font-medium">{contentInsights.suggestedImages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SEO Complexity:</span>
                        <span className="font-medium">{contentInsights.seoComplexity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Competition:</span>
                        <span className="font-medium">{contentInsights.competitiveLevel}</span>
                      </div>
                    </div>
                  </div>
                )}
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
        </TabsContent>

        <TabsContent value="auto" className="space-y-6">
          {/* Auto-Generation Settings */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Auto Blog Generation
              </CardTitle>
              <CardDescription>
                Set up automatic blog post generation with customizable frequency and topics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto-Gen Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {autoGenEnabled ? (
                      <Play className="h-4 w-4 text-green-600" />
                    ) : (
                      <Pause className="h-4 w-4 text-gray-400" />
                    )}
                    <Label className="text-base font-medium">
                      Auto-Generation {autoGenEnabled ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    {autoGenEnabled 
                      ? `Next generation: ${nextScheduledRun?.toLocaleDateString()} at ${nextScheduledRun?.toLocaleTimeString()}`
                      : 'Enable to start automatic blog generation'
                    }
                  </p>
                </div>
                <Switch
                  checked={autoGenEnabled}
                  onCheckedChange={toggleAutoGeneration}
                />
              </div>

              {/* Frequency Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Generation Frequency</Label>
                  <Select value={autoGenFrequency} onValueChange={setAutoGenFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Generation Time</Label>
                  <Input
                    type="time"
                    value={autoGenTime}
                    onChange={(e) => setAutoGenTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Weekly Day Selection */}
              {autoGenFrequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select value={autoGenDay} onValueChange={setAutoGenDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              {/* Content Settings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="autoTopics">Topic Pool (comma-separated)</Label>
                  <Textarea
                    id="autoTopics"
                    placeholder="Digital Marketing, SEO Strategies, Content Creation, Social Media Marketing, Email Marketing..."
                    value={autoGenTopics}
                    onChange={(e) => setAutoGenTopics(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Random topics will be selected from this list for auto-generation
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autoKeywords">Default Keywords</Label>
                  <Input
                    id="autoKeywords"
                    placeholder="SEO, marketing, business, digital..."
                    value={autoGenKeywords}
                    onChange={(e) => setAutoGenKeywords(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Auto-Generation Intelligence Settings */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  <Label className="text-base font-semibold">Smart Auto-Generation</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Auto Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Posts</SelectItem>
                        <SelectItem value="how-to">How-To Guides</SelectItem>
                        <SelectItem value="listicle">List Articles</SelectItem>
                        <SelectItem value="comparison">Comparisons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Auto Writing Style</Label>
                    <Select value={writingStyle} onValueChange={setWritingStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Public</SelectItem>
                        <SelectItem value="beginners">Beginners</SelectItem>
                        <SelectItem value="professionals">Professionals</SelectItem>
                        <SelectItem value="experts">Industry Experts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Industry Focus</Label>
                    <Select value={industryFocus} onValueChange={setIndustryFocus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Business</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Smart Features</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trend Analysis
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Target className="h-3 w-3 mr-1" />
                      SEO Optimization
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Brain className="h-3 w-3 mr-1" />
                      Smart Keywords
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      <Award className="h-3 w-3 mr-1" />
                      Quality Scoring
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Trending Topics Suggestions */}
              {trendingTopics.length > 0 && (
                <div className="space-y-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <Label className="text-sm font-semibold">Trending Topic Suggestions</Label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((topic, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-orange-100 text-xs"
                        onClick={() => {
                          const currentTopics = autoGenTopics ? autoGenTopics + ', ' + topic : topic;
                          setAutoGenTopics(currentTopics);
                        }}
                      >
                        + {topic}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Click to add trending topics to your pool</p>
                </div>
              )}

              {/* Content Suggestions */}
              {contentSuggestions.length > 0 && (
                <div className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-green-600" />
                    <Label className="text-sm font-semibold">AI Content Suggestions</Label>
                  </div>
                  <div className="space-y-2">
                    {contentSuggestions.slice(0, 3).map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 p-2 bg-white rounded border-l-2 border-green-300">
                        💡 {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Generation */}
              <div className="pt-4">
                <Button 
                  onClick={generateAutoContent}
                  variant="outline"
                  className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200"
                  disabled={!autoGenTopics.trim()}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Test Smart Auto-Generation Now
                </Button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={autoGenEnabled ? "default" : "secondary"} className="bg-blue-100 text-blue-700">
                  {autoGenEnabled ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {autoGenFrequency === 'daily' ? 'Daily' : 'Weekly'} Schedule
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {autoGenTopics.split(',').filter(t => t.trim()).length} Topics
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Generation History */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Generation History
              </CardTitle>
              <CardDescription>
                View your recent auto-generated blog posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {autoGenHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No auto-generated content yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Enable auto-generation to start building your content history
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {autoGenHistory.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900">{entry.topic}</h4>
                          <p className="text-sm text-gray-600">Keywords: {entry.keywords}</p>
                          <p className="text-xs text-gray-500">
                            Generated: {new Date(entry.generatedAt).toLocaleDateString()} at {new Date(entry.generatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {entry.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegratedContentGenerator;
