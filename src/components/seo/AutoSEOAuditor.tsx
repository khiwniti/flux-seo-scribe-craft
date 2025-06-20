
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, AlertCircle, CheckCircle, Clock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AutoSEOAuditor = () => {
  const [url, setUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState(null);
  const { toast } = useToast();

  const runAudit = async () => {
    if (!url.trim()) return;
    
    setIsAuditing(true);
    
    // Simulate comprehensive SEO audit
    setTimeout(() => {
      setAuditResults({
        overallScore: 78,
        performance: {
          score: 85,
          issues: [
            { type: 'warning', text: 'Image optimization needed', impact: 'medium' },
            { type: 'info', text: 'Consider using WebP format', impact: 'low' }
          ]
        },
        seo: {
          score: 82,
          issues: [
            { type: 'error', text: 'Missing meta description on 3 pages', impact: 'high' },
            { type: 'warning', text: 'H1 tag optimization needed', impact: 'medium' }
          ]
        },
        accessibility: {
          score: 90,
          issues: [
            { type: 'warning', text: 'Alt text missing on some images', impact: 'medium' }
          ]
        },
        technical: {
          score: 75,
          issues: [
            { type: 'error', text: 'Broken internal links detected', impact: 'high' },
            { type: 'warning', text: 'SSL certificate expires soon', impact: 'high' }
          ]
        }
      });
      setIsAuditing(false);
      
      toast({
        title: "SEO Audit Complete!",
        description: "Comprehensive analysis finished with actionable insights"
      });
    }, 3000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Auto SEO Auditor
        </CardTitle>
        <CardDescription>
          Comprehensive automated SEO audit with intelligent recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1"
          />
          <Button onClick={runAudit} disabled={isAuditing || !url.trim()}>
            <Globe className="h-4 w-4 mr-2" />
            {isAuditing ? 'Auditing...' : 'Run Audit'}
          </Button>
        </div>

        {auditResults && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6 text-center">
                <div className={`text-4xl font-bold ${getScoreColor(auditResults.overallScore)} mb-2`}>
                  {auditResults.overallScore}%
                </div>
                <div className="text-lg font-medium text-gray-700">Overall SEO Score</div>
                <Progress value={auditResults.overallScore} className="mt-4 max-w-xs mx-auto" />
              </CardContent>
            </Card>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Performance Score</h3>
                  <Badge className={getScoreColor(auditResults.performance.score)}>
                    {auditResults.performance.score}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  {auditResults.performance.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <span className="text-sm font-medium">{issue.text}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {issue.impact} impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">SEO Score</h3>
                  <Badge className={getScoreColor(auditResults.seo.score)}>
                    {auditResults.seo.score}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  {auditResults.seo.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <span className="text-sm font-medium">{issue.text}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {issue.impact} impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Accessibility Score</h3>
                  <Badge className={getScoreColor(auditResults.accessibility.score)}>
                    {auditResults.accessibility.score}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  {auditResults.accessibility.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <span className="text-sm font-medium">{issue.text}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {issue.impact} impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Technical Score</h3>
                  <Badge className={getScoreColor(auditResults.technical.score)}>
                    {auditResults.technical.score}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  {auditResults.technical.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <span className="text-sm font-medium">{issue.text}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {issue.impact} impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoSEOAuditor;
