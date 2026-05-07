import type { IdeaInput } from '@/types/evaluation';

export interface CashLiquidityPoint {
  month: number;
  cumulativeBurn: number;
  cumulativeRevenue: number;
  cashLiquidity: number;
  fundingAmount: number;
}

export interface BurnRevenuePoint {
  month: number;
  monthlyBurn: number;
  monthlyRevenue: number;
}

export interface SensitivityCell {
  price: number;
  conversion: number;
  breakEvenMonth: number;
}

interface StageAnalyticsParams {
  monthlyGrowth: number;
  acqRatio: number;
  churnRate: number;
  grossMargin: number;
}

const stageAnalytics: Record<string, StageAnalyticsParams> = {
  'pre-seed': { monthlyGrowth: 0.14, acqRatio: 0.22, churnRate: 0.06, grossMargin: 0.62 },
  seed: { monthlyGrowth: 0.12, acqRatio: 0.18, churnRate: 0.05, grossMargin: 0.65 },
  'series a': { monthlyGrowth: 0.10, acqRatio: 0.15, churnRate: 0.04, grossMargin: 0.68 },
  'series b': { monthlyGrowth: 0.08, acqRatio: 0.12, churnRate: 0.03, grossMargin: 0.70 },
  growth: { monthlyGrowth: 0.06, acqRatio: 0.10, churnRate: 0.02, grossMargin: 0.72 },
};

export function getAnalyticsParams(stage: string): StageAnalyticsParams {
  const normalized = stage.trim().toLowerCase();
  return stageAnalytics[normalized] || stageAnalytics.seed;
}

export function deriveFundingAmount(input: IdeaInput): number {
  if (input.fundingAmount && input.fundingAmount > 0) return input.fundingAmount;

  const stage = input.fundingStage.trim().toLowerCase();
  switch (stage) {
    case 'pre-seed':
      return 600000;
    case 'seed':
      return 2200000;
    case 'series a':
      return 8500000;
    case 'series b':
      return 22000000;
    case 'growth':
      return 52000000;
    default:
      return 2200000;
  }
}

export function buildLiquiditySeries(input: IdeaInput, months = 24): CashLiquidityPoint[] {
  const fundingAmount = deriveFundingAmount(input);
  const { monthlyGrowth } = getAnalyticsParams(input.fundingStage);
  let cumulativeBurn = 0;
  let cumulativeRevenue = 0;
  let users = Math.max(1, input.teamSize);

  return Array.from({ length: months }, (_, index) => {
    const month = index + 1;
    const burn = Math.round(input.monthlyBurn * Math.pow(1 + 0.01, index));
    cumulativeBurn += burn;
    if (month > 1) {
      users *= 1 + monthlyGrowth;
    }
    const revenue = Math.round(users * input.pricePerUser);
    cumulativeRevenue += revenue;
    return {
      month,
      cumulativeBurn,
      cumulativeRevenue,
      fundingAmount,
      cashLiquidity: Math.round(fundingAmount - cumulativeBurn + cumulativeRevenue),
    };
  });
}

export function buildBurnRevenueSeries(input: IdeaInput, months = 24): BurnRevenuePoint[] {
  const { monthlyGrowth } = getAnalyticsParams(input.fundingStage);
  let users = Math.max(1, input.teamSize);

  return Array.from({ length: months }, (_, index) => {
    const month = index + 1;
    const monthlyBurn = Math.round(input.monthlyBurn * Math.pow(1 + 0.01, index));
    if (month > 1) {
      users *= 1 + monthlyGrowth;
    }
    const monthlyRevenue = Math.round(users * input.pricePerUser);

    return {
      month,
      monthlyBurn,
      monthlyRevenue,
    };
  });
}

export function calculatePaybackMonths(input: IdeaInput): number {
  const { acqRatio, grossMargin } = getAnalyticsParams(input.fundingStage);
  const effectiveCustomers = Math.max(1, input.teamSize) * 8;
  const cac = (input.monthlyBurn * acqRatio) / effectiveCustomers;
  const monthlyContribution = Math.max(1, input.pricePerUser) * grossMargin;
  return Number((cac / monthlyContribution).toFixed(1));
}

export function buildSensitivityMatrix(input: IdeaInput): SensitivityCell[] {
  const { monthlyGrowth } = getAnalyticsParams(input.fundingStage);
  const basePrice = Math.max(1, input.pricePerUser);
  const baseConversion = 0.04;
  const priceMultipliers = [0.75, 0.9, 1, 1.1, 1.25];
  const conversionRates = [0.02, 0.03, 0.04, 0.055, 0.07];

  return priceMultipliers.flatMap((multiplier) =>
    conversionRates.map((conversion) => {
      const price = Math.round(basePrice * multiplier);
      const breakEvenMonth = calculateBreakEvenMonth(input.teamSize, input.monthlyBurn, price, conversion, monthlyGrowth);
      return { price, conversion, breakEvenMonth };
    }),
  );
}

function calculateBreakEvenMonth(
  teamSize: number,
  monthlyBurn: number,
  pricePerUser: number,
  conversionRate: number,
  monthlyGrowth: number,
): number {
  const customers = Math.max(1, teamSize) * Math.max(0.0001, conversionRate);
  const burn = Math.max(1, monthlyBurn);
  const price = Math.max(0.01, pricePerUser);
  const growth = Math.max(0, monthlyGrowth);

  const revenueAtStart = price * customers;
  if (revenueAtStart <= 0) return Number.POSITIVE_INFINITY;
  if (burn <= revenueAtStart) return 1;
  if (growth <= 0) return Number.POSITIVE_INFINITY;

  const months = Math.log(burn / revenueAtStart) / Math.log(1 + growth);
  if (!Number.isFinite(months) || months < 1) return Number.POSITIVE_INFINITY;

  return Math.ceil(months);
}

export function findLiquidityIntersection(series: CashLiquidityPoint[]): number | null {
  return series.find((point) => point.cashLiquidity >= 0)?.month ?? null;
}

export function findMinimumLiquidityPoint(series: CashLiquidityPoint[]) {
  return series.reduce((minPoint, current) =>
    current.cashLiquidity < minPoint.cashLiquidity ? current : minPoint,
  series[0]);
}
