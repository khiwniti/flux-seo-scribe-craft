
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, ExternalLink, TrendingUp, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SmartLinkBuilder = () => {
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [linkData, setLinkData] = useState(null);
  const { toast } = useToast();

  const analyzeLinkProfile = async () => {
    if (!domain.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate link analysis
    setTimeout(() => {
      setLinkData({
        totalBacklinks: 1247,
        domainAuthority: 45,
        referringDomains: 234,
        internalLinks: [
          { url: '/blog/seo-guide', anchor: 'SEO Guide', strength: 'strong' },
          { url: '/services', anchor: 'Our Services', strength: 'medium' },
          { url: '/about', anchor: 'About Us', strength: 'weak' }
        ],
        opportunities: [
          { type: 'broken', url: '/old-page', suggestion: 'Fix broken internal link' },
          { type: 'missing', target: 'contact page', suggestion: 'Add internal link to contact from homepage' },
          { type: 'anchor', url: '/blog', suggestion: 'Optimize anchor text for better relevance' }
        ],
        potentialPartners: [
          { domain: 'industry-blog.com', authority: 65, relevance: 'high' },
          { domain: 'tech-news.com', authority: 72, relevance: 'medium' },
          { domain: 'startup-hub.com', authority: 58, relevance: 'high' }
        ]
      });
      setIsAnalyzing(false);
      
      toast({
        title: "Link Analysis Complete!",
        description: "Found link building opportunities and optimization suggestions"
      });
    }, 2500);
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  const getRelevanceColor = (relevance) => {
    switch (relevance) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Smart Link Builder
        </CardTitle>
        <CardDescription>
          AI-powered link building and internal link optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1"
          />
          <Button onClick={analyzeLinkProfile} disabled={isAnalyzing || !domain.trim()}>
            <Target className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Links'}
          </Button>
        </div>

        {linkData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {linkData.totalBacklinks.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Backlinks</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {linkData.domainAuthority}
                  </div>
                  <div className="text-sm text-gray-600">Domain Authority</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {linkData.referringDomains}
                  </div>
                  <div className="text-sm text-gray-600">Referring Domains</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="internal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="internal">Internal Links</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="partners">Link Partners</TabsTrigger>
              </TabsList>

              <TabsContent value="internal" className="space-y-4">
                <div className="space-y-3">
                  {linkData.internalLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{link.anchor}</div>
                        <div className="text-sm text-gray-600">{link.url}</div>
                      </div>
                      <Badge className={getStrengthColor(link.strength)}>
                        {link.strength}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <div className="space-y-3">
                  {linkData.opportunities.map((opp, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{opp.suggestion}</div>
                          {opp.url && (
                            <div className="text-sm text-gray-600 mt-1">
                              Target: {opp.url}
                            </div>
                          )}
                          <Badge variant="outline" className="mt-2">
                            {opp.type} issue
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="partners" className="space-y-4">
                <div className="space-y-3">
                  {linkData.potentialPartners.map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {partner.domain}
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600">
                          Authority: {partner.authority}
                        </div>
                      </div>
                      <Badge className={getRelevanceColor(partner.relevance)}>
                        {partner.relevance} relevance
                      </Badge>
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

export default SmartLinkBuilder;
