
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // Added for KPIs
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Added for Keyword Scoring
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Added for Intent
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

// State for Goals and Scope
interface GoalsState {
  campaignObjective: string;
  targetAudience: string;
  businessObjectives: string;
  kpis: string[];
  timeline: string;
}

// State for individual keyword in Keyword Research
interface KeywordRow {
  id: string;
  keyword: string;
  searchVolume: number | string; // Allow string for input flexibility
  keywordDifficulty: number | string;
  relevance: number | string; // Scale of 1-10
  currentRanking: number | string;
  cpc?: number | string;
  score?: number;
  intent?: 'informational' | 'navigational' | 'transactional' | '';
  targetPage?: string;
}

const AdvancedSEOAnalytics: React.FC = () => {
  const [goals, setGoals] = useState<GoalsState>({
    campaignObjective: '',
    targetAudience: '',
    businessObjectives: '',
    kpis: [],
    timeline: '',
  });

  const [keywordsInput, setKeywordsInput] = useState<string>('');
  const [keywordRows, setKeywordRows] = useState<KeywordRow[]>([]);
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    // Main Header
    mainTitle: t("Advanced SEO Analytics & Strategy Hub", "ศูนย์กลางการวิเคราะห์และกลยุทธ์ SEO ขั้นสูง"),
    mainDescription: t("A comprehensive workflow to analyze, strategize, and optimize your SEO performance.", "ขั้นตอนการทำงานที่ครอบคลุมเพื่อวิเคราะห์ วางกลยุทธ์ และเพิ่มประสิทธิภาพ SEO ของคุณ"),

    // Accordion Titles
    accordionGoals: t("1. Define Goals and Scope", "1. กำหนดเป้าหมายและขอบเขต"),
    accordionKeywords: t("2. Keyword Research and Scoring", "2. การวิจัยและให้คะแนนคีย์เวิร์ด"),
    accordionTechSEO: t("3. Technical SEO Audit", "3. การตรวจสอบ SEO เชิงเทคนิค"),
    accordionOnPage: t("4. On-Page SEO Analysis", "4. การวิเคราะห์ SEO บนหน้าเว็บ"),
    accordionOffPage: t("5. Off-Page SEO and Link Analysis", "5. การวิเคราะห์ SEO นอกหน้าเว็บและลิงก์"),
    accordionContentStrategy: t("6. Content Strategy Development", "6. การพัฒนากลยุทธ์เนื้อหา"),
    accordionPerformance: t("7. Performance Tracking and Reporting", "7. การติดตามและรายงานประสิทธิภาพ"),
    accordionMonitoring: t("8. Continuous Monitoring and Adaptation", "8. การตรวจสอบและปรับปรุงอย่างต่อเนื่อง"),

    // Section 1: Goals
    labelCampaignObjective: t("SEO Campaign Objective", "วัตถุประสงค์แคมเปญ SEO"),
    placeholderCampaignObjective: t("e.g., Increase organic traffic by 20% in 6 months, achieve top 3 rankings for X keywords.", "เช่น เพิ่มทราฟฟิกออร์แกนิก 20% ใน 6 เดือน, ติดอันดับ 1-3 สำหรับ X คีย์เวิร์ด"),
    labelTargetAudience: t("Target Audience", "กลุ่มเป้าหมาย"),
    placeholderTargetAudience: t("Describe your ideal customer personas, their demographics, needs, and online behavior.", "อธิบายลักษณะลูกค้าในอุดมคติ ข้อมูลประชากร ความต้องการ และพฤติกรรมออนไลน์"),
    labelBusinessObjectives: t("Broader Business Objectives", "วัตถุประสงค์ทางธุรกิจที่กว้างขึ้น"),
    placeholderBusinessObjectives: t("e.g., Increase overall sales, improve brand visibility, generate qualified leads.", "เช่น เพิ่มยอดขายโดยรวม, ปรับปรุงการมองเห็นแบรนด์, สร้างลูกค้าเป้าหมายที่มีคุณภาพ"),
    labelKPIs: t("Key Performance Indicators (KPIs)", "ตัวชี้วัดประสิทธิภาพหลัก (KPIs)"),
    kpiOrganicTraffic: t("organic traffic", "ทราฟฟิกออร์แกนิก"),
    kpiKeywordRankings: t("keyword rankings", "อันดับคีย์เวิร์ด"),
    kpiCTR: t("ctr", "CTR"),
    kpiBounceRate: t("bounce rate", "อัตราตีกลับ"),
    kpiConversions: t("conversions", "คอนเวอร์ชัน"),
    kpiImpressions: t("impressions", "การแสดงผล"),
    labelTimeline: t("Campaign Timeline", "ระยะเวลาแคมเปญ"),
    placeholderTimeline: t("e.g., 3 months, 6 months, 1 year", "เช่น 3 เดือน, 6 เดือน, 1 ปี"),
    buttonSaveGoals: t("Save Goals & Strategy", "บันทึกเป้าหมายและกลยุทธ์"),
    alertGoalsSaved: t("Goals saved! (Check console for data)", "บันทึกเป้าหมายแล้ว! (ตรวจสอบข้อมูลในคอนโซล)"),

    // Section 2: Keywords
    titleKeywordDiscovery: t("Keyword Discovery", "การค้นหาคีย์เวิร์ด"),
    labelEnterKeywords: t("Enter Keywords (one per line)", "ป้อนคีย์เวิร์ด (หนึ่งรายการต่อบรรทัด)"),
    placeholderEnterKeywords: t("e.g.\nbest coffee beans\nhow to make espresso\nlocal coffee shops", "เช่น\nเมล็ดกาแฟที่ดีที่สุด\nวิธีทำเอสเพรสโซ\nร้านกาแฟในพื้นที่"),
    buttonAddKeywords: t("Add Keywords to Table", "เพิ่มคีย์เวิร์ดลงตาราง"),
    buttonAnalyzeCompetitorKeywords: t("Analyze Competitor Keywords (Mock)", "วิเคราะห์คีย์เวิร์ดคู่แข่ง (จำลอง)"),
    titleKeywordScoring: t("Keyword Scoring & Categorization", "การให้คะแนนและจัดหมวดหมู่คีย์เวิร์ด"),
    thKeyword: t("Keyword", "คีย์เวิร์ด"),
    thSearchVol: t("Search Vol.", "ปริมาณค้นหา"),
    thKD: t("KD (0-100)", "KD (0-100)"),
    thRelevance: t("Relevance (1-10)", "ความเกี่ยวข้อง (1-10)"),
    thRank: t("Rank", "อันดับ"),
    thCPC: t("CPC ($)", "CPC ($)"),
    thScore: t("Score", "คะแนน"),
    thIntent: t("Intent", "ความตั้งใจ"),
    thTargetPage: t("Target Page URL", "URL หน้าเป้าหมาย"),
    thActions: t("Actions", "การดำเนินการ"),
    placeholderInputKeyword: t("Enter keyword", "ป้อนคีย์เวิร์ด"),
    placeholderInputSearchVol: t("e.g. 1500", "เช่น 1500"),
    placeholderInputKD: t("e.g. 30", "เช่น 30"),
    placeholderInputRelevance: t("1-10", "1-10"),
    placeholderInputRank: t("e.g. 5", "เช่น 5"),
    placeholderInputCPC: t("$0.75", "$0.75"),
    selectIntent: t("Select Intent", "เลือกความตั้งใจ"),
    intentInformational: t("Informational", "เพื่อให้ข้อมูล"),
    intentNavigational: t("Navigational", "เพื่อนำทาง"),
    intentTransactional: t("Transactional", "เพื่อการซื้อขาย"),
    placeholderTargetPage: t("/blog/my-article", "/blog/บทความของฉัน"),
    buttonAddNewKeyword: t("Add New Keyword", "เพิ่มคีย์เวิร์ดใหม่"),

    // Section 3: Technical SEO
    labelSiteURLAudit: t("Site URL for Audit", "URL เว็บไซต์สำหรับตรวจสอบ"),
    placeholderSiteURL: t("https://example.com", "https://example.com"),
    buttonRunHealthCheck: t("Run Site Health Check (Mock)", "ตรวจสอบสุขภาพเว็บไซต์ (จำลอง)"),
    buttonAnalyzeCWV: t("Analyze Core Web Vitals (Mock)", "วิเคราะห์ Core Web Vitals (จำลอง)"),
    buttonCheckIndexability: t("Check Indexability (Mock)", "ตรวจสอบการจัดทำดัชนี (จำลอง)"),
    labelMockAuditResults: t("Mock Audit Results:", "ผลการตรวจสอบจำลอง:"),
    textMockAuditResults: t("No broken links found. Core Web Vitals: LCP 2.1s, FID 30ms, CLS 0.05. Indexability: 95% pages indexed.", "ไม่พบลิงก์เสีย Core Web Vitals: LCP 2.1s, FID 30ms, CLS 0.05 การจัดทำดัชนี: 95% ของหน้าถูกจัดทำดัชนีแล้ว"),

    // Section 4: On-Page
    labelPageURLAnalyze: t("Page URL to Analyze", "URL หน้าเว็บสำหรับวิเคราะห์"),
    placeholderPageURL: t("https://example.com/my-page", "https://example.com/หน้าของฉัน"),
    titleTitleTag: t("Title Tag", "แท็กชื่อเรื่อง"),
    textCurrentTitle: t("Your Current Title (Mock)", "ชื่อเรื่องปัจจุบันของคุณ (จำลอง)"),
    titleMetaDescription: t("Meta Description", "คำอธิบายเมตา"),
    textCurrentMeta: t("Your current meta description is here... (Mock)", "คำอธิบายเมตาปัจจุบันของคุณอยู่ที่นี่... (จำลอง)"),
    titleHeaderTags: t("Header Tags (H1-H6)", "แท็กหัวเรื่อง (H1-H6)"),
    textHeaderTagsFound: t("H1: Found, H2: 3 Found (Mock)", "H1: พบ, H2: พบ 3 รายการ (จำลอง)"),
    titleKeywordDensity: t("Keyword Density", "ความหนาแน่นของคีย์เวิร์ด"),
    textKeywordDensityValue: t("Primary Keyword: 2.5% (Mock)", "คีย์เวิร์ดหลัก: 2.5% (จำลอง)"),
    buttonOptimizeTitleMeta: t("Optimize Title/Meta (Mock)", "ปรับแต่งชื่อเรื่อง/เมตา (จำลอง)"),
    buttonImproveInternalLinking: t("Improve Internal Linking (Mock)", "ปรับปรุงการลิงก์ภายใน (จำลอง)"),

    // Section 5: Off-Page
    labelDomainBacklinkAudit: t("Domain for Backlink Audit", "โดเมนสำหรับตรวจสอบลิงก์ย้อนกลับ"),
    placeholderDomain: t("example.com", "example.com"),
    titleTotalBacklinks: t("Total Backlinks", "ลิงก์ย้อนกลับทั้งหมด"),
    textTotalBacklinksValue: t("1,250 (Mock)", "1,250 (จำลอง)"),
    titleReferringDomains: t("Referring Domains", "โดเมนที่อ้างอิง"),
    textReferringDomainsValue: t("350 (Mock)", "350 (จำลอง)"),
    titleToxicLinks: t("Toxic Links Found", "พบลิงก์ที่เป็นพิษ"),
    textToxicLinksValue: t("15 (Mock)", "15 (จำลอง)"),
    buttonIdentifyToxicLinks: t("Identify Toxic Links (Mock)", "ระบุลิงก์ที่เป็นพิษ (จำลอง)"),
    buttonStartLinkBuilding: t("Start Link Building Campaign (Mock)", "เริ่มแคมเปญสร้างลิงก์ (จำลอง)"),

    // Section 6: Content Strategy
    labelContentPlan: t("Content Plan based on Keyword Clusters", "แผนเนื้อหาตามกลุ่มคีย์เวิร์ด"),
    placeholderContentPlan: t("Develop pillar pages and topic clusters...", "พัฒนาหน้าหลักและกลุ่มหัวข้อ..."),
    labelPublishingFreq: t("Publishing Frequency", "ความถี่ในการเผยแพร่"),
    placeholderPublishingFreq: t("e.g., 2 articles per week", "เช่น 2 บทความต่อสัปดาห์"),
    labelMockContentCalendar: t("Mock Content Calendar:", "ปฏิทินเนื้อหาจำลอง:"),
    textMockCalendar1: t("Mon, Oct 28: Blog Post - \"Ultimate Guide to X\"", "จ., 28 ต.ค.: บทความบล็อก - \"สุดยอดคู่มือ X\""),
    textMockCalendar2: t("Wed, Oct 30: Video - \"How to use Y feature\"", "พ., 30 ต.ค.: วิดีโอ - \"วิธีใช้คุณสมบัติ Y\""),
    textMockCalendar3: t("Fri, Nov 1: Case Study - \"Success with Z\"", "ศ., 1 พ.ย.: กรณีศึกษา - \"ความสำเร็จกับ Z\""),

    // Section 7: Performance
    titleKeywordRankingsReport: t("Keyword Rankings", "อันดับคีย์เวิร์ด"),
    textKeywordRankingsValue: t("+5 positions (Mock)", "+5 อันดับ (จำลอง)"),
    titleOrganicTrafficReport: t("Organic Traffic", "ทราฟฟิกออร์แกนิก"),
    textOrganicTrafficValue: t("10.2K/mo (Mock)", "10.2K/เดือน (จำลอง)"),
    titleConversionsReport: t("Conversions", "คอนเวอร์ชัน"),
    textConversionsValue: t("120 (Mock)", "120 (จำลอง)"),
    textMockChartArea: t("[Mock Chart Area for Performance Trends]", "[พื้นที่แผนภูมิจำลองสำหรับแนวโน้มประสิทธิภาพ]"),
    buttonGenerateReport: t("Generate Monthly Report (Mock)", "สร้างรายงานรายเดือน (จำลอง)"),

    // Section 8: Monitoring
    labelAlgoLog: t("Algorithm Update Log & Notes", "บันทึกการอัปเดตอัลกอริทึมและหมายเหตุ"),
    placeholderAlgoLog: t("Log major algorithm updates and their impact...", "บันทึกการอัปเดตอัลกอริทึมที่สำคัญและผลกระทบ..."),
    buttonCheckNewTrends: t("Check for New SEO Trends (Mock)", "ตรวจสอบแนวโน้ม SEO ใหม่ (จำลอง)"),
  };


  const handleGoalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGoals(prev => ({ ...prev, [name]: value }));
  };

  const handleKpiChange = (kpi: string) => {
    setGoals(prev => ({
      ...prev,
      kpis: prev.kpis.includes(kpi) ? prev.kpis.filter(item => item !== kpi) : [...prev.kpis, kpi],
    }));
  };

  const availableKpis = [
    { id: 'organic traffic', label: T.kpiOrganicTraffic },
    { id: 'keyword rankings', label: T.kpiKeywordRankings },
    { id: 'ctr', label: T.kpiCTR },
    { id: 'bounce rate', label: T.kpiBounceRate },
    { id: 'conversions', label: T.kpiConversions },
    { id: 'impressions', label: T.kpiImpressions },
  ];

  const handleSaveGoals = () => {
    console.log('Goals Saved:', goals);
    // Here you would typically send this data to a backend or state management solution
    alert(T.alertGoalsSaved);
  };

  const calculateKeywordScore = (row: KeywordRow): number => {
    // Normalize inputs (assuming KD is 0-100, others 1-10 or similar user input)
    // For this example, let's define a simple normalization logic.
    // Search Volume: log scale or user-defined scale (e.g. 0-100 based on expected max)
    // KD: 0-100 (already a common scale)
    // Relevance: User input 1-10. We can scale to 0-100 by multiplying by 10.
    // Current Rank: Higher is worse. We can invert and scale. (e.g. 100 - rank, capped at 0)
    
    const sv = parseFloat(String(row.searchVolume)) || 0; // Treat empty or invalid as 0
    const kd = parseFloat(String(row.keywordDifficulty)) || 0; // 0-100
    const rel = (parseFloat(String(row.relevance)) || 0) * 10; // Scale 1-10 to 0-100
    let rank = parseFloat(String(row.currentRanking)) || 101; // Default to >100 if not ranked or invalid

    // Normalize Search Volume (example: simple cap at 100,000, then scale to 0-100)
    const normalizedSV = Math.min(sv / 1000, 100); // e.g. 100k volume = 100 score

    // Normalize Current Rank (e.g. Rank 1 = 100, Rank 100 = 1, Rank >100 = 0)
    const normalizedRank = Math.max(0, 100 - (rank - 1));

    // Formula: (Search Volume * 0.3) + (KD * 0.3) + (Relevance * 0.3) + (Current Rank * 0.1)
    // Weights should sum to 1. Let's adjust: SV 0.3, KD 0.3, Rel 0.2, Rank 0.2
    const score =
        (normalizedSV * 0.3) +
        ((100 - kd) * 0.3) + // Higher KD is worse, so invert
        (rel * 0.2) +
        (normalizedRank * 0.2);

    return parseFloat(score.toFixed(2));
  };

  const handleAddKeywordsFromTextarea = () => {
    const newKeywords = keywordsInput
      .split('\n')
      .map(k => k.trim())
      .filter(k => k)
      .map(k => ({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2), // simple unique id
        keyword: k,
        searchVolume: '',
        keywordDifficulty: '',
        relevance: '',
        currentRanking: '',
        cpc: '',
        intent: '' as const, // Fix type issue by explicitly casting to const
        targetPage: '',
        score: 0, // Initial score
      } as KeywordRow)); // Explicitly cast to KeywordRow type

    const updatedKeywords = [...keywordRows, ...newKeywords];
    updatedKeywords.forEach(kw => kw.score = calculateKeywordScore(kw));
    setKeywordRows(updatedKeywords);
    setKeywordsInput(''); // Clear textarea
  };

  const handleKeywordRowChange = (id: string, field: keyof KeywordRow, value: any) => {
    setKeywordRows(prevRows =>
      prevRows.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          // Recalculate score if relevant fields change
          if (['searchVolume', 'keywordDifficulty', 'relevance', 'currentRanking'].includes(field as string)) {
            updatedRow.score = calculateKeywordScore(updatedRow);
          }
          return updatedRow;
        }
        return row;
      })
    );
  };

  const removeKeywordRow = (id: string) => {
    setKeywordRows(prevRows => prevRows.filter(row => row.id !== id));
  };

  const addNewKeywordRow = () => {
    const newRow: KeywordRow = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        keyword: '',
        searchVolume: '',
        keywordDifficulty: '',
        relevance: '',
        currentRanking: '',
        cpc: '',
        intent: '',
        targetPage: '',
        score: 0,
    };
    setKeywordRows(prev => [...prev, newRow]);
  }


  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            {T.mainTitle}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {T.mainDescription}
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-6" defaultValue="item-1">
        {/* Section 1: Define Goals and Scope */}
        <AccordionItem value="item-1" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            {T.accordionGoals}
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-6">
              <div>
                <Label htmlFor="campaignObjective" className="text-lg font-medium text-gray-700">{T.labelCampaignObjective}</Label>
                <Textarea
                  id="campaignObjective"
                  name="campaignObjective"
                  value={goals.campaignObjective}
                  onChange={handleGoalInputChange}
                  placeholder={T.placeholderCampaignObjective}
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="targetAudience" className="text-lg font-medium text-gray-700">{T.labelTargetAudience}</Label>
                <Textarea
                  id="targetAudience"
                  name="targetAudience"
                  value={goals.targetAudience}
                  onChange={handleGoalInputChange}
                  placeholder={T.placeholderTargetAudience}
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="businessObjectives" className="text-lg font-medium text-gray-700">{T.labelBusinessObjectives}</Label>
                <Textarea
                  id="businessObjectives"
                  name="businessObjectives"
                  value={goals.businessObjectives}
                  onChange={handleGoalInputChange}
                  placeholder={T.placeholderBusinessObjectives}
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div>
                <Label className="text-lg font-medium text-gray-700">{T.labelKPIs}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {availableKpis.map(kpi => (
                    <div key={kpi.id} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                      <Checkbox
                        id={`kpi-${kpi.id}`}
                        checked={goals.kpis.includes(kpi.id)}
                        onCheckedChange={() => handleKpiChange(kpi.id)}
                      />
                      <Label htmlFor={`kpi-${kpi.id}`} className="text-sm font-medium capitalize">
                        {kpi.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="timeline" className="text-lg font-medium text-gray-700">{T.labelTimeline}</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  value={goals.timeline}
                  onChange={handleGoalInputChange}
                  placeholder={T.placeholderTimeline}
                  className="mt-2"
                />
              </div>
              <div className="text-right">
                <Button onClick={handleSaveGoals} size="lg">
                  {T.buttonSaveGoals}
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Keyword Research and Scoring */}
        <AccordionItem value="item-2" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            {T.accordionKeywords}
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{T.titleKeywordDiscovery}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="manualKeywords" className="font-medium">{T.labelEnterKeywords}</Label>
                    <Textarea
                      id="manualKeywords"
                      value={keywordsInput}
                      onChange={(e) => setKeywordsInput(e.target.value)}
                      placeholder={T.placeholderEnterKeywords}
                      className="mt-2 min-h-[120px]"
                    />
                     <Button onClick={handleAddKeywordsFromTextarea} className="mt-2 mr-2">{T.buttonAddKeywords}</Button>
                  </div>
                  <Button variant="outline">{T.buttonAnalyzeCompetitorKeywords}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{T.titleKeywordScoring}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">{T.thKeyword}</TableHead>
                          <TableHead>{T.thSearchVol}</TableHead>
                          <TableHead>{T.thKD}</TableHead>
                          <TableHead>{T.thRelevance}</TableHead>
                          <TableHead>{T.thRank}</TableHead>
                          <TableHead>{T.thCPC}</TableHead>
                          <TableHead>{T.thScore}</TableHead>
                          <TableHead>{T.thIntent}</TableHead>
                          <TableHead>{T.thTargetPage}</TableHead>
                          <TableHead>{T.thActions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <Input
                                value={row.keyword}
                                onChange={(e) => handleKeywordRowChange(row.id, 'keyword', e.target.value)}
                                placeholder={T.placeholderInputKeyword}
                                className="min-w-[180px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={row.searchVolume}
                                onChange={(e) => handleKeywordRowChange(row.id, 'searchVolume', e.target.value)}
                                placeholder={T.placeholderInputSearchVol}
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={row.keywordDifficulty}
                                onChange={(e) => handleKeywordRowChange(row.id, 'keywordDifficulty', e.target.value)}
                                placeholder={T.placeholderInputKD}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={row.relevance}
                                onChange={(e) => handleKeywordRowChange(row.id, 'relevance', e.target.value)}
                                placeholder={T.placeholderInputRelevance}
                                min="1" max="10"
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={row.currentRanking}
                                onChange={(e) => handleKeywordRowChange(row.id, 'currentRanking', e.target.value)}
                                placeholder={T.placeholderInputRank}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                value={row.cpc}
                                onChange={(e) => handleKeywordRowChange(row.id, 'cpc', e.target.value)}
                                placeholder={T.placeholderInputCPC}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{row.score}</TableCell>
                            <TableCell>
                              <Select
                                value={row.intent}
                                onValueChange={(value) => handleKeywordRowChange(row.id, 'intent', value)}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder={T.selectIntent} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="informational">{T.intentInformational}</SelectItem>
                                  <SelectItem value="navigational">{T.intentNavigational}</SelectItem>
                                  <SelectItem value="transactional">{T.intentTransactional}</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={row.targetPage}
                                onChange={(e) => handleKeywordRowChange(row.id, 'targetPage', e.target.value)}
                                placeholder={T.placeholderTargetPage}
                                className="min-w-[180px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => removeKeywordRow(row.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button onClick={addNewKeywordRow} className="mt-4">{T.buttonAddNewKeyword}</Button>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Technical SEO Audit (Placeholder) */}
        <AccordionItem value="item-3" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            {T.accordionTechSEO}
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
             <div className="space-y-4">
                <div>
                    <Label htmlFor="technicalAuditUrl">{T.labelSiteURLAudit}</Label>
                    <Input id="technicalAuditUrl" placeholder={T.placeholderSiteURL} className="mt-1"/>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">{T.buttonRunHealthCheck}</Button>
                    <Button variant="outline">{T.buttonAnalyzeCWV}</Button>
                    <Button variant="outline">{T.buttonCheckIndexability}</Button>
                </div>
                <div>
                    <Label>{T.labelMockAuditResults}</Label>
                    <Textarea readOnly value={T.textMockAuditResults} className="mt-1 min-h-[100px] bg-gray-50"/>
                </div>
             </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: On-Page SEO Analysis (Placeholder) */}
        <AccordionItem value="item-4" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            {T.accordionOnPage}
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="onPageUrl">{T.labelPageURLAnalyze}</Label>
                    <Input id="onPageUrl" placeholder={T.placeholderPageURL} className="mt-1"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle>{T.titleTitleTag}</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-gray-700">{T.textCurrentTitle}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{T.titleMetaDescription}</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-gray-700">{T.textCurrentMeta}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{T.titleHeaderTags}</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-gray-700">{T.textHeaderTagsFound}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{T.titleKeywordDensity}</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-gray-700">{T.textKeywordDensityValue}</p></CardContent>
                    </Card>
                </div>
                 <div className="flex space-x-2 mt-4">
                    <Button variant="outline">{T.buttonOptimizeTitleMeta}</Button>
                    <Button variant="outline">{T.buttonImproveInternalLinking}</Button>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Off-Page SEO and Link Analysis (Placeholder) */}
        <AccordionItem value="item-5" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            {T.accordionOffPage}
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="offPageDomain">{T.labelDomainBacklinkAudit}</Label>
                    <Input id="offPageDomain" placeholder={T.placeholderDomain} className="mt-1"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader><CardTitle>{T.titleTotalBacklinks}</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{T.textTotalBacklinksValue}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{T.titleReferringDomains}</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{T.textReferringDomainsValue}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{T.titleToxicLinks}</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold text-red-600">{T.textToxicLinksValue}</p></CardContent>
                    </Card>
                </div>
                <div className="flex space-x-2 mt-4">
                    <Button variant="destructive">{T.buttonIdentifyToxicLinks}</Button>
                    <Button>{T.buttonStartLinkBuilding}</Button>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 6: Content Strategy Development (Placeholder) */}
        <AccordionItem value="item-6" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            {T.accordionContentStrategy}
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="contentPlan">{T.labelContentPlan}</Label>
                    <Textarea id="contentPlan" placeholder={T.placeholderContentPlan} className="mt-1 min-h-[150px]"/>
                </div>
                <div>
                    <Label htmlFor="publishingFreq">{T.labelPublishingFreq}</Label>
                    <Input id="publishingFreq" placeholder={T.placeholderPublishingFreq} className="mt-1"/>
                </div>
                <div>
                    <Label>{T.labelMockContentCalendar}</Label>
                    <div className="p-4 border rounded-md mt-1 bg-gray-50 min-h-[100px]">
                        <p className="text-sm text-gray-500">{T.textMockCalendar1}</p>
                        <p className="text-sm text-gray-500">{T.textMockCalendar2}</p>
                        <p className="text-sm text-gray-500">{T.textMockCalendar3}</p>
                    </div>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 7: Performance Tracking and Reporting (Placeholder) */}
        <AccordionItem value="item-7" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            {T.accordionPerformance}
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <Card className="text-center">
                        <CardHeader><CardTitle>{T.titleKeywordRankingsReport}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold text-green-600">{T.textKeywordRankingsValue}</p></CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader><CardTitle>{T.titleOrganicTrafficReport}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold text-blue-600">{T.textOrganicTrafficValue}</p></CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader><CardTitle>{T.titleConversionsReport}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold text-purple-600">{T.textConversionsValue}</p></CardContent>
                    </Card>
                </div>
                {/* Mock chart placeholder - actual charts would use a library like Recharts */}
                <div className="p-4 border rounded-md mt-1 bg-gray-50 min-h-[150px] flex items-center justify-center">
                    <p className="text-gray-500">{T.textMockChartArea}</p>
                </div>
                <Button size="lg">{T.buttonGenerateReport}</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 8: Continuous Monitoring and Adaptation (Placeholder) */}
        <AccordionItem value="item-8" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            {T.accordionMonitoring}
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="algoLog">{T.labelAlgoLog}</Label>
                    <Textarea id="algoLog" placeholder={T.placeholderAlgoLog} className="mt-1 min-h-[100px]"/>
                </div>
                <Button variant="outline">{T.buttonCheckNewTrends}</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdvancedSEOAnalytics;
