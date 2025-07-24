import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Bot, 
  Zap, 
  Clock, 
  Target, 
  TrendingUp, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ArrowRight,
  BarChart3,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AutomationRule {
  id: string;
  name: string;
  type: 'keyword' | 'content' | 'technical' | 'meta' | 'schema';
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastRun: Date;
  nextRun: Date;
  success_rate: number;
  improvements_made: number;
}

interface AutomationTask {
  id: string;
  title: string;
  status: 'running' | 'completed' | 'scheduled' | 'failed';
  progress: number;
  description: string;
  eta: string;
  impact: string;
}

const SEOAutomationEngine = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [activeTasks, setActiveTasks] = useState<AutomationTask[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [automationScore, setAutomationScore] = useState(0);

  const t = (en: string, th: string) => language === 'th' ? th : en;

  useEffect(() => {
    // Initialize with default automation rules
    const defaultRules: AutomationRule[] = [
      {
        id: '1',
        name: t('Auto Keyword Tracking', 'ติดตามคำสำคัญอัตโนมัติ'),
        type: 'keyword',
        enabled: true,
        frequency: 'daily',
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 60 * 60 * 1000),
        success_rate: 94,
        improvements_made: 156
      },
      {
        id: '2',
        name: t('Smart Meta Tag Optimization', 'ปรับปรุง Meta Tag อัจฉริยะ'),
        type: 'meta',
        enabled: true,
        frequency: 'weekly',
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        success_rate: 89,
        improvements_made: 43
      },
      {
        id: '3',
        name: t('Content Gap Detection', 'ตรวจจับช่องว่างเนื้อหา'),
        type: 'content',
        enabled: false,
        frequency: 'weekly',
        lastRun: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        success_rate: 87,
        improvements_made: 28
      },
      {
        id: '4',
        name: t('Technical SEO Monitoring', 'ตรวจสอบ SEO ทางเทคนิค'),
        type: 'technical',
        enabled: true,
        frequency: 'daily',
        lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000),
        success_rate: 96,
        improvements_made: 72
      },
      {
        id: '5',
        name: t('Schema Markup Updates', 'อัพเดท Schema Markup'),
        type: 'schema',
        enabled: true,
        frequency: 'monthly',
        lastRun: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        success_rate: 92,
        improvements_made: 15
      }
    ];

    setAutomationRules(defaultRules);
    setAutomationScore(Math.round(defaultRules.reduce((acc, rule) => acc + rule.success_rate, 0) / defaultRules.length));
  }, [language]);

  const initializeAutomation = () => {
    setIsInitializing(true);
    
    const tasks: AutomationTask[] = [
      {
        id: '1',
        title: t('Scanning current SEO status', 'สแกนสถานะ SEO ปัจจุบัน'),
        status: 'running',
        progress: 75,
        description: t('Analyzing site structure and performance', 'วิเคราะห์โครงสร้างและประสิทธิภาพเว็บไซต์'),
        eta: '2 min',
        impact: t('+15% traffic potential', 'ศักยภาพทราฟฟิก +15%')
      },
      {
        id: '2',
        title: t('Setting up keyword monitoring', 'ตั้งค่าการตรวจสอบคำสำคัญ'),
        status: 'scheduled',
        progress: 0,
        description: t('AI will track 500+ relevant keywords', 'AI จะติดตาม 500+ คำสำคัญที่เกี่ยวข้อง'),
        eta: '5 min',
        impact: t('+12 ranking positions', '+12 อันดับการจัดอันดับ')
      },
      {
        id: '3',
        title: t('Optimizing meta descriptions', 'ปรับปรุง meta descriptions'),
        status: 'scheduled',
        progress: 0,
        description: t('Auto-generating SEO-optimized descriptions', 'สร้าง descriptions ที่ปรับปรุง SEO อัตโนมัติ'),
        eta: '3 min',
        impact: t('+8% CTR improvement', 'ปรับปรุง CTR +8%')
      }
    ];

    setActiveTasks(tasks);

    // Simulate task progression
    setTimeout(() => {
      setActiveTasks(prev => prev.map((task, index) => {
        if (index === 0) return { ...task, status: 'completed', progress: 100 };
        if (index === 1) return { ...task, status: 'running', progress: 45 };
        return task;
      }));
    }, 3000);

    setTimeout(() => {
      setActiveTasks(prev => prev.map((task, index) => {
        if (index === 1) return { ...task, status: 'completed', progress: 100 };
        if (index === 2) return { ...task, status: 'running', progress: 30 };
        return task;
      }));
    }, 6000);

    setTimeout(() => {
      setActiveTasks(prev => prev.map(task => ({ ...task, status: 'completed', progress: 100 })));
      setIsInitializing(false);
      toast({
        title: t("Automation Engine Activated!", "เครื่องมืออัตโนมัติเปิดใช้งานแล้ว!"),
        description: t("AI is now optimizing your SEO 24/7", "AI กำลังปรับปรุง SEO ของคุณตลอด 24/7")
      });
    }, 9000);
  };

  const toggleRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword': return <Target className="h-4 w-4" />;
      case 'content': return <Eye className="h-4 w-4" />;
      case 'technical': return <Zap className="h-4 w-4" />;
      case 'meta': return <BarChart3 className="h-4 w-4" />;
      case 'schema': return <RefreshCw className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {t("SEO Automation Engine", "เครื่องมือ SEO อัตโนมัติ")}
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        <CardDescription>
          {t("AI-powered automation that optimizes your SEO 24/7 without manual intervention", "ระบบอัตโนมัติที่ขับเคลื่อนด้วย AI ที่ปรับปรุง SEO ของคุณตลอด 24/7 โดยไม่ต้องแทรกแซงด้วยมือ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Automation Score */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-green-700">{automationScore}%</div>
              <div className="text-sm text-green-600">
                {t("Automation Efficiency", "ประสิทธิภาพการทำงานอัตโนมัติ")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {t("Tasks Automated", "งานอัตโนมัติ")}
              </div>
              <div className="font-medium">{automationRules.filter(r => r.enabled).length}/5</div>
            </div>
          </div>
          <Progress value={automationScore} className="h-2" />
        </Card>

        {/* Initialize Button */}
        {!isInitializing && activeTasks.length === 0 && (
          <Card className="p-6 text-center bg-gradient-to-r from-blue-50 to-purple-50">
            <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-medium mb-2">
              {t("Ready to Automate Your SEO?", "พร้อมที่จะทำ SEO อัตโนมัติหรือยัง?")}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t("Let AI handle keyword tracking, meta optimization, and technical monitoring", "ให้ AI จัดการการติดตามคำสำคัญ การปรับปรุงเมตา และการตรวจสอบทางเทคนิค")}
            </p>
            <Button onClick={initializeAutomation} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Zap className="h-4 w-4 mr-2" />
              {t("Start Automation", "เริ่มการทำงานอัตโนมัติ")}
            </Button>
          </Card>
        )}

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isInitializing ? 'animate-spin' : ''}`} />
              {t("Active Automation Tasks", "งานอัตโนมัติที่ทำงาน")}
            </h3>
            {activeTasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{task.title}</span>
                    <Badge className={getStatusColor(task.status)}>
                      {t(task.status, task.status === 'running' ? 'กำลังทำงาน' : 
                         task.status === 'completed' ? 'เสร็จสิ้น' : 
                         task.status === 'scheduled' ? 'กำหนดการ' : 'ล้มเหลว')}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">{task.eta}</div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 mr-4">
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{task.progress}%</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-medium">{task.impact}</span>
                  {task.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Automation Rules */}
        <div className="space-y-4">
          <h3 className="font-medium">
            {t("Automation Rules", "กฎการทำงานอัตโนมัติ")}
          </h3>
          
          {automationRules.map((rule) => (
            <Card key={rule.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getTypeIcon(rule.type)}
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-xs text-gray-500">
                      {t("Runs", "ทำงาน")} {t(rule.frequency, 
                        rule.frequency === 'daily' ? 'รายวัน' : 
                        rule.frequency === 'weekly' ? 'รายสัปดาห์' : 'รายเดือน')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <div className="text-green-600 font-medium">
                      {rule.success_rate}% {t("success", "สำเร็จ")}
                    </div>
                    <div className="text-gray-500">
                      {rule.improvements_made} {t("improvements", "การปรับปรุง")}
                    </div>
                  </div>
                  
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="text-gray-500">{t("Last run", "ทำงานล่าสุด")}: </span>
                  {rule.lastRun.toLocaleDateString()}
                </div>
                <div>
                  <span className="text-gray-500">{t("Next run", "ทำงานครั้งต่อไป")}: </span>
                  {rule.nextRun.toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-lg font-bold">24/7</div>
            <div className="text-xs text-gray-600">
              {t("Monitoring", "การตรวจสอบ")}
            </div>
          </Card>
          
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold">+23%</div>
            <div className="text-xs text-gray-600">
              {t("Avg Traffic Boost", "เพิ่มทราฟฟิกเฉลี่ย")}
            </div>
          </Card>
          
          <Card className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-lg font-bold">500+</div>
            <div className="text-xs text-gray-600">
              {t("Keywords Tracked", "คำสำคัญที่ติดตาม")}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOAutomationEngine;