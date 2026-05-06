import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── STATISTICAL HELPERS ──────────────────────────────────────────────

function randomNormal(mean: number, std: number): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * std + mean;
}

function randomBeta(alpha: number, beta: number): number {
  // Using acceptance-rejection for beta distribution
  const maxIterations = 1000;
  for (let i = 0; i < maxIterations; i++) {
    const x = Math.random();
    const y = Math.random();
    if (y < Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) {
      return x;
    }
  }
  return Math.random(); // fallback
}

function percentile(data: number[], p: number): number {
  const sorted = [...data].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (upper >= sorted.length) return sorted[sorted.length - 1];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// ── MONTE CARLO SIMULATION ───────────────────────────────────────────

interface SimulationInput {
  teamSize: number;
  monthlyBurn: number;
  pricePerUser: number;
  fundingStage: string;
}

interface SimulationResult {
  breakEvenMonths: number[];
  p10: number;
  p50: number;
  p90: number;
  probabilityBreakEven12Months: number;
  probabilityBreakEven24Months: number;
  averageBreakEvenMonth: number;
  stdBreakEvenMonth: number;
}

function runMonteCarloSimulation(input: SimulationInput, numSimulations = 10000): SimulationResult {
  const { teamSize, monthlyBurn, pricePerUser, fundingStage } = input;

  // Stage coefficients (same as frontend)
  const stageCoefficients: Record<string, any> = {
    seed: { monthlyGrowth: 0.12, churnRate: 0.05, acqRatio: 0.18 },
    'series a': { monthlyGrowth: 0.10, churnRate: 0.04, acqRatio: 0.15 },
    'series b': { monthlyGrowth: 0.08, churnRate: 0.03, acqRatio: 0.12 },
    'series c': { monthlyGrowth: 0.06, churnRate: 0.02, acqRatio: 0.10 },
    bootstrapped: { monthlyGrowth: 0.08, churnRate: 0.06, acqRatio: 0.10 },
  };

  const coef = stageCoefficients[fundingStage.toLowerCase()] || stageCoefficients.seed;

  const breakEvenMonths: number[] = [];

  for (let sim = 0; sim < numSimulations; sim++) {
    // Randomize parameters with realistic distributions
    const growthRate = Math.max(0.01, randomNormal(coef.monthlyGrowth, coef.monthlyGrowth * 0.3));
    const churnRate = Math.max(0.01, Math.min(0.2, randomNormal(coef.churnRate, coef.churnRate * 0.5)));
    const effectiveGrowth = growthRate - churnRate; // Net growth

    // Market condition multiplier (beta distribution: optimistic bias)
    const marketMultiplier = randomBeta(2, 3) * 2; // 0.1 to 2.0, skewed positive

    const adjustedGrowth = Math.max(-0.1, effectiveGrowth * marketMultiplier);

    // Simulate break-even calculation
    let cumulativeBurn = 0;
    let cumulativeRevenue = 0;
    let users = teamSize;
    let month = 1;

    for (; month <= 60; month++) {
      cumulativeBurn += monthlyBurn;

      // Users grow with adjusted growth rate
      users *= (1 + adjustedGrowth);
      users = Math.max(1, users);

      const monthlyRevenue = pricePerUser * users;
      cumulativeRevenue += monthlyRevenue;

      if (cumulativeRevenue >= cumulativeBurn) {
        break;
      }
    }

    breakEvenMonths.push(Math.min(60, month));
  }

  // Calculate statistics
  const p10 = percentile(breakEvenMonths, 10);
  const p50 = percentile(breakEvenMonths, 50);
  const p90 = percentile(breakEvenMonths, 90);

  const breakEven12 = breakEvenMonths.filter(m => m <= 12).length / numSimulations;
  const breakEven24 = breakEvenMonths.filter(m => m <= 24).length / numSimulations;

  const sum = breakEvenMonths.reduce((a, b) => a + b, 0);
  const mean = sum / numSimulations;
  const variance = breakEvenMonths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numSimulations;
  const std = Math.sqrt(variance);

  return {
    breakEvenMonths,
    p10: Math.round(p10),
    p50: Math.round(p50),
    p90: Math.round(p90),
    probabilityBreakEven12Months: Math.round(breakEven12 * 100),
    probabilityBreakEven24Months: Math.round(breakEven24 * 100),
    averageBreakEvenMonth: Math.round(mean),
    stdBreakEvenMonth: Math.round(std),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SimulationInput = await req.json();

    if (!body.teamSize || !body.monthlyBurn || !body.pricePerUser) {
      throw new Error("Missing required parameters: teamSize, monthlyBurn, pricePerUser");
    }

    const result = runMonteCarloSimulation(body);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Monte Carlo simulation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});</content>
<parameter name="filePath">c:\Users\ISHIKA JAIN\ventureIQEngine\venture-iq-engine\supabase\functions\monte-carlo-simulation\index.ts