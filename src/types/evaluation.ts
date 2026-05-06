export interface IdeaInput {
  name: string;
  description: string;
  industry: string;
  targetMarket: string;
  fundingStage: string;
  monthlyBurn: number;
  teamSize: number;
  pricePerUser: number;
}

export interface Competitor {
  name: string;
  description: string;
  threat: 'High' | 'Medium' | 'Low';
  competitiveEdge?: string;
}

export interface SwotItem {
  text: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface SwotAnalysis {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
}

export interface FeasibilityScores {
  market: number;
  technical: number;
  financial: number;
  team: number;
  timing: number;
}

export interface FinancialProjection {
  month: number;
  revenue: number;
  expenses: number;
  profit: number;
  runway: number;
  cumulative?: number;
  users?: number;
  label?: string;
}

export interface ActionPlanWeeks {
  week1: string[];
  week2: string[];
  week3: string[];
  week4: string[];
}

export interface EvaluationResult {
  overallScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  feasibility: FeasibilityScores;
  competitors: Competitor[];
  swot: SwotAnalysis;
  projections: FinancialProjection[];
  burnRate: number;
  cacLtvRatio: number;
  breakEvenMonth: number;
  marketSentiment: number;
  summary: string;
  recommendations: string[];
  confidenceScore?: number;
  actionPlan?: ActionPlanWeeks;
}

export type EvaluationStep =
  | 'idle'
  | 'validating'
  | 'extracting_keywords'
  | 'searching_competitors'
  | 'analyzing_sentiment'
  | 'scoring_feasibility'
  | 'financial_modeling'
  | 'swot_analysis'
  | 'risk_assessment'
  | 'generating_projections'
  | 'compiling_report'
  | 'complete'
  | 'error';

export const STEP_LABELS: Record<EvaluationStep, string> = {
  idle: 'Ready',
  validating: 'Validating Input',
  extracting_keywords: 'Extracting Keywords',
  searching_competitors: 'Searching Competitors',
  analyzing_sentiment: 'Analyzing Market Sentiment',
  scoring_feasibility: 'Scoring Feasibility',
  financial_modeling: 'Financial Modeling',
  swot_analysis: 'SWOT Analysis',
  risk_assessment: 'Risk Assessment',
  generating_projections: 'Generating Projections',
  compiling_report: 'Compiling Report',
  complete: 'Complete',
  error: 'Error',
};

export const STEP_ORDER: EvaluationStep[] = [
  'validating',
  'extracting_keywords',
  'searching_competitors',
  'analyzing_sentiment',
  'scoring_feasibility',
  'financial_modeling',
  'swot_analysis',
  'risk_assessment',
  'generating_projections',
  'compiling_report',
  'complete',
];
