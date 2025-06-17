
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart3, TrendingUp, Globe, Search, Lightbulb, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdvancedSEOAnalytics = () => {
  const [url, setUrl] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const performanceData = [
    { name: 'Jan', score: 65, traffic: 1200, rankings: 15 },
    { name: 'Feb', score: 68, traffic: 1350, rankings: 18 },
    { name: 'Mar', score: 72, traffic: 1500, rankings: 22 },
    { name: 'Apr', score: 75, traffic: 1680, rankings: 28 },
    { name: 'May', score: 78, traffic: 1820, rankings: 35 },
    { name: 'Jun', score: 82, traffic: 2100, rankings: 42 },
  ];

  const competitorData = [
    { name: 'Your Site', score: 78, color: '#8884d8' },
    { name: 'Competitor A', score: 85, color: '#82ca9d' },
    { name: 'Competitor B', score: 72, color: '#ffc658' },
    { name: 'Competitor C', score: 68, color: '#ff7300' },
  ];

  const seoAdvice = [
    {
      category: 'Content Strategy',
      priority: 'high',
      tips: [
        'Create pillar content around your main keywords',
        'Develop topic clusters for better content organization',
        'Update old content with fresh information and keywords',
        'Use long-tail keywords for better conversion rates'
      ]
    },
    {
      category: 'Technical SEO',
      priority: 'high',
      tips: [
        'Implement Core Web Vitals optimization',
        'Add structured data markup for rich snippets',
        'Optimize image compression and lazy loading',
        'Set up proper internal linking structure'
      ]
    },
    {
      category: 'Link Building',
      priority: 'medium',
      tips: [
        'Create linkable assets (infographics, research)',
        'Guest posting on relevant industry sites',
        'Build relationships with industry influencers',
        'Monitor and reclaim broken backlinks'
      ]
    },
    {
      category: 'Local SEO',
      priority: 'medium',
      tips: [
        'Optimize Google My Business profile',
        'Build local citations consistently',
        'Encourage customer reviews and respond to them',
        'Create location-specific landing pages'
      ]
    }
  ];

  const analyzeWebsite = () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);
    
    setTimeout(() => {
      setMetrics({
        overallScore: 78,
        contentScore: 82,
        technicalScore: 75,
        backlinksScore: 68,
        userExperienceScore: 85,
        organicTraffic: 2100,
        keywordRankings: 45,
        backlinks: 127,
        domainAuthority: 42,
        coreWebVitals: {
          lcp: 2.1,
          fid: 85,
          cls: 0.08
        },
        opportunities: [
          { type: 'content', title: 'Missing H1 tags on 3 pages', impact: 'high', effort: 'low' },
          { type: 'technical', title: 'Slow loading images', impact: 'medium', effort: 'medium' },
          { type: 'links', title: 'Opportunity for 15 new backlinks', impact: 'high', effort: 'high' },
          { type: 'keywords', title: '12 keywords close to page 1', impact: 'medium', effort: 'medium' }
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Advanced SEO Analytics & Professional Advice
          </CardTitle>
          <CardDescription>
            Get comprehensive SEO analysis with expert optimization recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="website-url">Website URL</Label>
              <Input
                id="website-url"
                placeholder="https://staging.uptowntrading.co.th"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={analyzeWebsite} 
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAnalyzing ? 'Analyzing...' : 'Deep Analysis'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional SEO Advice - Always Visible */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-600" />
            Professional SEO Optimization Strategies
          </CardTitle>
          <CardDescription>
            Expert advice from professional SEO optimizers for blog-driven SEO success
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {seoAdvice.map((category, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">{category.category}</h4>
                <Badge className={getPriorityColor(category.priority)}>
                  {category.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
              <div className="grid gap-3">
                {category.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {metrics && (
        <>
          {/* Enhanced Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Overall SEO</p>
                    <p className="text-2xl font-bold text-blue-800">{metrics.overallScore}%</p>
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
                    <p className="text-sm font-medium text-green-600">Content Quality</p>
                    <p className="text-2xl font-bold text-green-800">{metrics.contentScore}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <Progress value={metrics.contentScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Technical SEO</p>
                    <p className="text-2xl font-bold text-purple-800">{metrics.technicalScore}%</p>
                  </div>
                  <Search className="h-8 w-8 text-purple-600" />
                </div>
                <Progress value={metrics.technicalScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">User Experience</p>
                    <p className="text-2xl font-bold text-orange-800">{metrics.userExperienceScore}%</p>
                  </div>
                  <Globe className="h-8 w-8 text-orange-600" />
                </div>
                <Progress value={metrics.userExperienceScore} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>SEO Performance Trends</CardTitle>
              <CardDescription>
                Track your SEO improvements over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} name="SEO Score" />
                  <Line type="monotone" dataKey="traffic" stroke="#82ca9d" strokeWidth={2} name="Organic Traffic" />
                  <Line type="monotone" dataKey="rankings" stroke="#ffc658" strokeWidth={2} name="Top 10 Keywords" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* SEO Opportunities */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                SEO Optimization Opportunities
              </CardTitle>
              <CardDescription>
                Prioritized action items for maximum SEO impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getImpactIcon(opportunity.impact)}
                      <div>
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {opportunity.type} optimization • {opportunity.impact} impact • {opportunity.effort} effort
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {opportunity.impact} Impact
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitor Comparison */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
              <CardDescription>
                See how you stack up against competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={competitorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdvancedSEOAnalytics;
