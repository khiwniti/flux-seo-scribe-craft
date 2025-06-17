
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Globe, Search, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SEOMetrics = () => {
  const [url, setUrl] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sample data for charts
  const performanceData = [
    { name: 'Jan', score: 65, traffic: 1200 },
    { name: 'Feb', score: 68, traffic: 1350 },
    { name: 'Mar', score: 72, traffic: 1500 },
    { name: 'Apr', score: 75, traffic: 1680 },
    { name: 'May', score: 78, traffic: 1820 },
    { name: 'Jun', score: 82, traffic: 2100 },
  ];

  const keywordData = [
    { keyword: 'digital marketing', position: 3, volume: 12000, difficulty: 65 },
    { keyword: 'SEO optimization', position: 7, volume: 8500, difficulty: 72 },
    { keyword: 'content strategy', position: 12, volume: 5400, difficulty: 58 },
    { keyword: 'blog writing', position: 5, volume: 3200, difficulty: 45 },
    { keyword: 'social media', position: 15, volume: 15000, difficulty: 78 },
  ];

  const analyzeWebsite = () => {
    if (!url.trim()) {
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setMetrics({
        overallScore: 78,
        pageSpeed: 85,
        mobileScore: 82,
        seoScore: 75,
        accessibility: 88,
        bestPractices: 92,
        organicTraffic: 2100,
        keywordRankings: 45,
        backlinks: 127,
        domainAuthority: 42,
        issues: [
          { type: 'warning', text: 'Page load time could be improved' },
          { type: 'error', text: 'Missing meta descriptions on 3 pages' },
          { type: 'info', text: 'Consider adding schema markup' },
          { type: 'warning', text: 'Some images lack alt text' },
        ]
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Website Analysis
          </CardTitle>
          <CardDescription>
            Enter your website URL to get comprehensive SEO metrics and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="website-url">Website URL</Label>
              <Input
                id="website-url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={analyzeWebsite} 
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {metrics && (
        <>
          {/* Core Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Overall Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                      {metrics.overallScore}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <Progress value={metrics.overallScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Page Speed</p>
                    <p className={`text-2xl font-bold ${getScoreColor(metrics.pageSpeed)}`}>
                      {metrics.pageSpeed}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <Progress value={metrics.pageSpeed} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">SEO Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(metrics.seoScore)}`}>
                      {metrics.seoScore}%
                    </p>
                  </div>
                  <Search className="h-8 w-8 text-purple-600" />
                </div>
                <Progress value={metrics.seoScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Mobile Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(metrics.mobileScore)}`}>
                      {metrics.mobileScore}%
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-orange-600" />
                </div>
                <Progress value={metrics.mobileScore} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>SEO Performance Trend</CardTitle>
              <CardDescription>
                Track your SEO score and organic traffic over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="SEO Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="traffic" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Traffic"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Keyword Rankings */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>
                Your current keyword positions and search volumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordData.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{keyword.keyword}</div>
                      <div className="text-sm text-gray-500">
                        Volume: {keyword.volume.toLocaleString()} | Difficulty: {keyword.difficulty}%
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={keyword.position <= 5 ? 'default' : keyword.position <= 10 ? 'secondary' : 'outline'}
                        className={
                          keyword.position <= 5 ? 'bg-green-100 text-green-700' :
                          keyword.position <= 10 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }
                      >
                        #{keyword.position}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Issues and Recommendations */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Issues & Recommendations</CardTitle>
              <CardDescription>
                Areas that need attention to improve your SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.issues.map((issue, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                    issue.type === 'error' ? 'bg-red-50 border border-red-200' :
                    issue.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      issue.type === 'error' ? 'bg-red-500' :
                      issue.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{issue.text}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SEOMetrics;
