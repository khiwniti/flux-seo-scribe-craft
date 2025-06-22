
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wand2, Brain, CheckCircle, Eye, Target, TrendingUp, Zap } from 'lucide-react';

interface ContentGenerationFormProps {
  topic: string;
  setTopic: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  wordCount: string;
  setWordCount: (value: string) => void;
  contentType: string;
  setContentType: (value: string) => void;
  writingStyle: string;
  setWritingStyle: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  industryFocus: string;
  setIndustryFocus: (value: string) => void;
  contentTemplate: string;
  setContentTemplate: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => Promise<void>; // Changed to Promise
  error?: string | null; // Added error prop
}

const ContentGenerationForm = ({
  topic,
  setTopic,
  keywords,
  setKeywords,
  tone,
  setTone,
  wordCount,
  setWordCount,
  contentType,
  setContentType,
  writingStyle,
  setWritingStyle,
  targetAudience,
  setTargetAudience,
  industryFocus,
  setIndustryFocus,
  contentTemplate,
  setContentTemplate,
  isGenerating,
  onGenerate,
  error,
}: ContentGenerationFormProps) => {
  const { language } = useLanguage(); // Import and use language context

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  // Translations object
  const T = {
    cardTitle: t("Intelligent Content Generator", "เครื่องมือสร้างเนื้อหาอัจฉริยะ"),
    cardDescription: t("AI-powered content generation with smart field enhancement and auto-completion", "การสร้างเนื้อหาด้วย AI พร้อมการเพิ่มประสิทธิภาพช่องข้อมูลอัจฉริยะและการเติมข้อความอัตโนมัติ"),
    topicLabel: t("Blog Topic *", "หัวข้อบล็อก *"),
    topicPlaceholder: t("e.g., Digital Marketing Strategies for 2024", "เช่น กลยุทธ์การตลาดดิจิทัลปี 2024"),
    topicHelper: t("💡 AI will automatically suggest keywords, tone, and audience based on your topic", "💡 AI จะแนะนำคีย์เวิร์ด ลักษณะน้ำเสียง และกลุ่มเป้าหมายอัตโนมัติตามหัวข้อของคุณ"),
    keywordsLabel: t("Target Keywords", "คีย์เวิร์ดเป้าหมาย"),
    keywordsPlaceholder: t("AI will auto-suggest keywords...", "AI จะแนะนำคีย์เวิร์ดอัตโนมัติ..."),
    keywordsHelper: t("✨ Keywords will be auto-generated from your topic", "✨ คีย์เวิร์ดจะถูกสร้างอัตโนมัติจากหัวข้อของคุณ"),
    toneLabel: t("Writing Tone", "ลักษณะการเขียน"),
    tonePlaceholder: t("AI will auto-detect...", "AI จะตรวจจับอัตโนมัติ..."),
    toneProfessional: t("Professional", "เป็นทางการ"),
    toneCasual: t("Casual", "เป็นกันเอง"),
    toneAuthoritative: t("Authoritative", "น่าเชื่อถือ"),
    toneConversational: t("Conversational", "เชิงสนทนา"),
    toneHelper: t("🎯 Tone auto-detected from content", "🎯 ลักษณะน้ำเสียงตรวจจับอัตโนมัติจากเนื้อหา"),
    wordCountLabel: t("Word Count", "จำนวนคำ"),
    wordCountPlaceholder: t("Select length", "เลือกความยาว"),
    wordCountShort: t("Short (500-800 words)", "สั้น (500-800 คำ)"),
    wordCountMedium: t("Medium (800-1200 words)", "ปานกลาง (800-1200 คำ)"),
    wordCountLong: t("Long (1200-2000 words)", "ยาว (1200-2000 คำ)"),
    enhancedAISettingsLabel: t("Enhanced AI Settings", "การตั้งค่า AI ขั้นสูง"),
    autoEnhancedBadge: t("Auto-Enhanced", "ปรับปรุงอัตโนมัติ"),
    contentTypeLabel: t("Content Type", "ประเภทเนื้อหา"),
    contentTypePlaceholder: t("AI will detect...", "AI จะตรวจจับ..."),
    contentTypeBlog: t("Blog Post", "บทความบล็อก"),
    contentTypeHowTo: t("How-To Guide", "คู่มือวิธีทำ"),
    contentTypeListicle: t("Listicle", "บทความแบบรายการ"),
    contentTypeComparison: t("Comparison", "บทความเปรียบเทียบ"),
    contentTypeCaseStudy: t("Case Study", "กรณีศึกษา"),
    writingStyleLabel: t("Writing Style", "สไตล์การเขียน"),
    writingStylePlaceholder: t("Auto-optimized...", "ปรับให้เหมาะสมอัตโนมัติ..."),
    writingStyleProfessional: t("Professional", "เป็นทางการ"),
    writingStyleConversational: t("Conversational", "เชิงสนทนา"),
    writingStyleAuthoritative: t("Authoritative", "น่าเชื่อถือ"),
    writingStyleCasual: t("Casual", "เป็นกันเอง"),
    writingStyleTechnical: t("Technical", "เชิงเทคนิค"),
    targetAudienceLabel: t("Target Audience", "กลุ่มเป้าหมาย"),
    targetAudiencePlaceholder: t("AI will identify...", "AI จะระบุ..."),
    targetAudienceGeneral: t("General Public", "บุคคลทั่วไป"),
    targetAudienceBeginners: t("Beginners", "ผู้เริ่มต้น"),
    targetAudienceProfessionals: t("Professionals", "ผู้ประกอบวิชาชีพ"),
    targetAudienceExperts: t("Industry Experts", "ผู้เชี่ยวชาญในอุตสาหกรรม"),
    targetAudienceExecutives: t("Business Executives", "ผู้บริหารธุรกิจ"),
    industryFocusLabel: t("Industry Focus", "อุตสาหกรรมที่มุ่งเน้น"),
    industryFocusPlaceholder: t("Auto-categorized...", "จัดหมวดหมู่อัตโนมัติ..."),
    industryFocusGeneral: t("General Business", "ธุรกิจทั่วไป"),
    industryFocusTech: t("Technology", "เทคโนโลยี"),
    industryFocusMarketing: t("Marketing", "การตลาด"),
    industryFocusFinance: t("Finance", "การเงิน"),
    industryFocusHealthcare: t("Healthcare", "การดูแลสุขภาพ"),
    industryFocusEducation: t("Education", "การศึกษา"),
    industryFocusEcommerce: t("E-commerce", "อีคอมเมิร์ซ"),
    contentTemplateLabel: t("Content Template", "เทมเพลตเนื้อหา"),
    contentTemplatePlaceholder: t("Smart template selection...", "การเลือกเทมเพลตอัจฉริยะ..."),
    contentTemplateStandard: t("Standard Article", "บทความมาตรฐาน"),
    contentTemplateHowTo: t("How-To Guide", "คู่มือวิธีทำ"),
    contentTemplateListArticle: t("List Article", "บทความแบบรายการ"),
    contentTemplateComparisonGuide: t("Comparison Guide", "คู่มือเปรียบเทียบ"),
    aiPoweredFeaturesLabel: t("AI-Powered Features", "คุณสมบัติที่ขับเคลื่อนด้วย AI"),
    badgeAutoSEO: t("Auto-SEO Optimization", "ปรับ SEO อัตโนมัติ"),
    badgeSmartImage: t("Smart Image Generation", "สร้างภาพอัจฉริยะ"),
    badgeKeywordDetection: t("Keyword Auto-Detection", "ตรวจจับคีย์เวิร์ดอัตโนมัติ"),
    badgeQualityAnalysis: t("Content Quality Analysis", "วิเคราะห์คุณภาพเนื้อหา"),
    badgeTrendIntegration: t("Trend Integration", "การรวมเทรนด์"),
    badgeOneClickPublish: t("One-Click Publishing", "เผยแพร่ในคลิกเดียว"),
    buttonGenerating: t("Generating AI-Enhanced Content...", "กำลังสร้างเนื้อหา AI ขั้นสูง..."),
    buttonGenerate: t("Generate Smart AI Content", "สร้างเนื้อหา AI อัจฉริยะ"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    await onGenerate();
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          {T.cardTitle}
        </CardTitle>
        <CardDescription>
          {T.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">{T.topicLabel}</Label>
            <Input
              id="topic"
              placeholder={T.topicPlaceholder}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
              required
            />
            {topic && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                {T.topicHelper}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">{T.keywordsLabel}</Label>
            <Input
              id="keywords"
              placeholder={T.keywordsPlaceholder}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isGenerating}
            />
            {!keywords && topic && (
              <div className="text-xs text-green-600">
                {T.keywordsHelper}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{T.toneLabel}</Label>
              <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder={T.tonePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">{T.toneProfessional}</SelectItem>
                  <SelectItem value="casual">{T.toneCasual}</SelectItem>
                  <SelectItem value="authoritative">{T.toneAuthoritative}</SelectItem>
                  <SelectItem value="conversational">{T.toneConversational}</SelectItem>
                </SelectContent>
              </Select>
              {!tone && (
                <div className="text-xs text-purple-600">
                  {T.toneHelper}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{T.wordCountLabel}</Label>
              <Select value={wordCount} onValueChange={setWordCount} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder={T.wordCountPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">{T.wordCountShort}</SelectItem>
                  <SelectItem value="medium">{T.wordCountMedium}</SelectItem>
                  <SelectItem value="long">{T.wordCountLong}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-blue-600" />
            <Label className="text-base font-semibold">{T.enhancedAISettingsLabel}</Label>
            <Badge className="bg-purple-100 text-purple-700">{T.autoEnhancedBadge}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{T.contentTypeLabel}</Label>
              <Select value={contentType} onValueChange={setContentType} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder={T.contentTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">{T.contentTypeBlog}</SelectItem>
                  <SelectItem value="how-to">{T.contentTypeHowTo}</SelectItem>
                  <SelectItem value="listicle">{T.contentTypeListicle}</SelectItem>
                  <SelectItem value="comparison">{T.contentTypeComparison}</SelectItem>
                  <SelectItem value="case-study">{T.contentTypeCaseStudy}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{T.writingStyleLabel}</Label>
              <Select value={writingStyle} onValueChange={setWritingStyle} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder={T.writingStylePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">{T.writingStyleProfessional}</SelectItem>
                  <SelectItem value="conversational">{T.writingStyleConversational}</SelectItem>
                  <SelectItem value="authoritative">{T.writingStyleAuthoritative}</SelectItem>
                  <SelectItem value="casual">{T.writingStyleCasual}</SelectItem>
                  <SelectItem value="technical">{T.writingStyleTechnical}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{T.targetAudienceLabel}</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder={T.targetAudiencePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{T.targetAudienceGeneral}</SelectItem>
                  <SelectItem value="beginners">{T.targetAudienceBeginners}</SelectItem>
                  <SelectItem value="professionals">{T.targetAudienceProfessionals}</SelectItem>
                  <SelectItem value="experts">{T.targetAudienceExperts}</SelectItem>
                  <SelectItem value="executives">{T.targetAudienceExecutives}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{T.industryFocusLabel}</Label>
              <Select value={industryFocus} onValueChange={setIndustryFocus} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder={T.industryFocusPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{T.industryFocusGeneral}</SelectItem>
                  <SelectItem value="technology">{T.industryFocusTech}</SelectItem>
                  <SelectItem value="marketing">{T.industryFocusMarketing}</SelectItem>
                  <SelectItem value="finance">{T.industryFocusFinance}</SelectItem>
                  <SelectItem value="healthcare">{T.industryFocusHealthcare}</SelectItem>
                  <SelectItem value="education">{T.industryFocusEducation}</SelectItem>
                  <SelectItem value="ecommerce">{T.industryFocusEcommerce}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{T.contentTemplateLabel}</Label>
            <Select value={contentTemplate} onValueChange={setContentTemplate} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder={T.contentTemplatePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">{T.contentTemplateStandard}</SelectItem>
                <SelectItem value="how-to">{T.contentTemplateHowTo}</SelectItem>
                <SelectItem value="listicle">{T.contentTemplateListArticle}</SelectItem>
                <SelectItem value="comparison">{T.contentTemplateComparisonGuide}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{T.aiPoweredFeaturesLabel}</Label>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              {T.badgeAutoSEO}
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Eye className="h-3 w-3 mr-1" />
              {T.badgeSmartImage}
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Brain className="h-3 w-3 mr-1" />
              {T.badgeKeywordDetection}
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              <Target className="h-3 w-3 mr-1" />
              {T.badgeQualityAnalysis}
            </Badge>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              {T.badgeTrendIntegration}
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              <Zap className="h-3 w-3 mr-1" />
              {T.badgeOneClickPublish}
            </Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
            <div className="mt-4 p-3 text-sm bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 flex-shrink-0" />
              {error}
            </div>
        )}

        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {T.buttonGenerating}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              {T.buttonGenerate}
            </div>
          )}
        </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentGenerationForm;
