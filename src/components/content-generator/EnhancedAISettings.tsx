
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedAISettingsProps {
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
}

const EnhancedAISettings = ({
  contentType,
  setContentType,
  writingStyle,
  setWritingStyle,
  targetAudience,
  setTargetAudience,
  industryFocus,
  setIndustryFocus,
  contentTemplate,
  setContentTemplate
}: EnhancedAISettingsProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">
          {t("Enhanced AI Settings", "การตั้งค่า AI ขั้นสูง")}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {t("Auto-Enhanced", "ปรับปรุงอัตโนมัติ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contentType" className="text-sm font-medium">
            {t("Content Type", "ประเภทเนื้อหา")}
          </Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue placeholder={t("AI will detect...", "AI จะตรวจจับ...")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">{t("Blog Post", "บทความบล็อก")}</SelectItem>
              <SelectItem value="howto">{t("How-To Guide", "คู่มือวิธีทำ")}</SelectItem>
              <SelectItem value="listicle">{t("Listicle", "บทความแบบรายการ")}</SelectItem>
              <SelectItem value="comparison">{t("Comparison", "บทความเปรียบเทียบ")}</SelectItem>
              <SelectItem value="casestudy">{t("Case Study", "กรณีศึกษา")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="writingStyle" className="text-sm font-medium">
            {t("Writing Style", "สไตล์การเขียน")}
          </Label>
          <Select value={writingStyle} onValueChange={setWritingStyle}>
            <SelectTrigger>
              <SelectValue placeholder={t("Auto-optimized...", "ปรับให้เหมาะสมอัตโนมัติ...")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">{t("Professional", "เป็นทางการ")}</SelectItem>
              <SelectItem value="conversational">{t("Conversational", "เชิงสนทนา")}</SelectItem>
              <SelectItem value="authoritative">{t("Authoritative", "น่าเชื่อถือ")}</SelectItem>
              <SelectItem value="casual">{t("Casual", "เป็นกันเอง")}</SelectItem>
              <SelectItem value="technical">{t("Technical", "เชิงเทคนิค")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience" className="text-sm font-medium">
            {t("Target Audience", "กลุ่มเป้าหมาย")}
          </Label>
          <Select value={targetAudience} onValueChange={setTargetAudience}>
            <SelectTrigger>
              <SelectValue placeholder={t("AI will identify...", "AI จะระบุ...")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">{t("General Public", "บุคคลทั่วไป")}</SelectItem>
              <SelectItem value="beginners">{t("Beginners", "ผู้เริ่มต้น")}</SelectItem>
              <SelectItem value="professionals">{t("Professionals", "ผู้ประกอบวิชาชีพ")}</SelectItem>
              <SelectItem value="experts">{t("Industry Experts", "ผู้เชี่ยวชาญในอุตสาหกรรม")}</SelectItem>
              <SelectItem value="executives">{t("Business Executives", "ผู้บริหารธุรกิจ")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industryFocus" className="text-sm font-medium">
            {t("Industry Focus", "อุตสาหกรรมที่มุ่งเน้น")}
          </Label>
          <Select value={industryFocus} onValueChange={setIndustryFocus}>
            <SelectTrigger>
              <SelectValue placeholder={t("Auto-categorized...", "จัดหมวดหมู่อัตโนมัติ...")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">{t("General Business", "ธุรกิจทั่วไป")}</SelectItem>
              <SelectItem value="technology">{t("Technology", "เทคโนโลยี")}</SelectItem>
              <SelectItem value="marketing">{t("Marketing", "การตลาด")}</SelectItem>
              <SelectItem value="finance">{t("Finance", "การเงิน")}</SelectItem>
              <SelectItem value="healthcare">{t("Healthcare", "การดูแลสุขภาพ")}</SelectItem>
              <SelectItem value="education">{t("Education", "การศึกษา")}</SelectItem>
              <SelectItem value="ecommerce">{t("E-commerce", "อีคอมเมิร์ซ")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contentTemplate" className="text-sm font-medium">
          {t("Content Template", "เทมเพลตเนื้อหา")}
        </Label>
        <Select value={contentTemplate} onValueChange={setContentTemplate}>
          <SelectTrigger>
            <SelectValue placeholder={t("Smart template selection...", "การเลือกเทมเพลตอัจฉริยะ...")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">{t("Standard Article", "บทความมาตรฐาน")}</SelectItem>
            <SelectItem value="howto">{t("How-To Guide", "คู่มือวิธีทำ")}</SelectItem>
            <SelectItem value="list">{t("List Article", "บทความแบบรายการ")}</SelectItem>
            <SelectItem value="comparison">{t("Comparison Guide", "คู่มือเปรียบเทียบ")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EnhancedAISettings;
