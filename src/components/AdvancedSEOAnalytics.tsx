
import React, { useState, useEffect } from 'react'; // Added useEffect
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
} from '@/components/ui/select';
import { Trash2, Save } from 'lucide-react'; // Added Save icon
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeWpAjaxRequest, WpAjaxError } from '@/lib/wpApiService';
import { toast as sonnerToast } from 'sonner';

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
  const queryClient = useQueryClient();

  const [goals, setGoals] = useState<GoalsState>({
    campaignObjective: '',
    targetAudience: '',
    businessObjectives: '',
    kpis: [],
    timeline: '',
  });

  const [keywordsInput, setKeywordsInput] = useState<string>('');
  const [keywordRows, setKeywordRows] = useState<KeywordRow[]>([]);


  const { isLoading: isLoadingKeywords, error: loadingKeywordsError } = useQuery<KeywordRow[], WpAjaxError>({
    queryKey: ['seoAnalyticsKeywords'],
    queryFn: async () => {
      const data = await makeWpAjaxRequest<KeywordRow[]>({
        wpAjaxAction: 'flux_seo_proxy',
        action: 'load_seo_analytics_keywords',
        method: 'POST',
      });
      return Array.isArray(data) ? data : []; // Ensure it's an array
    },
    onSuccess: (data) => {
      if (data) {
        // Data already set by query's default state or cache, but explicit setKeywordRows if needed for transformations
        setKeywordRows(data.map(kw => ({...kw, score: calculateKeywordScore(kw) }))); // Recalculate scores on load
        sonnerToast.success("Keyword list loaded successfully.");
      }
    },
    onError: (error) => {
      sonnerToast.error(`Failed to load keywords: ${error.message}`);
    },
    refetchOnWindowFocus: false,
  });

  const saveKeywordsMutation = useMutation<any, WpAjaxError, KeywordRow[]>({
    mutationFn: async (keywordsDataToSave) => {
      return makeWpAjaxRequest({
        wpAjaxAction: 'flux_seo_proxy',
        action: 'save_seo_analytics_keywords',
        data: keywordsDataToSave,
      });
    },
    onSuccess: () => {
      sonnerToast.success("Keyword list saved successfully!");
      queryClient.invalidateQueries(['seoAnalyticsKeywords']);
    },
    onError: (error) => {
      sonnerToast.error(`Failed to save keywords: ${error.message}`);
    }
  });

  const handleSaveKeywords = () => {
    saveKeywordsMutation.mutate(keywordRows);
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

  const availableKpis = ['organic traffic', 'keyword rankings', 'ctr', 'bounce rate', 'conversions', 'impressions'];

  const { isLoading: isLoadingGoals, error: loadingGoalsError } = useQuery<GoalsState, WpAjaxError>({
    queryKey: ['seoAnalyticsGoals'],
    queryFn: async () => {
      return makeWpAjaxRequest<GoalsState>({
        wpAjaxAction: 'flux_seo_proxy',
        action: 'load_seo_analytics_goals',
        method: 'POST', // Or GET, matching PHP if it matters for empty $_POST['data']
      });
    },
    onSuccess: (data) => {
      if (data) {
        setGoals(data);
        sonnerToast.success("Goals loaded successfully.");
      }
    },
    onError: (error) => {
      sonnerToast.error(`Failed to load goals: ${error.message}`);
    },
    refetchOnWindowFocus: false,
  });

  const saveGoalsMutation = useMutation<any, WpAjaxError, GoalsState>({
    mutationFn: async (goalsDataToSave) => {
      return makeWpAjaxRequest({
        wpAjaxAction: 'flux_seo_proxy',
        action: 'save_seo_analytics_goals',
        data: goalsDataToSave, // Send the goals object directly
      });
    },
    onSuccess: () => {
      sonnerToast.success("Goals saved successfully!");
      queryClient.invalidateQueries(['seoAnalyticsGoals']); // Refetch after save
    },
    onError: (error) => {
      sonnerToast.error(`Failed to save goals: ${error.message}`);
    }
  });

  const handleSaveGoals = () => {
    saveGoalsMutation.mutate(goals);
  };

  // useEffect to update local state if query data changes externally (e.g. after invalidation)
  // This might be redundant if setGoals in onSuccess of useQuery is sufficient
  // useEffect(() => {
  //   if (loadedGoalsData) {
  //     setGoals(loadedGoalsData);
  //   }
  // }, [loadedGoalsData]);


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
            Advanced SEO Analytics & Strategy Hub
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            A comprehensive workflow to analyze, strategize, and optimize your SEO performance.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-6" defaultValue="item-1">
        {/* Section 1: Define Goals and Scope */}
        <AccordionItem value="item-1" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            1. Define Goals and Scope
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-6">
              <div>
                <Label htmlFor="campaignObjective" className="text-lg font-medium text-gray-700">SEO Campaign Objective</Label>
                <Textarea
                  id="campaignObjective"
                  name="campaignObjective"
                  value={goals.campaignObjective}
                  onChange={handleGoalInputChange}
                  placeholder="e.g., Increase organic traffic by 20% in 6 months, achieve top 3 rankings for X keywords."
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="targetAudience" className="text-lg font-medium text-gray-700">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  name="targetAudience"
                  value={goals.targetAudience}
                  onChange={handleGoalInputChange}
                  placeholder="Describe your ideal customer personas, their demographics, needs, and online behavior."
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="businessObjectives" className="text-lg font-medium text-gray-700">Broader Business Objectives</Label>
                <Textarea
                  id="businessObjectives"
                  name="businessObjectives"
                  value={goals.businessObjectives}
                  onChange={handleGoalInputChange}
                  placeholder="e.g., Increase overall sales, improve brand visibility, generate qualified leads."
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div>
                <Label className="text-lg font-medium text-gray-700">Key Performance Indicators (KPIs)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {availableKpis.map(kpi => (
                    <div key={kpi} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                      <Checkbox
                        id={`kpi-${kpi}`}
                        checked={goals.kpis.includes(kpi)}
                        onCheckedChange={() => handleKpiChange(kpi)}
                      />
                      <Label htmlFor={`kpi-${kpi}`} className="text-sm font-medium capitalize">
                        {kpi}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="timeline" className="text-lg font-medium text-gray-700">Campaign Timeline</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  value={goals.timeline}
                  onChange={handleGoalInputChange}
                  placeholder="e.g., 3 months, 6 months, 1 year"
                  className="mt-2"
                />
              </div>
              <div className="text-right">
                <Button
                  onClick={handleSaveGoals}
                  size="lg"
                  disabled={saveGoalsMutation.isPending || isLoadingGoals}
                >
                  {saveGoalsMutation.isPending ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Goals & Strategy
                    </>
                  )}
                </Button>
              </div>
              {loadingGoalsError && (
                <p className="text-sm text-red-600 mt-2">Error loading goals: {loadingGoalsError.message}</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Keyword Research and Scoring */}
        <AccordionItem value="item-2" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            2. Keyword Research and Scoring
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Discovery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="manualKeywords" className="font-medium">Enter Keywords (one per line)</Label>
                    <Textarea
                      id="manualKeywords"
                      value={keywordsInput}
                      onChange={(e) => setKeywordsInput(e.target.value)}
                      placeholder="e.g.&#10;best coffee beans&#10;how to make espresso&#10;local coffee shops"
                      className="mt-2 min-h-[120px]"
                    />
                     <Button onClick={handleAddKeywordsFromTextarea} className="mt-2 mr-2">Add Keywords to Table</Button>
                  </div>
                  <Button variant="outline">Analyze Competitor Keywords (Mock)</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keyword Scoring & Categorization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Keyword</TableHead>
                          <TableHead>Search Vol.</TableHead>
                          <TableHead>KD (0-100)</TableHead>
                          <TableHead>Relevance (1-10)</TableHead>
                          <TableHead>Rank</TableHead>
                          <TableHead>CPC ($)</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Intent</TableHead>
                          <TableHead>Target Page URL</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <Input
                                value={row.keyword}
                                onChange={(e) => handleKeywordRowChange(row.id, 'keyword', e.target.value)}
                                placeholder="Enter keyword"
                                className="min-w-[180px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={row.searchVolume}
                                onChange={(e) => handleKeywordRowChange(row.id, 'searchVolume', e.target.value)}
                                placeholder="e.g. 1500"
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={row.keywordDifficulty}
                                onChange={(e) => handleKeywordRowChange(row.id, 'keywordDifficulty', e.target.value)}
                                placeholder="e.g. 30"
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={row.relevance}
                                onChange={(e) => handleKeywordRowChange(row.id, 'relevance', e.target.value)}
                                placeholder="1-10"
                                min="1" max="10"
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={row.currentRanking}
                                onChange={(e) => handleKeywordRowChange(row.id, 'currentRanking', e.target.value)}
                                placeholder="e.g. 5"
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text" // Use text for currency flexibility e.g. $0.50
                                value={row.cpc}
                                onChange={(e) => handleKeywordRowChange(row.id, 'cpc', e.target.value)}
                                placeholder="$0.75"
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
                                  <SelectValue placeholder="Select Intent" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="informational">Informational</SelectItem>
                                  <SelectItem value="navigational">Navigational</SelectItem>
                                  <SelectItem value="transactional">Transactional</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={row.targetPage}
                                onChange={(e) => handleKeywordRowChange(row.id, 'targetPage', e.target.value)}
                                placeholder="/blog/my-article"
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
                  <Button onClick={addNewKeywordRow} className="mt-4 mr-2">Add New Keyword</Button>
                  <Button
                    onClick={handleSaveKeywords}
                    className="mt-4"
                    disabled={saveKeywordsMutation.isPending || isLoadingKeywords}
                  >
                    {saveKeywordsMutation.isPending ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Saving Keywords...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Keyword List
                      </>
                    )}
                  </Button>
                  {loadingKeywordsError && (
                    <p className="text-sm text-red-600 mt-2">Error loading keywords: {loadingKeywordsError.message}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Technical SEO Audit (Placeholder) */}
        <AccordionItem value="item-3" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            3. Technical SEO Audit
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
             <div className="space-y-4">
                <div>
                    <Label htmlFor="technicalAuditUrl">Site URL for Audit</Label>
                    <Input id="technicalAuditUrl" placeholder="https://example.com" className="mt-1"/>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">Run Site Health Check (Mock)</Button>
                    <Button variant="outline">Analyze Core Web Vitals (Mock)</Button>
                    <Button variant="outline">Check Indexability (Mock)</Button>
                </div>
                <div>
                    <Label>Mock Audit Results:</Label>
                    <Textarea readOnly value="No broken links found. Core Web Vitals: LCP 2.1s, FID 30ms, CLS 0.05. Indexability: 95% pages indexed." className="mt-1 min-h-[100px] bg-gray-50"/>
                </div>
             </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: On-Page SEO Analysis (Placeholder) */}
        <AccordionItem value="item-4" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            4. On-Page SEO Analysis
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="onPageUrl">Page URL to Analyze</Label>
                    <Input id="onPageUrl" placeholder="https://example.com/my-page" className="mt-1"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Title Tag</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-gray-700">Your Current Title (Mock)</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Meta Description</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-gray-700">Your current meta description is here... (Mock)</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Header Tags (H1-H6)</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-gray-700">H1: Found, H2: 3 Found (Mock)</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Keyword Density</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-gray-700">Primary Keyword: 2.5% (Mock)</p></CardContent>
                    </Card>
                </div>
                 <div className="flex space-x-2 mt-4">
                    <Button variant="outline">Optimize Title/Meta (Mock)</Button>
                    <Button variant="outline">Improve Internal Linking (Mock)</Button>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Off-Page SEO and Link Analysis (Placeholder) */}
        <AccordionItem value="item-5" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            5. Off-Page SEO and Link Analysis
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="offPageDomain">Domain for Backlink Audit</Label>
                    <Input id="offPageDomain" placeholder="example.com" className="mt-1"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Total Backlinks</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">1,250 (Mock)</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Referring Domains</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">350 (Mock)</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Toxic Links Found</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold text-red-600">15 (Mock)</p></CardContent>
                    </Card>
                </div>
                <div className="flex space-x-2 mt-4">
                    <Button variant="destructive">Identify Toxic Links (Mock)</Button>
                    <Button>Start Link Building Campaign (Mock)</Button>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 6: Content Strategy Development (Placeholder) */}
        <AccordionItem value="item-6" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            6. Content Strategy Development
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="contentPlan">Content Plan based on Keyword Clusters</Label>
                    <Textarea id="contentPlan" placeholder="Develop pillar pages and topic clusters..." className="mt-1 min-h-[150px]"/>
                </div>
                <div>
                    <Label htmlFor="publishingFreq">Publishing Frequency</Label>
                    <Input id="publishingFreq" placeholder="e.g., 2 articles per week" className="mt-1"/>
                </div>
                <div>
                    <Label>Mock Content Calendar:</Label>
                    <div className="p-4 border rounded-md mt-1 bg-gray-50 min-h-[100px]">
                        <p className="text-sm text-gray-500">Mon, Oct 28: Blog Post - "Ultimate Guide to X"</p>
                        <p className="text-sm text-gray-500">Wed, Oct 30: Video - "How to use Y feature"</p>
                        <p className="text-sm text-gray-500">Fri, Nov 1: Case Study - "Success with Z"</p>
                    </div>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 7: Performance Tracking and Reporting (Placeholder) */}
        <AccordionItem value="item-7" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            7. Performance Tracking and Reporting
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <Card className="text-center">
                        <CardHeader><CardTitle>Keyword Rankings</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold text-green-600">+5 positions (Mock)</p></CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader><CardTitle>Organic Traffic</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold text-blue-600">10.2K/mo (Mock)</p></CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader><CardTitle>Conversions</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold text-purple-600">120 (Mock)</p></CardContent>
                    </Card>
                </div>
                {/* Mock chart placeholder - actual charts would use a library like Recharts */}
                <div className="p-4 border rounded-md mt-1 bg-gray-50 min-h-[150px] flex items-center justify-center">
                    <p className="text-gray-500">[Mock Chart Area for Performance Trends]</p>
                </div>
                <Button size="lg">Generate Monthly Report (Mock)</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 8: Continuous Monitoring and Adaptation (Placeholder) */}
        <AccordionItem value="item-8" className="bg-white rounded-lg shadow-md">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100">
            8. Continuous Monitoring and Adaptation
          </AccordionTrigger>
          <AccordionContent className="p-6 border-t">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="algoLog">Algorithm Update Log & Notes</Label>
                    <Textarea id="algoLog" placeholder="Log major algorithm updates and their impact..." className="mt-1 min-h-[100px]"/>
                </div>
                <Button variant="outline">Check for New SEO Trends (Mock)</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdvancedSEOAnalytics;
