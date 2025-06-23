
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface BasicFormFieldsProps {
  topic: string;
  setTopic: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  wordCount: string;
  setWordCount: (value: string) => void;
}

const BasicFormFields = ({
  topic,
  setTopic,
  keywords,
  setKeywords,
  tone,
  setTone,
  wordCount,
  setWordCount
}: BasicFormFieldsProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-sm font-medium">
          {t("Blog Topic *", "หัวข้อบล็อก *")}
        </Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t("e.g., Digital Marketing Strategies for 2024", "เช่น กลยุทธ์การตลาดดิจิทัลปี 2024")}
          className="w-full"
          required
        />
        <p className="text-xs text-muted-foreground">
          {t("💡 AI will automatically suggest keywords, tone, and audience based on your topic", "💡 AI จะแนะนำคีย์เวิร์ด ลักษณะน้ำเสียง และกลุ่มเป้าหมายอัตโนมัติตามหัวข้อของคุณ")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords" className="text-sm font-medium">
          {t("Target Keywords", "คีย์เวิร์ดเป้าหมาย")}
        </Label>
        <Textarea
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder={t("AI will auto-suggest keywords...", "AI จะแนะนำคีย์เวิร์ดอัตโนมัติ...")}
          className="w-full min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          {t("✨ Keywords will be auto-generated from your topic", "✨ คีย์เวิร์ดจะถูกสร้างอัตโนมัติจากหัวข้อของคุณ")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tone" className="text-sm font-medium">
            {t("Writing Tone", "ลักษณะการเขียน")}
          </Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder={t("AI will auto-detect...", "AI จะตรวจจับอัตโนมัติ...")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">{t("Professional", "เป็นทางการ")}</SelectItem>
              <SelectItem value="casual">{t("Casual", "เป็นกันเอง")}</SelectItem>
              <SelectItem value="authoritative">{t("Authoritative", "น่าเชื่อถือ")}</SelectItem>
              <SelectItem value="conversational">{t("Conversational", "เชิงสนทนา")}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t("🎯 Tone auto-detected from content", "🎯 ลักษณะน้ำเสียงตรวจจับอัตโนมัติจากเนื้อหา")}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wordCount" className="text-sm font-medium">
            {t("Word Count", "จำนวนคำ")}
          </Label>
          <Select value={wordCount} onValueChange={setWordCount}>
            <SelectTrigger>
              <SelectValue placeholder={t("Select length", "เลือกความยาว")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">{t("Short (500-800 words)", "สั้น (500-800 คำ)")}</SelectItem>
              <SelectItem value="medium">{t("Medium (800-1200 words)", "ปานกลาง (800-1200 คำ)")}</SelectItem>
              <SelectItem value="long">{t("Long (1200-2000 words)", "ยาว (1200-2000 คำ)")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicFormFields;
