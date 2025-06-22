
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Check, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext'; // Import global language context

const SchemaMarkupGenerator = () => {
  const { language } = useLanguage(); // Use global language context
  const [schemaType, setSchemaType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [generatedSchema, setGeneratedSchema] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    cardTitle: t("Auto Schema Markup Generator", "สร้าง Schema Markup อัตโนมัติ"),
    cardDescription: t("Generate Schema.org markup to help Google better understand your content", "สร้าง Schema.org markup เพื่อช่วยให้ Google เข้าใจเนื้อหาของคุณได้ดีขึ้น"),
    schemaTypeLabel: t("Schema Type", "ประเภท Schema") + " *",
    selectSchemaTypePlaceholder: t("Select schema type", "เลือกประเภท Schema"),
    schemaTypeOrg: t("Organization/Company", "องค์กร/บริษัท"),
    schemaTypeLocalBusiness: t("Local Business", "ธุรกิจท้องถิ่น"),
    schemaTypeRestaurant: t("Restaurant", "ร้านอาหาร"),
    schemaTypeArticle: t("Article", "บทความ"),
    schemaTypeProduct: t("Product", "สินค้า"),
    schemaTypeService: t("Service", "บริการ"),
    schemaTypeEvent: t("Event", "งานอีเวนต์"),
    businessNameLabel: t("Business Name/Title", "ชื่อธุรกิจ/หัวข้อ") + " *",
    businessNamePlaceholder: t("Enter business name or title", "ใส่ชื่อธุรกิจหรือหัวข้อ"),
    descriptionLabel: t("Description", "คำอธิบาย"),
    descriptionPlaceholder: t("Description about your business or content", "คำอธิบายเกี่ยวกับธุรกิจหรือเนื้อหา"),
    websiteLabel: t("Website", "เว็บไซต์"),
    websitePlaceholder: "https://example.com",
    phoneLabel: t("Phone Number", "เบอร์โทรศัพท์"),
    phonePlaceholder: t("+1-xxx-xxx-xxxx", "02-xxx-xxxx"),
    addressLabel: t("Address", "ที่อยู่"),
    addressPlaceholder: t("Business address", "ที่อยู่ธุรกิจ"),
    generateButton: t("Generate Schema Markup", "สร้าง Schema Markup"),
    generatedSchemaTitle: t("Generated Schema Markup", "Schema Markup ที่สร้างขึ้น"),
    jsonLDBadge: "JSON-LD",
    copyButtonCopied: t("Copied!", "คัดลอกแล้ว!"),
    copyButtonDefault: t("Copy HTML Code", "คัดลอก HTML Code"),
    howToUseTitle: t("How to use:", "วิธีใช้:"),
    howToUseInstruction: t("Paste this code in the <head> section of your webpage or before the </body> tag", "วาง code นี้ในส่วน <head> ของหน้าเว็บ หรือก่อน </body> tag"),
    toastRequiredTitle: t("Please fill required fields", "กรุณาใส่ข้อมูลที่จำเป็น"),
    toastRequiredDesc: t("Select schema type and enter business name", "เลือกประเภท Schema และใส่ชื่อธุรกิจ"),
    toastGeneratedTitle: t("Schema Generated!", "สร้าง Schema สำเร็จ!"),
    toastGeneratedDesc: t("Schema markup has been generated", "Schema Markup ถูกสร้างแล้ว"),
    toastCopiedTitle: t("Copied!", "คัดลอกแล้ว!"),
    toastCopiedDesc: t("Schema markup copied to clipboard", "Schema markup ถูกคัดลอกไปยังคลิปบอร์ดแล้ว"),
    // Placeholders for generated schema data
    servesCuisineDefault: t("Thai cuisine", "อาหารไทย"),
    authorNamePlaceholder: t("Author Name", "ชื่อผู้เขียน"),
    publisherNamePlaceholder: t("Publisher Name", "ชื่อผู้เผยแพร่"),
  };

  const schemaTypes = [
    { value: 'organization', label: T.schemaTypeOrg },
    { value: 'local-business', label: T.schemaTypeLocalBusiness },
    { value: 'restaurant', label: T.schemaTypeRestaurant },
    { value: 'article', label: T.schemaTypeArticle },
    { value: 'product', label: T.schemaTypeProduct },
    { value: 'service', label: T.schemaTypeService },
    { value: 'event', label: T.schemaTypeEvent }
  ];

  const generateSchema = () => {
    if (!schemaType || !businessName) {
      toast({
        title: T.toastRequiredTitle,
        description: T.toastRequiredDesc,
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
          "openingHours": "Mo-Fr 09:00-18:00" // This could also be localized or made into a field
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
          "servesCuisine": T.servesCuisineDefault,
          "priceRange": "$$" // This could also be localized or made into a field
        };
        break;
      case 'article':
        schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": businessName, // Assuming businessName is used as headline for Article type
          "description": description,
          "url": website,
          "author": {
            "@type": "Person",
            "name": T.authorNamePlaceholder
          },
          "datePublished": new Date().toISOString(),
          "publisher": {
            "@type": "Organization",
            "name": T.publisherNamePlaceholder
          }
        };
        break;
      default: // Generic fallback
        schema = {
          "@context": "https://schema.org",
          "@type": "Thing", // Default to "Thing" or use schemaType if it's a valid Schema.org type
          "name": businessName,
          "description": description,
          "url": website
        };
    }

    // Remove empty fields
    const cleanSchema = JSON.parse(JSON.stringify(schema, (key, value) => {
      return value === "" || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && value !== null && Object.keys(value).length === 0) ? undefined : value;
    }));

    setGeneratedSchema(JSON.stringify(cleanSchema, null, 2));
    
    toast({
      title: T.toastGeneratedTitle,
      description: T.toastGeneratedDesc,
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
      title: T.toastCopiedTitle,
      description: T.toastCopiedDesc,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {T.cardTitle}
            </CardTitle>
            <CardDescription>
              {T.cardDescription}
            </CardDescription>
          </div>
          {/* Removed local language switcher as global one is used */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {T.schemaTypeLabel}
            </label>
            <Select value={schemaType} onValueChange={setSchemaType}>
              <SelectTrigger>
                <SelectValue placeholder={T.selectSchemaTypePlaceholder} />
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
              {T.businessNameLabel}
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={T.businessNamePlaceholder}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {T.descriptionLabel}
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={T.descriptionPlaceholder}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {T.websiteLabel}
            </label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder={T.websitePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {T.phoneLabel}
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={T.phonePlaceholder}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {T.addressLabel}
          </label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={T.addressPlaceholder}
          />
        </div>

        <Button onClick={generateSchema} className="w-full">
          <Zap className="h-4 w-4 mr-2" />
          {T.generateButton}
        </Button>

        {generatedSchema && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {T.generatedSchemaTitle}
              </h3>
              <Badge variant="secondary">{T.jsonLDBadge}</Badge>
            </div>
            
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{generatedSchema}</code>
              </pre>
            </div>

            <Button onClick={copySchema} className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied 
                ? T.copyButtonCopied
                : T.copyButtonDefault
              }
            </Button>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>{T.howToUseTitle}</strong>
              <br />
              {T.howToUseInstruction}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchemaMarkupGenerator;
