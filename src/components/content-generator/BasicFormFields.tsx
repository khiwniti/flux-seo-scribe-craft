
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicFormFieldsProps {
  topic: string;
  setTopic: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  wordCount: string;
  setWordCount: (value: string) => void;
  isGenerating: boolean;
}

const BasicFormFields = ({
  topic,
  setTopic,
  keywords,
  setKeywords,
  tone,
  setTone,
  wordCount,
  setWordCount,
  isGenerating
}: BasicFormFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default BasicFormFields;
