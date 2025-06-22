import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, KeyRound, AlertTriangle } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

const API_KEY_STORAGE_KEY = 'geminiApiKey';

const SettingsTab: React.FC = () => {
  const { language } = useLanguage(); // Consume language context
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  // Translations
  const T = {
    cardTitle: t("API Key Management", "การจัดการคีย์ API"),
    cardDescription: t("Manage your Google Gemini API Key. This key is required for AI features to function.", "จัดการคีย์ Google Gemini API ของคุณ คีย์นี้จำเป็นเพื่อให้คุณสมบัติ AI ทำงานได้"),
    labelApiKey: t("Google Gemini API Key", "คีย์ Google Gemini API"),
    placeholderApiKey: t("Enter your API key here", "ป้อนคีย์ API ของคุณที่นี่"),
    ariaHideKey: t("Hide API key", "ซ่อนคีย์ API"),
    ariaShowKey: t("Show API key", "แสดงคีย์ API"),
    saveButton: t("Save API Key", "บันทึกคีย์ API"),
    clearButton: t("Clear API Key", "ล้างคีย์ API"),
    securityNoteTitle: t("Security Note:", "หมายเหตุด้านความปลอดภัย:"),
    securityNoteP1: t("Your API key is stored locally in your browser's local storage.", "คีย์ API ของคุณถูกเก็บไว้ใน Local Storage ของเบราว์เซอร์ของคุณ"),
    securityNoteP2: t("While convenient, be cautious if using this on a shared computer.", "แม้จะสะดวก โปรดระมัดระวังหากใช้บนคอมพิวเตอร์ที่ใช้ร่วมกัน"),
    securityNoteP3: t("For optimal security, consider environment variables for development or server-side key management for production applications.", "เพื่อความปลอดภัยสูงสุด พิจารณาใช้ตัวแปรสภาพแวดล้อมสำหรับการพัฒนาหรือการจัดการคีย์ฝั่งเซิร์ฟเวอร์สำหรับแอปพลิเคชันที่ใช้งานจริง"),
    whyNeededTitle: t("Why is an API Key needed?", "ทำไมจึงต้องใช้คีย์ API?"),
    whyNeededDesc: t("The Gemini API requires an API key to authenticate requests and grant access to its generative AI models.", "Gemini API ต้องการคีย์ API เพื่อตรวจสอบคำขอและให้สิทธิ์การเข้าถึงโมเดล AI กำเนิดของตน"),
    whereToGetTitle: t("Where to get an API Key?", "จะรับคีย์ API ได้จากที่ไหน?"),
    whereToGetDesc: t("You can obtain an API key from Google AI Studio after setting up your project.", "คุณสามารถรับคีย์ API ได้จาก Google AI Studio หลังจากตั้งค่าโปรเจกต์ของคุณ"),
    toastEmptyTitle: t("API Key Empty", "คีย์ API ว่างเปล่า"),
    toastEmptyDesc: t("Please enter an API key before saving.", "กรุณาป้อนคีย์ API ก่อนบันทึก"),
    toastSavedTitle: t("API Key Saved", "บันทึกคีย์ API แล้ว"),
    toastSavedDesc: t("Your Google Gemini API Key has been saved locally.", "คีย์ Google Gemini API ของคุณถูกบันทึกไว้ในเครื่องแล้ว"),
    toastClearedTitle: t("API Key Cleared", "ล้างคีย์ API แล้ว"),
    toastClearedDesc: t("Your Google Gemini API Key has been removed from local storage.", "คีย์ Google Gemini API ของคุณถูกลบออกจาก Local Storage แล้ว"),
  };


  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: T.toastEmptyTitle,
        description: T.toastEmptyDesc,
        variant: 'destructive',
      });
      return;
    }
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    toast({
      title: T.toastSavedTitle,
      description: T.toastSavedDesc,
    });
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    toast({
      title: T.toastClearedTitle,
      description: T.toastClearedDesc,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-gray-700" />
          {T.cardTitle}
        </CardTitle>
        <CardDescription>
         {T.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="gemini-api-key">{T.labelApiKey}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="gemini-api-key"
              type={showApiKey ? 'text' : 'password'}
              placeholder={T.placeholderApiKey}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-grow"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowApiKey(!showApiKey)}
              aria-label={showApiKey ? T.ariaHideKey : T.ariaShowKey}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSaveApiKey} className="flex-1">
            {T.saveButton}
          </Button>
          <Button onClick={handleClearApiKey} variant="outline" className="flex-1">
            {T.clearButton}
          </Button>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{T.securityNoteTitle}</strong> {T.securityNoteP1}
            {" "} {T.securityNoteP2} {" "} {T.securityNoteP3}
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
            <p><strong>{T.whyNeededTitle}</strong> {T.whyNeededDesc}</p>
            <p><strong>{T.whereToGetTitle}</strong> {T.whereToGetDesc}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
