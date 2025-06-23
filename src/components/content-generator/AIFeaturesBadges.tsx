
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AIFeaturesBadges = () => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const features = [
    { key: 'seo', text: t("Auto-SEO Optimization", "ปรับ SEO อัตโนมัติ") },
    { key: 'image', text: t("Smart Image Generation", "สร้างภาพอัจฉริยะ") },
    { key: 'keyword', text: t("Keyword Auto-Detection", "ตรวจจับคีย์เวิร์ดอัตโนมัติ") },
    { key: 'quality', text: t("Content Quality Analysis", "วิเคราะห์คุณภาพเนื้อหา") },
    { key: 'trend', text: t("Trend Integration", "การรวมเทรนด์") },
    { key: 'publish', text: t("One-Click Publishing", "เผยแพร่ในคลิกเดียว") }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium">
          {t("AI-Powered Features", "คุณสมบัติที่ขับเคลื่อนด้วย AI")}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <Badge 
            key={feature.key}
            variant="outline" 
            className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
          >
            {feature.text}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default AIFeaturesBadges;
