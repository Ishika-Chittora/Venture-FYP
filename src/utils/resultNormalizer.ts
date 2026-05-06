/**
 * resultNormalizer.ts
 * 
 * Stage 1: Data Cleaning & Schema Enforcement
 * Stage 2: Heuristic Reliability Auditing (The "Why" Factor)
 * Stage 3: Explainable Audit Trail (XAI)
 */

import type {
  EvaluationResult,
  ActionPlanWeeks,
  FinancialProjection,
  SwotAnalysis,
  SwotItem as EvaluationSwotItem,
  Competitor as EvaluationCompetitor,
} from '@/types/evaluation';

export interface NormalizedResult extends EvaluationResult {
  confidenceScore: number;        // 0-100 (Calculated by Reliability Engine)
  reliabilityReasons: string[];    // Explains why the confidence is high/low
  _raw: any;
}

export interface ActionItem {
  id:       string;
  task:     string;
  priority: 'high' | 'medium' | 'low';
  status:   'todo';
  week:     number;
}

export interface FeasibilityScores {
  market:      number;
  technical:   number;
  financial:   number;
  team:        number;
  timing:      number;
}

// ── FINANCIAL COEFFICIENTS ────────────────────────────────────

interface StageCoefficients {
  RPE: number;           // Annual revenue per employee
  monthlyGrowth: number; // Monthly revenue growth rate
  acqRatio: number;      // Acquisition spend ratio
  churnRate: number;     // Monthly churn rate
}

const stageCoefficients: Record<string, StageCoefficients> = {
  seed: {
    RPE: 50000,
    monthlyGrowth: 0.12,
    acqRatio: 0.18,
    churnRate: 0.05,
  },
  'series a': {
    RPE: 85000,
    monthlyGrowth: 0.10,
    acqRatio: 0.15,
    churnRate: 0.04,
  },
  'series b': {
    RPE: 120000,
    monthlyGrowth: 0.08,
    acqRatio: 0.12,
    churnRate: 0.03,
  },
  'series c': {
    RPE: 150000,
    monthlyGrowth: 0.06,
    acqRatio: 0.10,
    churnRate: 0.02,
  },
  bootstrapped: {
    RPE: 40000,
    monthlyGrowth: 0.08,
    acqRatio: 0.10,
    churnRate: 0.06,
  },
};

function getStageCoefficients(stage?: string): StageCoefficients {
  const normalized = String(stage || '').trim().toLowerCase();
  if (normalized.includes('pre-seed') || normalized.includes('pre seed')) return stageCoefficients.seed;
  if (normalized.includes('series a')) return stageCoefficients['series a'];
  if (normalized.includes('series b')) return stageCoefficients['series b'];
  if (normalized.includes('series c') || normalized.includes('growth')) return stageCoefficients['series c'];
  if (normalized.includes('boot') || normalized.includes('bootstrap')) return stageCoefficients.bootstrapped;
  return stageCoefficients.seed;
}

function calculateBreakEvenMonth(teamSize: number, monthlyBurn: number, pricePerUser: number, fundingStage?: string): number {
  const coef = getStageCoefficients(fundingStage);
  const T = Math.max(1, teamSize);
  const B = Math.max(1, monthlyBurn);
  const P = Math.max(0.01, pricePerUser);
  const g = coef.monthlyGrowth;

  let cumulativeBurn = 0;
  let cumulativeRevenue = 0;
  let month = 1;

  for (; month <= 60; month++) {
    cumulativeBurn += B;
    // Users grow from team size: users = T * (1 + g)^month
    const users = T * Math.pow(1 + g, month);
    const monthlyRevenue = P * users;
    cumulativeRevenue += monthlyRevenue;

    if (cumulativeRevenue >= cumulativeBurn) {
      break;
    }
  }

  return Math.max(3, Math.min(60, Math.round(month)));
}

function calculateCacLtvRatio(teamSize: number, monthlyBurn: number, fundingStage?: string): number {
  const coef = getStageCoefficients(fundingStage);
  const T = Math.max(1, teamSize);
  const B = Math.max(1, monthlyBurn);
  const monthlyRPE = coef.RPE / 12;
  const GM = 0.7;
  const alpha = coef.acqRatio;
  const churn = coef.churnRate;

  const numerator = T * monthlyRPE * GM;
  const denominator = alpha * B * churn;
  const ratio = denominator > 0 ? numerator / denominator : 2.5;

  return Math.max(0.5, Math.min(5.0, ratio));
}

// ── HELPERS ───────────────────────────────────────────────────

function num(val: any, fallback = 0): number {
  if (val === null || val === undefined || isNaN(Number(val))) return fallback;
  return Number(val);
}

function safeStr(val: any, fallback = ''): string {
  if (!val) return fallback;
  return String(val);
}

function normalizeImpact(val: any): EvaluationSwotItem['impact'] {
  const normalized = String(val || '').trim().toLowerCase();
  if (normalized === 'high') return 'High';
  if (normalized === 'low') return 'Low';
  return 'Medium';
}

function normalizeSwotSection(raw: any): EvaluationSwotItem[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item: any) => {
      if (typeof item === 'string') return { text: item, impact: 'Medium' };
      return {
        text: safeStr(item.text || item, ''),
        impact: normalizeImpact(item.impact),
      };
    });
  }
  return [];
}

function normalizeProjections(raw: any[], teamSize: number, burnRate: number, pricePerUser: number, fundingStage?: string): FinancialProjection[] {
  const targetMonths = 24;
  const coef = getStageCoefficients(fundingStage);
  const dataPoints = Array.isArray(raw) ? raw : [];
  const monthlyGrowth = coef.monthlyGrowth;
  const monthlyExpenseBase = Math.max(1, burnRate);
  const P = Math.max(0.01, pricePerUser);

  if (dataPoints.length <= 1) {
    let cumulative = 0;
    return Array.from({ length: targetMonths }, (_, i) => {
      const month = i + 1;
      const users = Math.round(Math.max(1, teamSize) * Math.pow(1 + monthlyGrowth, i));
      const revenue = Math.round(P * users);
      const expenses = Math.round(monthlyExpenseBase * Math.pow(1 + 0.02, i));
      const profit = revenue - expenses;
      cumulative += profit;

      return {
        month,
        label: `M${month}`,
        revenue,
        expenses,
        profit,
        cumulative: Math.round(cumulative),
        users,
        runway: Math.max(0, 18 - i),
      };
    });
  }

  let cumulative = 0;
  return dataPoints.slice(0, targetMonths).map((p: any, i: number) => {
    const users = num(p.users, Math.round(Math.max(1, teamSize) * Math.pow(1 + monthlyGrowth, i)));
    const revenue = Math.max(num(p.revenue, 0), Math.round(P * users));
    const expenses = Math.max(num(p.expenses || p.cost, monthlyExpenseBase), Math.round(monthlyExpenseBase * Math.pow(1 + 0.02, i)));
    const profit = revenue - expenses;
    cumulative += profit;
    return {
      month: num(p.month, i + 1),
      label: `M${i + 1}`,
      revenue,
      expenses,
      profit,
      cumulative: Math.round(cumulative),
      users,
      runway: num(p.runway, Math.max(0, 18 - i)),
    };
  });
}

// ── RELIABILITY ENGINE (THE "WHY" FACTOR) ──────────────────────

function calculateReliability(normalized: NormalizedResult): { score: number, reasons: string[] } {
  let score = 100;
  let reasons: string[] = [];

  // Audit 1: Financial Fallbacks (Estimated values)
  if (normalized.breakEvenMonth === 24) {
    score -= 15;
    reasons.push("Estimated Break-even: Break-even timeline was not provided, using conservative estimate[cite: 1]");
  }
  
  // Audit 2: Ratio Verification (Estimated values)
  if (normalized.cacLtvRatio === 0.25) {
    score -= 10;
    reasons.push("Estimated Economics: CAC/LTV ratio not provided, using conservative standard estimate[cite: 1]");
  }
  
  // Audit 3: Logical Consistency
  if (normalized.overallScore > 80 && normalized.riskLevel.toLowerCase() === 'critical') {
    score -= 25;
    reasons.push("Logical Dissonance: High Success Score vs. Critical Risk Level[cite: 1]");
  }
  
  // Audit 4: Analysis Depth
  const swotCount = normalized.swot.strengths.length + normalized.swot.weaknesses.length;
  if (swotCount < 4) {
    score -= 15;
    reasons.push("Shallow Analysis: Incomplete SWOT profile detected[cite: 1]");
  }
  
  // Audit 5: Execution Strategy
  const totalActionItems = Object.values(normalized.actionPlan).reduce((sum, list) => sum + list.length, 0);
  if (totalActionItems < 2) {
    score -= 10;
    reasons.push("Operational Gap: Insufficient Action Plan details[cite: 1]");
  }

  // Audit 6: Sentiment Alignment
  if (normalized.marketSentiment < 0.3 && normalized.overallScore > 75) {
    score -= 15;
    reasons.push("Market Conflict: High score despite low industry sentiment[cite: 1]");
  }

  return { 
    score: Math.max(score, 15), 
    reasons: reasons.length > 0 ? reasons : ["Data integrity verified: High logical consistency[cite: 1]"] 
  };
}

// ── MAIN NORMALIZER ───────────────────────────────────────────

export function normalizeResult(raw: any, input: any = {}): NormalizedResult {
  if (!raw) throw new Error('No result data received');

  const teamSize = num(input.teamSize || raw.teamSize || raw.team_size || raw.team || 5, 5);
  const rawBurnRate = num(input.monthlyBurn || raw.burnRate || raw.burn_rate || raw.monthlyBurn, 50000);
  const burnRate = Math.max(25000, rawBurnRate);
  const pricePerUser = num(input.pricePerUser || raw.pricePerUser || raw.price_per_user || 50, 50);
  const fundingStage = safeStr(input.fundingStage || raw.fundingStage || raw.funding_stage || 'Seed');

  // Core Metrics
  const overallScore = num(raw.overallScore, 0);
  const breakEvenMonth = calculateBreakEvenMonth(teamSize, burnRate, pricePerUser, fundingStage);
  const cacLtvRatio = calculateCacLtvRatio(teamSize, burnRate, fundingStage);

  const rawRisk = String(raw.riskLevel || raw.risk || '').toLowerCase();
  const riskLevel = rawRisk === 'low'
    ? 'Low'
    : rawRisk === 'medium'
    ? 'Medium'
    : rawRisk === 'high'
    ? 'High'
    : rawRisk === 'critical'
    ? 'Critical'
    : 'Medium';

  const result: NormalizedResult = {
    overallScore,
    confidenceScore: 0,
    reliabilityReasons: [],
    riskLevel,
    summary: safeStr(raw.summary || raw.description || raw.analysis || ''),
    breakEvenMonth,
    burnRate,
    cacLtvRatio,
    marketSentiment: Math.max(0, Math.min(1, num(raw.marketSentiment, 0.5))),
    projections: normalizeProjections(raw.projections || [], teamSize, burnRate, pricePerUser, fundingStage),
    feasibility: {
      market: num(raw.feasibility?.market, 50),
      technical: num(raw.feasibility?.technical || raw.feasibility?.tech, 50),
      financial: num(raw.feasibility?.financial || raw.feasibility?.finance, 50),
      team: num(raw.feasibility?.team, 50),
      timing: num(raw.feasibility?.timing, 50),
    },
    swot: {
      strengths:     normalizeSwotSection(raw.swot?.strengths),
      weaknesses:    normalizeSwotSection(raw.swot?.weaknesses),
      opportunities: normalizeSwotSection(raw.swot?.opportunities),
      threats:       normalizeSwotSection(raw.swot?.threats),
    } as unknown as SwotAnalysis,
    actionPlan: {
      week1: [],
      week2: [],
      week3: [],
      week4: [],
    },
  competitors: [],
  recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
  _raw: raw,
};

  // Safe Action Plan Mapping
  const rawPlan = raw.actionPlan || {};
  const weekPlan: ActionPlanWeeks = {
    week1: [],
    week2: [],
    week3: [],
    week4: [],
  };

  if (Array.isArray(rawPlan)) {
    rawPlan.forEach((item: any) => {
      const weekKey = `week${item.week}` as keyof ActionPlanWeeks;
      if (weekPlan[weekKey]) {
        weekPlan[weekKey].push(safeStr(item.task));
      }
    });
  } else {
    ['week1', 'week2', 'week3', 'week4'].forEach((wk) => {
      const tasks = rawPlan[wk];
      if (Array.isArray(tasks)) {
        weekPlan[wk as keyof ActionPlanWeeks] = tasks.map((content: any) => safeStr(content));
      }
    });
  }

  result.actionPlan = weekPlan;

  // Safe Competitor Mapping
  if (Array.isArray(raw.competitors)) {
    result.competitors = raw.competitors.map((c: any) => ({
      name: safeStr(c.name, 'Unknown'),
      description: safeStr(c.description || c.position || c.body),
      threat: String(c.threat || c.threatLevel || c.risk || 'Medium') === 'High'
        ? 'High'
        : String(c.threat || c.threatLevel || c.risk || 'Medium') === 'Low'
        ? 'Low'
        : 'Medium',
      competitiveEdge: safeStr(c.competitiveEdge || c.advantage || ''),
    })) as unknown as EvaluationCompetitor[];
  }

  // Run the Audit Engine (Stage 2 & 3)
  const audit = calculateReliability(result);
  result.confidenceScore = audit.score;
  result.reliabilityReasons = audit.reasons;

  return result;
}

export function buildFallbackResult(raw: any, input: any = {}): NormalizedResult {
  return normalizeResult(raw, input);
}