
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface EnhancedAISettingsProps {
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
}

const EnhancedAISettings = ({
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
  isGenerating
}: EnhancedAISettingsProps) => {
  return (
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
  );
};

export default EnhancedAISettings;
