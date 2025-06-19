
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Check, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SchemaMarkupGenerator = () => {
  const [language, setLanguage] = useState('en');
  const [schemaType, setSchemaType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [generatedSchema, setGeneratedSchema] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const schemaTypes = [
    { value: 'organization', label: language === 'th' ? 'องค์กร/บริษัท' : 'Organization/Company' },
    { value: 'local-business', label: language === 'th' ? 'ธุรกิจท้องถิ่น' : 'Local Business' },
    { value: 'restaurant', label: language === 'th' ? 'ร้านอาหาร' : 'Restaurant' },
    { value: 'article', label: language === 'th' ? 'บทความ' : 'Article' },
    { value: 'product', label: language === 'th' ? 'สินค้า' : 'Product' },
    { value: 'service', label: language === 'th' ? 'บริการ' : 'Service' },
    { value: 'event', label: language === 'th' ? 'งานอีเวนต์' : 'Event' }
  ];

  const generateSchema = () => {
    if (!schemaType || !businessName) {
      toast({
        title: language === 'th' ? "กรุณาใส่ข้อมูลที่จำเป็น" : "Please fill required fields",
        description: language === 'th' ? "เลือกประเภท Schema และใส่ชื่อธุรกิจ" : "Select schema type and enter business name",
        variant: "destructive"
      });
      return;
    }

    let schema = {};

    switch (schemaType) {
      case 'organization':
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": businessName,
          "description": description,
          "url": website,
          "telephone": phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": address
          }
        };
        break;
      case 'local-business':
        schema = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": businessName,
          "description": description,
          "url": website,
          "telephone": phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": address
          },
          "openingHours": "Mo-Fr 09:00-18:00"
        };
        break;
      case 'restaurant':
        schema = {
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": businessName,
          "description": description,
          "url": website,
          "telephone": phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": address
          },
          "servesCuisine": language === 'th' ? "อาหารไทย" : "Thai cuisine",
          "priceRange": "$$"
        };
        break;
      case 'article':
        schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": businessName,
          "description": description,
          "url": website,
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
        break;
      default:
        schema = {
          "@context": "https://schema.org",
          "@type": "Thing",
          "name": businessName,
          "description": description,
          "url": website
        };
    }

    // Remove empty fields
    const cleanSchema = JSON.parse(JSON.stringify(schema, (key, value) => {
      return value === "" ? undefined : value;
    }));

    setGeneratedSchema(JSON.stringify(cleanSchema, null, 2));
    
    toast({
      title: language === 'th' ? "สร้าง Schema สำเร็จ!" : "Schema Generated!",
      description: language === 'th' ? "Schema Markup ถูกสร้างแล้ว" : "Schema markup has been generated"
    });
  };

  const copySchema = () => {
    const schemaHtml = `<script type="application/ld+json">
${generatedSchema}
</script>`;
    
    navigator.clipboard.writeText(schemaHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: language === 'th' ? "คัดลอกแล้ว!" : "Copied!",
      description: language === 'th' ? "Schema markup ถูกคัดลอกไปยังคลิปบอร์ดแล้ว" : "Schema markup copied to clipboard"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {language === 'th' ? 'สร้าง Schema Markup อัตโนมัติ' : 'Auto Schema Markup Generator'}
            </CardTitle>
            <CardDescription>
              {language === 'th' 
                ? 'สร้าง Schema.org markup เพื่อช่วยให้ Google เข้าใจเนื้อหาของคุณได้ดีขึ้น'
                : 'Generate Schema.org markup to help Google better understand your content'
              }
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              EN
            </Button>
            <Button
              variant={language === 'th' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('th')}
            >
              TH
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'th' ? 'ประเภท Schema' : 'Schema Type'} *
            </label>
            <Select value={schemaType} onValueChange={setSchemaType}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'th' ? 'เลือกประเภท Schema' : 'Select schema type'} />
              </SelectTrigger>
              <SelectContent>
                {schemaTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'th' ? 'ชื่อธุรกิจ/หัวข้อ' : 'Business Name/Title'} *
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={language === 'th' ? 'ใส่ชื่อธุรกิจหรือหัวข้อ' : 'Enter business name or title'}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {language === 'th' ? 'คำอธิบาย' : 'Description'}
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={language === 'th' ? 'คำอธิบายเกี่ยวกับธุรกิจหรือเนื้อหา' : 'Description about your business or content'}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'th' ? 'เว็บไซต์' : 'Website'}
            </label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number'}
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={language === 'th' ? '02-xxx-xxxx' : '+1-xxx-xxx-xxxx'}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {language === 'th' ? 'ที่อยู่' : 'Address'}
          </label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={language === 'th' ? 'ที่อยู่ธุรกิจ' : 'Business address'}
          />
        </div>

        <Button onClick={generateSchema} className="w-full">
          <Zap className="h-4 w-4 mr-2" />
          {language === 'th' ? 'สร้าง Schema Markup' : 'Generate Schema Markup'}
        </Button>

        {generatedSchema && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {language === 'th' ? 'Schema Markup ที่สร้างขึ้น' : 'Generated Schema Markup'}
              </h3>
              <Badge variant="secondary">JSON-LD</Badge>
            </div>
            
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{generatedSchema}</code>
              </pre>
            </div>

            <Button onClick={copySchema} className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied 
                ? (language === 'th' ? 'คัดลอกแล้ว!' : 'Copied!') 
                : (language === 'th' ? 'คัดลอก HTML Code' : 'Copy HTML Code')
              }
            </Button>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>{language === 'th' ? 'วิธีใช้:' : 'How to use:'}</strong>
              <br />
              {language === 'th' 
                ? 'วาง code นี้ในส่วน <head> ของหน้าเว็บ หรือก่อน </body> tag'
                : 'Paste this code in the <head> section of your webpage or before the </body> tag'
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchemaMarkupGenerator;
