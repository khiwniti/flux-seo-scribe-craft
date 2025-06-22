
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye, Brain, Target, TrendingUp, Zap } from 'lucide-react';

const AIFeaturesBadges = () => {
  return (
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
  );
};

export default AIFeaturesBadges;
