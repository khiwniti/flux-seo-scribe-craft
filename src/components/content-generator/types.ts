
export interface GeneratedImage {
  id: number;
  url: string;
  alt: string;
  prompt: string;
  enhanced: boolean;
  quality: string;
  seoOptimized: boolean;
}

export interface ContentInsights {
  estimatedReadTime?: number;
  targetKeywordDensity?: string;
  recommendedHeadings?: number;
  suggestedImages?: number;
  seoComplexity?: string;
  competitiveLevel?: string;
  languageOptimization?: string;
  professionalGrade?: string;
}

export interface AutoGenHistoryEntry {
  id: number;
  topic: string;
  date: Date;
  status: string;
  contentPreview: string;
  wordCount: number;
  seoScore: number;
  language: string;
}
