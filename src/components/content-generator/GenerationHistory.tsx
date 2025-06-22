
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { AutoGenHistoryEntry } from './types';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

interface GenerationHistoryProps {
  autoGenHistory: AutoGenHistoryEntry[];
}

const GenerationHistory = ({ autoGenHistory }: GenerationHistoryProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    cardTitle: t("Generation History", "ประวัติการสร้าง"),
    cardDescription: t("View your recent auto-generated blog posts", "ดูบทความบล็อกที่สร้างอัตโนมัติล่าสุดของคุณ"),
    noHistory: t("No auto-generated content yet", "ยังไม่มีเนื้อหาที่สร้างอัตโนมัติ"),
    enableAutoGenPrompt: t("Enable auto-generation to start building your content history", "เปิดใช้งานการสร้างอัตโนมัติเพื่อเริ่มสร้างประวัติเนื้อหาของคุณ"),
    wordCountLabel: t("Word Count:", "จำนวนคำ:"),
    generatedLabel: t("Generated:", "สร้างเมื่อ:"),
    atLabel: t("at", "เวลา"),
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-600" />
          {T.cardTitle}
        </CardTitle>
        <CardDescription>
          {T.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {autoGenHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{T.noHistory}</p>
            <p className="text-sm text-gray-400 mt-2">
              {T.enableAutoGenPrompt}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {autoGenHistory.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">{entry.topic}</h4>
                    <p className="text-sm text-gray-600">{T.wordCountLabel} {entry.wordCount}</p>
                    <p className="text-xs text-gray-500">
                      {T.generatedLabel} {entry.date.toLocaleDateString()} {T.atLabel} {entry.date.toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {entry.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerationHistory;
