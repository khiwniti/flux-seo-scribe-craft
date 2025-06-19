
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Calendar, Play, Pause, Brain, TrendingUp, Target, Award, Settings, Lightbulb } from 'lucide-react';

interface AutoGenerationSettingsProps {
  autoGenEnabled: boolean;
  setAutoGenEnabled: (value: boolean) => void;
  autoGenFrequency: string;
  setAutoGenFrequency: (value: string) => void;
  autoGenTime: string;
  setAutoGenTime: (value: string) => void;
  autoGenDay: string;
  setAutoGenDay: (value: string) => void;
  autoGenTopics: string;
  setAutoGenTopics: (value: string) => void;
  autoGenKeywords: string;
  setAutoGenKeywords: (value: string) => void;
  nextScheduledRun: Date | null;
  contentType: string;
  setContentType: (value: string) => void;
  writingStyle: string;
  setWritingStyle: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  industryFocus: string;
  setIndustryFocus: (value: string) => void;
  trendingTopics: string[];
  contentSuggestions: string[];
  onToggleAutoGeneration: () => void;
  onGenerateAutoContent: () => void;
}

const AutoGenerationSettings = ({
  autoGenEnabled,
  autoGenFrequency,
  setAutoGenFrequency,
  autoGenTime,
  setAutoGenTime,
  autoGenDay,
  setAutoGenDay,
  autoGenTopics,
  setAutoGenTopics,
  autoGenKeywords,
  setAutoGenKeywords,
  nextScheduledRun,
  contentType,
  setContentType,
  writingStyle,
  setWritingStyle,
  targetAudience,
  setTargetAudience,
  industryFocus,
  setIndustryFocus,
  trendingTopics,
  contentSuggestions,
  onToggleAutoGeneration,
  onGenerateAutoContent
}: AutoGenerationSettingsProps) => {
  return (
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
            onCheckedChange={onToggleAutoGeneration}
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
            onClick={onGenerateAutoContent}
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
  );
};

export default AutoGenerationSettings;
