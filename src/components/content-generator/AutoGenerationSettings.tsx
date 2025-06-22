
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Calendar, Play, Pause, Brain, TrendingUp, Target, Award, Settings, Lightbulb } from 'lucide-react';

interface AutoGenerationSettingsProps {
  autoGenEnabled: boolean;
  setAutoGenEnabled: (value: boolean) => void;
  autoGenFrequency: string;
  setAutoGenFrequency: (value: string) => void;
  autoGenTime: string;
  setAutoGenTime: (value: string) => void;
  autoGenDay: string;
  setAutoGenDay: (value: string) => void;
  autoGenTopics: string;
  setAutoGenTopics: (value: string) => void;
  autoGenKeywords: string;
  setAutoGenKeywords: (value: string) => void;
  nextScheduledRun: Date | null;
  contentType: string;
  setContentType: (value: string) => void;
  writingStyle: string;
  setWritingStyle: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  industryFocus: string;
  setIndustryFocus: (value: string) => void;
  trendingTopics: string[];
  contentSuggestions: string[];
  onToggleAutoGeneration: () => void;
  onGenerateAutoContent: () => void;
}
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

const AutoGenerationSettings = ({
  autoGenEnabled,
  autoGenFrequency,
  setAutoGenFrequency,
  autoGenTime,
  setAutoGenTime,
  autoGenDay,
  setAutoGenDay,
  autoGenTopics,
  setAutoGenTopics,
  autoGenKeywords,
  setAutoGenKeywords,
  nextScheduledRun,
  contentType,
  setContentType,
  writingStyle,
  setWritingStyle,
  targetAudience,
  setTargetAudience,
  industryFocus,
  setIndustryFocus,
  trendingTopics,
  contentSuggestions,
  onToggleAutoGeneration,
  onGenerateAutoContent
}: AutoGenerationSettingsProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    cardTitle: t("Auto Blog Generation", "สร้างบล็อกอัตโนมัติ"),
    cardDescription: t("Set up automatic blog post generation with customizable frequency and topics", "ตั้งค่าการสร้างบล็อกโพสต์อัตโนมัติพร้อมความถี่และหัวข้อที่ปรับแต่งได้"),
    autoGenStatusLabel: t("Auto-Generation", "การสร้างอัตโนมัติ"),
    statusActive: t("Active", "ทำงานอยู่"),
    statusInactive: t("Inactive", "ไม่ทำงาน"),
    nextRunLabel: t("Next generation:", "การสร้างครั้งถัดไป:"),
    enableAutoGenLabel: t("Enable to start automatic blog generation", "เปิดใช้งานเพื่อเริ่มการสร้างบล็อกอัตโนมัติ"),
    frequencyLabel: t("Generation Frequency", "ความถี่ในการสร้าง"),
    daily: t("Daily", "รายวัน"),
    weekly: t("Weekly", "รายสัปดาห์"),
    timeLabel: t("Generation Time", "เวลาในการสร้าง"),
    dayOfWeekLabel: t("Day of Week", "วันในสัปดาห์"),
    monday: t("Monday", "วันจันทร์"),
    tuesday: t("Tuesday", "วันอังคาร"),
    wednesday: t("Wednesday", "วันพุธ"),
    thursday: t("Thursday", "วันพฤหัสบดี"),
    friday: t("Friday", "วันศุกร์"),
    saturday: t("Saturday", "วันเสาร์"),
    sunday: t("Sunday", "วันอาทิตย์"),
    topicPoolLabel: t("Topic Pool (comma-separated)", "ชุดหัวข้อ (คั่นด้วยจุลภาค)"),
    topicPoolPlaceholder: t("Digital Marketing, SEO Strategies, Content Creation, Social Media Marketing, Email Marketing...", "การตลาดดิจิทัล, กลยุทธ์ SEO, การสร้างเนื้อหา, การตลาดโซเชียลมีเดีย, การตลาดผ่านอีเมล..."),
    topicPoolHelper: t("Random topics will be selected from this list for auto-generation", "ระบบจะสุ่มเลือกหัวข้อจากรายการนี้เพื่อสร้างอัตโนมัติ"),
    defaultKeywordsLabel: t("Default Keywords", "คีย์เวิร์ดเริ่มต้น"),
    defaultKeywordsPlaceholder: t("SEO, marketing, business, digital...", "SEO, การตลาด, ธุรกิจ, ดิจิทัล..."),
    smartAutoGenLabel: t("Smart Auto-Generation", "การสร้างอัตโนมัติอัจฉริยะ"),
    autoContentTypeLabel: t("Auto Content Type", "ประเภทเนื้อหาอัตโนมัติ"),
    selectTypePlaceholder: t("Select type", "เลือกประเภท"),
    blogPosts: t("Blog Posts", "บทความบล็อก"),
    howToGuides: t("How-To Guides", "คู่มือวิธีทำ"),
    listArticles: t("List Articles", "บทความแบบรายการ"),
    comparisons: t("Comparisons", "บทความเปรียบเทียบ"),
    autoWritingStyleLabel: t("Auto Writing Style", "สไตล์การเขียนอัตโนมัติ"),
    selectStylePlaceholder: t("Select style", "เลือกสไตล์"),
    styleProfessional: t("Professional", "เป็นทางการ"),
    styleConversational: t("Conversational", "เชิงสนทนา"),
    styleAuthoritative: t("Authoritative", "น่าเชื่อถือ"),
    styleCasual: t("Casual", "เป็นกันเอง"),
    targetAudienceLabel: t("Target Audience", "กลุ่มเป้าหมาย"),
    selectAudiencePlaceholder: t("Select audience", "เลือกกลุ่มเป้าหมาย"),
    audienceGeneral: t("General Public", "บุคคลทั่วไป"),
    audienceBeginners: t("Beginners", "ผู้เริ่มต้น"),
    audienceProfessionals: t("Professionals", "ผู้ประกอบวิชาชีพ"),
    audienceExperts: t("Industry Experts", "ผู้เชี่ยวชาญในอุตสาหกรรม"),
    industryFocusLabel: t("Industry Focus", "อุตสาหกรรมที่มุ่งเน้น"),
    selectIndustryPlaceholder: t("Select industry", "เลือกอุตสาหกรรม"),
    industryGeneral: t("General Business", "ธุรกิจทั่วไป"),
    industryTech: t("Technology", "เทคโนโลยี"),
    industryMarketing: t("Marketing", "การตลาด"),
    industryFinance: t("Finance", "การเงิน"),
    industryHealthcare: t("Healthcare", "การดูแลสุขภาพ"),
    industryEducation: t("Education", "การศึกษา"),
    smartFeaturesLabel: t("Smart Features", "คุณสมบัติอัจฉริยะ"),
    badgeTrendAnalysis: t("Trend Analysis", "การวิเคราะห์เทรนด์"),
    badgeSEOOOptimization: t("SEO Optimization", "การปรับแต่ง SEO"),
    badgeSmartKeywords: t("Smart Keywords", "คีย์เวิร์ดอัจฉริยะ"),
    badgeQualityScoring: t("Quality Scoring", "การให้คะแนนคุณภาพ"),
    trendingTopicsLabel: t("Trending Topic Suggestions", "คำแนะนำหัวข้อที่กำลังนิยม"),
    clickToAddTopics: t("Click to add trending topics to your pool", "คลิกเพื่อเพิ่มหัวข้อที่กำลังนิยมไปยังชุดหัวข้อของคุณ"),
    aiContentSuggestionsLabel: t("AI Content Suggestions", "คำแนะนำเนื้อหาจาก AI"),
    testButton: t("Test Smart Auto-Generation Now", "ทดสอบการสร้างอัตโนมัติอัจฉริยะทันที"),
    statusActiveBadge: t("Active", "ทำงานอยู่"),
    statusInactiveBadge: t("Inactive", "ไม่ทำงาน"),
    dailyScheduleBadge: t("Daily Schedule", "กำหนดการรายวัน"),
    weeklyScheduleBadge: t("Weekly Schedule", "กำหนดการรายสัปดาห์"),
    topicsCountBadge: t("{count} Topics", "{count} หัวข้อ"),
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          {T.cardTitle}
        </CardTitle>
        <CardDescription>
          {T.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-Gen Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {autoGenEnabled ? (
                <Play className="h-4 w-4 text-green-600" />
              ) : (
                <Pause className="h-4 w-4 text-gray-400" />
              )}
              <Label className="text-base font-medium">
                {T.autoGenStatusLabel} {autoGenEnabled ? T.statusActive : T.statusInactive}
              </Label>
            </div>
            <p className="text-sm text-gray-600">
              {autoGenEnabled 
                ? `${T.nextRunLabel} ${nextScheduledRun?.toLocaleDateString()} at ${nextScheduledRun?.toLocaleTimeString()}`
                : T.enableAutoGenLabel
              }
            </p>
          </div>
          <Switch
            checked={autoGenEnabled}
            onCheckedChange={onToggleAutoGeneration}
          />
        </div>

        {/* Frequency Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{T.frequencyLabel}</Label>
            <Select value={autoGenFrequency} onValueChange={setAutoGenFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{T.daily}</SelectItem>
                <SelectItem value="weekly">{T.weekly}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{T.timeLabel}</Label>
            <Input
              type="time"
              value={autoGenTime}
              onChange={(e) => setAutoGenTime(e.target.value)}
            />
          </div>
        </div>

        {/* Weekly Day Selection */}
        {autoGenFrequency === 'weekly' && (
          <div className="space-y-2">
            <Label>{T.dayOfWeekLabel}</Label>
            <Select value={autoGenDay} onValueChange={setAutoGenDay}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">{T.monday}</SelectItem>
                <SelectItem value="tuesday">{T.tuesday}</SelectItem>
                <SelectItem value="wednesday">{T.wednesday}</SelectItem>
                <SelectItem value="thursday">{T.thursday}</SelectItem>
                <SelectItem value="friday">{T.friday}</SelectItem>
                <SelectItem value="saturday">{T.saturday}</SelectItem>
                <SelectItem value="sunday">{T.sunday}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Separator />

        {/* Content Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="autoTopics">{T.topicPoolLabel}</Label>
            <Textarea
              id="autoTopics"
              placeholder={T.topicPoolPlaceholder}
              value={autoGenTopics}
              onChange={(e) => setAutoGenTopics(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              {T.topicPoolHelper}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoKeywords">{T.defaultKeywordsLabel}</Label>
            <Input
              id="autoKeywords"
              placeholder={T.defaultKeywordsPlaceholder}
              value={autoGenKeywords}
              onChange={(e) => setAutoGenKeywords(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Auto-Generation Intelligence Settings */}
        <div className="space-y-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-indigo-600" />
            <Label className="text-base font-semibold">{T.smartAutoGenLabel}</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{T.autoContentTypeLabel}</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder={T.selectTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">{T.blogPosts}</SelectItem>
                  <SelectItem value="how-to">{T.howToGuides}</SelectItem>
                  <SelectItem value="listicle">{T.listArticles}</SelectItem>
                  <SelectItem value="comparison">{T.comparisons}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{T.autoWritingStyleLabel}</Label>
              <Select value={writingStyle} onValueChange={setWritingStyle}>
                <SelectTrigger>
                  <SelectValue placeholder={T.selectStylePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">{T.styleProfessional}</SelectItem>
                  <SelectItem value="conversational">{T.styleConversational}</SelectItem>
                  <SelectItem value="authoritative">{T.styleAuthoritative}</SelectItem>
                  <SelectItem value="casual">{T.styleCasual}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{T.targetAudienceLabel}</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder={T.selectAudiencePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{T.audienceGeneral}</SelectItem>
                  <SelectItem value="beginners">{T.audienceBeginners}</SelectItem>
                  <SelectItem value="professionals">{T.audienceProfessionals}</SelectItem>
                  <SelectItem value="experts">{T.audienceExperts}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{T.industryFocusLabel}</Label>
              <Select value={industryFocus} onValueChange={setIndustryFocus}>
                <SelectTrigger>
                  <SelectValue placeholder={T.selectIndustryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{T.industryGeneral}</SelectItem>
                  <SelectItem value="technology">{T.industryTech}</SelectItem>
                  <SelectItem value="marketing">{T.industryMarketing}</SelectItem>
                  <SelectItem value="finance">{T.industryFinance}</SelectItem>
                  <SelectItem value="healthcare">{T.industryHealthcare}</SelectItem>
                  <SelectItem value="education">{T.industryEducation}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{T.smartFeaturesLabel}</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                {T.badgeTrendAnalysis}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Target className="h-3 w-3 mr-1" />
                {T.badgeSEOOOptimization}
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Brain className="h-3 w-3 mr-1" />
                {T.badgeSmartKeywords}
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <Award className="h-3 w-3 mr-1" />
                {T.badgeQualityScoring}
              </Badge>
            </div>
          </div>
        </div>

        {/* Trending Topics Suggestions */}
        {trendingTopics.length > 0 && (
          <div className="space-y-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <Label className="text-sm font-semibold">{T.trendingTopicsLabel}</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-orange-100 text-xs"
                  onClick={() => {
                    const currentTopics = autoGenTopics ? autoGenTopics + ', ' + topic : topic;
                    setAutoGenTopics(currentTopics);
                  }}
                >
                  + {topic}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500">{T.clickToAddTopics}</p>
          </div>
        )}

        {/* Content Suggestions */}
        {contentSuggestions.length > 0 && (
          <div className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-semibold">{T.aiContentSuggestionsLabel}</Label>
            </div>
            <div className="space-y-2">
              {contentSuggestions.slice(0, 3).map((suggestion, index) => (
                <div key={index} className="text-xs text-gray-600 p-2 bg-white rounded border-l-2 border-green-300">
                  💡 {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Generation */}
        <div className="pt-4">
          <Button 
            onClick={onGenerateAutoContent}
            variant="outline"
            className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200"
            disabled={!autoGenTopics.trim()}
          >
            <Settings className="h-4 w-4 mr-2" />
            {T.testButton}
          </Button>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={autoGenEnabled ? "default" : "secondary"} className="bg-blue-100 text-blue-700">
            {autoGenEnabled ? T.statusActiveBadge : T.statusInactiveBadge}
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {autoGenFrequency === 'daily' ? T.dailyScheduleBadge : T.weeklyScheduleBadge}
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {T.topicsCountBadge.replace("{count}", autoGenTopics.split(',').filter(t => t.trim()).length.toString())}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoGenerationSettings;
