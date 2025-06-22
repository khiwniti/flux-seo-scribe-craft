
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target } from 'lucide-react';

interface AnalyticsData {
  topPerformingKeywords: Array<{
    keyword: string;
    position: number;
    volume: number;
    difficulty: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  contentGaps: Array<{
    topic: string;
    opportunity: number;
    competition: 'low' | 'medium' | 'high';
    suggestedAngle: string;
  }>;
  competitorAnalysis: Array<{
    competitor: string;
    topTopics: string[];
    contentType: string;
    avgWordCount: number;
  }>;
  trendingTopics: Array<{
    topic: string;
    growth: number;
    relevance: number;
    urgency: 'high' | 'medium' | 'low';
  }>;
  performanceMetrics: {
    avgCTR: number;
    avgBounceRate: number;
    topContentTypes: string[];
    bestPerformingLength: number;
  };
}

interface AnalyticsOverviewProps {
  analyticsData: AnalyticsData;
}

const AnalyticsOverview = ({ analyticsData }: AnalyticsOverviewProps) => {
  const { language } = useLanguage();

  const t = (enText: string, thText: string): string => {
    return language === 'th' ? thText : enText;
  };

  const T = {
    summaryTopKeywords: t("Top Keywords", "คีย์เวิร์ดเด่น"),
    summaryContentGaps: t("Content Gaps", "ช่องว่างเนื้อหา"),
    summaryTrendingTopics: t("Trending Topics", "หัวข้อที่กำลังนิยม"),
    summaryAvgCTR: t("Avg CTR", "CTR เฉลี่ย"),
    cardTitleTopKeywords: t("Top Performing Keywords", "คีย์เวิร์ดที่มีประสิทธิภาพสูงสุด"),
    keywordPosition: t("Position", "อันดับ"),
    keywordVolume: t("volume", "ปริมาณ"),
    trendUp: t("up", "ขึ้น"),
    trendDown: t("down", "ลง"),
    trendStable: t("stable", "คงที่"),
    cardTitleContentOpps: t("Content Opportunities", "โอกาสด้านเนื้อหา"),
    opportunitySuffix: t("opportunity", "โอกาส"),
  };

  const formatKeywordDetails = (keyword: any) => {
    return `${T.keywordPosition} ${keyword.position} • ${keyword.volume.toLocaleString()} ${T.keywordVolume}`;
  };

  const getTrendText = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return T.trendUp;
    if (trend === 'down') return T.trendDown;
    return T.trendStable;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{analyticsData.topPerformingKeywords.length}</div>
            <div className="text-sm text-gray-600">{T.summaryTopKeywords}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{analyticsData.contentGaps.length}</div>
            <div className="text-sm text-gray-600">{T.summaryContentGaps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{analyticsData.trendingTopics.length}</div>
            <div className="text-sm text-gray-600">{T.summaryTrendingTopics}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{analyticsData.performanceMetrics.avgCTR}%</div>
            <div className="text-sm text-gray-600">{T.summaryAvgCTR}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {T.cardTitleTopKeywords}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsData.topPerformingKeywords.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{keyword.keyword}</div>
                  <div className="text-sm text-gray-600">{formatKeywordDetails(keyword)}</div>
                </div>
                <Badge className={keyword.trend === 'up' ? 'bg-green-100 text-green-700' : 
                               keyword.trend === 'down' ? 'bg-red-100 text-red-700' : 
                               'bg-gray-100 text-gray-700'}>
                  {getTrendText(keyword.trend)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-4 w-4" />
              {T.cardTitleContentOpps}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsData.contentGaps.map((gap, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{gap.topic}</div>
                  <Badge className="bg-blue-100 text-blue-700">{gap.opportunity}% {T.opportunitySuffix}</Badge>
                </div>
                <div className="text-sm text-gray-600">{gap.suggestedAngle}</div>
                <Progress value={gap.opportunity} className="mt-2 h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
