import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Wand2, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BasicFormFields from './BasicFormFields';
import EnhancedAISettings from './EnhancedAISettings';
import AIFeaturesBadges from './AIFeaturesBadges';
import ErrorDisplay from './ErrorDisplay';

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
  onGenerate: () => Promise<void>;
  error?: string | null;
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
  const { language } = useLanguage();

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

        </form>
      </CardContent>
    </Card>
  );
};

export default ContentGenerationForm;
