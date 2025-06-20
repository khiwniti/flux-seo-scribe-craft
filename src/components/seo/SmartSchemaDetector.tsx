
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Code, Wand2, Copy, Check, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartSchemaDetectorProps {
  content?: string;
  url?: string;
}

const SmartSchemaDetector = ({ content = '', url = '' }: SmartSchemaDetectorProps) => {
  const [detectedType, setDetectedType] = useState('');
  const [generatedSchema, setGeneratedSchema] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (content && content.length > 50) {
      analyzeContentForSchema();
    }
  }, [content]);

  const analyzeContentForSchema = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI content analysis for schema detection
    setTimeout(() => {
      const contentLower = content.toLowerCase();
      let schemaType = 'Article';
      let detectedReason = '';
      
      // Smart schema type detection
      if (contentLower.includes('recipe') || contentLower.includes('ingredients') || contentLower.includes('cooking')) {
        schemaType = 'Recipe';
        detectedReason = 'Recipe content detected';
      } else if (contentLower.includes('review') || contentLower.includes('rating') || contentLower.includes('stars')) {
        schemaType = 'Review';
        detectedReason = 'Review content detected';
      } else if (contentLower.includes('event') || contentLower.includes('date') || contentLower.includes('location')) {
        schemaType = 'Event';
        detectedReason = 'Event information detected';
      } else if (contentLower.includes('product') || contentLower.includes('price') || contentLower.includes('buy')) {
        schemaType = 'Product';
        detectedReason = 'Product information detected';
      } else if (contentLower.includes('how to') || contentLower.includes('tutorial') || contentLower.includes('guide')) {
        schemaType = 'HowTo';
        detectedReason = 'Tutorial/guide content detected';
      } else if (contentLower.includes('faq') || contentLower.includes('question') || contentLower.includes('answer')) {
        schemaType = 'FAQPage';
        detectedReason = 'FAQ content detected';
      } else {
        detectedReason = 'General article content detected';
      }
      
      setDetectedType(schemaType);
      generateSchema(schemaType);
      setIsAnalyzing(false);
      
      toast({
        title: "Schema Type Detected!",
        description: `${detectedReason}: ${schemaType}`
      });
    }, 2000);
  };

  const generateSchema = (type: string) => {
    const title = content.split('\n')[0] || content.split('.')[0] || 'Untitled Content';
    const description = content.split('.').slice(0, 2).join('.') || content.substring(0, 160);
    
    let schema = {};
    
    switch (type) {
      case 'Recipe':
        schema = {
          "@context": "https://schema.org/",
          "@type": "Recipe",
          "name": title,
          "description": description,
          "author": {
            "@type": "Person",
            "name": "Author Name"
          },
          "datePublished": new Date().toISOString().split('T')[0],
          "recipeIngredient": ["Auto-detected from content"],
          "recipeInstructions": [{
            "@type": "HowToStep",
            "text": "Follow the instructions in the content"
          }]
        };
        break;
      case 'Review':
        schema = {
          "@context": "https://schema.org/",
          "@type": "Review",
          "itemReviewed": {
            "@type": "Thing",
            "name": title
          },
          "author": {
            "@type": "Person",
            "name": "Author Name"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": description
        };
        break;
      case 'HowTo':
        schema = {
          "@context": "https://schema.org/",
          "@type": "HowTo",
          "name": title,
          "description": description,
          "step": [{
            "@type": "HowToStep",
            "text": "Follow the detailed steps in the content"
          }]
        };
        break;
      case 'Event':
        schema = {
          "@context": "https://schema.org/",
          "@type": "Event",
          "name": title,
          "description": description,
          "startDate": new Date().toISOString(),
          "location": {
            "@type": "Place",
            "name": "Event Location"
          }
        };
        break;
      case 'Product':
        schema = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": title,
          "description": description,
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          }
        };
        break;
      default:
        schema = {
          "@context": "https://schema.org/",
          "@type": "Article",
          "headline": title,
          "description": description,
          "author": {
            "@type": "Person",
            "name": "Author Name"
          },
          "datePublished": new Date().toISOString(),
          "publisher": {
            "@type": "Organization",
            "name": "Publisher Name"
          }
        };
    }
    
    setGeneratedSchema(JSON.stringify(schema, null, 2));
  };

  const copySchema = () => {
    const schemaHtml = `<script type="application/ld+json">
${generatedSchema}
</script>`;
    
    navigator.clipboard.writeText(schemaHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Schema markup copied to clipboard"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Smart Schema Detector
          <Eye className="h-4 w-4 text-blue-500" />
        </CardTitle>
        <CardDescription>
          AI automatically detects content type and generates appropriate schema markup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {content && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wand2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {isAnalyzing ? 'Analyzing Content...' : 'Content Analyzed'}
                  </span>
                </div>
                {!isAnalyzing && detectedType && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600">Detected Type:</span>
                    <Badge className="bg-green-100 text-green-700">
                      {detectedType}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {generatedSchema && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Generated Schema Markup</h3>
              <Badge variant="secondary">JSON-LD</Badge>
            </div>
            
            <div className="relative">
              <Textarea
                value={generatedSchema}
                readOnly
                rows={12}
                className="font-mono text-xs bg-gray-50"
              />
            </div>

            <Button onClick={copySchema} className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Schema HTML'}
            </Button>

            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
              <strong>Usage:</strong> Paste this code in your HTML &lt;head&gt; section or before the &lt;/body&gt; tag
            </div>
          </div>
        )}

        {content && !generatedSchema && !isAnalyzing && (
          <Button onClick={analyzeContentForSchema} className="w-full" variant="outline">
            <Wand2 className="h-4 w-4 mr-2" />
            Analyze Content for Schema
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSchemaDetector;
