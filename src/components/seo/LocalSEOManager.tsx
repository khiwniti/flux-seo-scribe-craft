
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Phone, Globe, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LocalSEOManager = () => {
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [localData, setLocalData] = useState(null);
  const { toast } = useToast();

  const optimizeLocalSEO = async () => {
    if (!businessName.trim()) return;
    
    setIsOptimizing(true);
    
    // Simulate local SEO analysis
    setTimeout(() => {
      setLocalData({
        googleRating: 4.3,
        totalReviews: 127,
        listings: [
          { platform: 'Google My Business', status: 'verified', score: 85 },
          { platform: 'Yelp', status: 'claimed', score: 78 },
          { platform: 'Facebook', status: 'active', score: 82 },
          { platform: 'Yellow Pages', status: 'pending', score: 45 }
        ],
        citations: {
          total: 42,
          consistent: 38,
          inconsistent: 4
        },
        keywords: [
          { keyword: `${businessName} near me`, position: 3, volume: 1200 },
          { keyword: `best ${businessName.toLowerCase()}`, position: 7, volume: 800 },
          { keyword: `${businessName} reviews`, position: 12, volume: 450 }
        ],
        competitors: [
          { name: 'Local Competitor A', rating: 4.1, reviews: 89 },
          { name: 'Local Competitor B', rating: 4.5, reviews: 156 },
          { name: 'Local Competitor C', rating: 3.9, reviews: 67 }
        ]
      });
      setIsOptimizing(false);
      
      toast({
        title: "Local SEO Analysis Complete!",
        description: "Your local presence has been analyzed with optimization recommendations"
      });
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700';
      case 'claimed': return 'bg-blue-100 text-blue-700';
      case 'active': return 'bg-purple-100 text-purple-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Local SEO Manager
        </CardTitle>
        <CardDescription>
          Optimize your local search presence and manage business listings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Business Name</label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Business Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Business Address</label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, City, State 12345"
            rows={2}
          />
        </div>

        <Button 
          onClick={optimizeLocalSEO} 
          disabled={isOptimizing || !businessName.trim()}
          className="w-full"
        >
          <Globe className="h-4 w-4 mr-2" />
          {isOptimizing ? 'Analyzing...' : 'Optimize Local SEO'}
        </Button>

        {localData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold text-yellow-600">
                      {localData.googleRating}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Google Rating</div>
                  <div className="text-xs text-gray-500">
                    {localData.totalReviews} reviews
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {localData.citations.consistent}/{localData.citations.total}
                  </div>
                  <div className="text-sm text-gray-600">Consistent Citations</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {localData.listings.filter(l => l.status === 'verified').length}
                  </div>
                  <div className="text-sm text-gray-600">Verified Listings</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="keywords">Local Keywords</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-4">
                <div className="space-y-3">
                  {localData.listings.map((listing, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{listing.platform}</div>
                        <div className="text-sm text-gray-600">Score: {listing.score}%</div>
                      </div>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <div className="space-y-3">
                  {localData.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{keyword.keyword}</div>
                        <div className="text-sm text-gray-600">
                          Volume: {keyword.volume}/month
                        </div>
                      </div>
                      <Badge variant={keyword.position <= 5 ? 'default' : 'secondary'}>
                        #{keyword.position}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="competitors" className="space-y-4">
                <div className="space-y-3">
                  {localData.competitors.map((competitor, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{competitor.name}</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{competitor.rating}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {competitor.reviews} reviews
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

export default LocalSEOManager;
