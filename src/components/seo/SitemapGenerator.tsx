
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { FileText, Download, Globe, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SitemapGenerator = () => {
  const [domain, setDomain] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemap, setSitemap] = useState(null);
  const [settings, setSettings] = useState({
    includeImages: true,
    includeNews: false,
    includeVideos: true,
    priority: 'auto',
    changeFreq: 'weekly'
  });
  const { toast } = useToast();

  const generateSitemap = async () => {
    if (!domain.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate sitemap generation
    setTimeout(() => {
      setSitemap({
        totalUrls: 247,
        lastGenerated: new Date().toISOString(),
        pages: [
          { url: '/', priority: 1.0, changefreq: 'daily', lastmod: '2024-01-15' },
          { url: '/about', priority: 0.8, changefreq: 'monthly', lastmod: '2024-01-10' },
          { url: '/services', priority: 0.9, changefreq: 'weekly', lastmod: '2024-01-12' },
          { url: '/blog', priority: 0.8, changefreq: 'weekly', lastmod: '2024-01-14' },
          { url: '/contact', priority: 0.7, changefreq: 'monthly', lastmod: '2024-01-05' }
        ],
        images: 45,
        videos: 12,
        errors: [
          { url: '/old-page', issue: '404 Not Found' },
          { url: '/temp-page', issue: 'Redirect Loop' }
        ]
      });
      setIsGenerating(false);
      
      toast({
        title: "Sitemap Generated!",
        description: `Successfully created sitemap with ${247} URLs`
      });
    }, 2000);
  };

  const downloadSitemap = () => {
    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.pages.map(page => `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sitemap Downloaded!",
      description: "sitemap.xml has been saved to your downloads"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Smart Sitemap Generator
        </CardTitle>
        <CardDescription>
          Generate and manage XML sitemaps with intelligent optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Website URL</label>
          <Input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sitemap Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Include Images</span>
              <Switch
                checked={settings.includeImages}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, includeImages: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Include Videos</span>
              <Switch
                checked={settings.includeVideos}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, includeVideos: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Include News</span>
              <Switch
                checked={settings.includeNews}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, includeNews: checked }))
                }
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={generateSitemap} 
          disabled={isGenerating || !domain.trim()}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Sitemap'}
        </Button>

        {sitemap && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {sitemap.totalUrls}
                  </div>
                  <div className="text-sm text-gray-600">Total URLs</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sitemap.images}
                  </div>
                  <div className="text-sm text-gray-600">Images</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {sitemap.videos}
                  </div>
                  <div className="text-sm text-gray-600">Videos</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {sitemap.errors.length}
                  </div>
                  <div className="text-sm text-gray-600">Errors</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sitemap Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {sitemap.pages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{page.url}</div>
                        <div className="text-xs text-gray-500">
                          Last modified: {page.lastmod}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {page.changefreq}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {page.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {sitemap.errors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">Errors Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sitemap.errors.map((error, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div className="font-medium text-sm">{error.url}</div>
                        <Badge variant="destructive" className="text-xs">
                          {error.issue}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button onClick={downloadSitemap} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download XML
              </Button>
              <Button variant="outline" className="flex-1">
                <Globe className="h-4 w-4 mr-2" />
                Submit to Search Engines
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SitemapGenerator;
