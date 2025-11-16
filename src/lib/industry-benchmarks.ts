// Industry benchmarking data
export interface IndustryBenchmark {
  industry: string;
  revenueMultiple: { min: number; avg: number; max: number };
  ebitdaMultiple: { min: number; avg: number; max: number };
  growthRate: { min: number; avg: number; max: number };
  dealSize: { min: number; avg: number; max: number };
  earnOutPercent: { min: number; avg: number; max: number };
  lastUpdated: string;
}

export const industryBenchmarks: Record<string, IndustryBenchmark> = {
  Technology: {
    industry: "Technology",
    revenueMultiple: { min: 2.5, avg: 4.2, max: 8.0 },
    ebitdaMultiple: { min: 8.0, avg: 12.5, max: 18.0 },
    growthRate: { min: 15, avg: 25, max: 50 },
    dealSize: { min: 5000000, avg: 25000000, max: 100000000 },
    earnOutPercent: { min: 10, avg: 25, max: 40 },
    lastUpdated: "2024-01"
  },
  Healthcare: {
    industry: "Healthcare",
    revenueMultiple: { min: 3.0, avg: 5.5, max: 9.0 },
    ebitdaMultiple: { min: 10.0, avg: 15.0, max: 22.0 },
    growthRate: { min: 8, avg: 15, max: 30 },
    dealSize: { min: 10000000, avg: 50000000, max: 200000000 },
    earnOutPercent: { min: 15, avg: 30, max: 45 },
    lastUpdated: "2024-01"
  },
  "Financial Services": {
    industry: "Financial Services",
    revenueMultiple: { min: 1.5, avg: 2.8, max: 5.0 },
    ebitdaMultiple: { min: 6.0, avg: 9.5, max: 14.0 },
    growthRate: { min: 5, avg: 12, max: 25 },
    dealSize: { min: 20000000, avg: 100000000, max: 500000000 },
    earnOutPercent: { min: 5, avg: 15, max: 25 },
    lastUpdated: "2024-01"
  },
  Manufacturing: {
    industry: "Manufacturing",
    revenueMultiple: { min: 1.0, avg: 2.2, max: 4.5 },
    ebitdaMultiple: { min: 5.0, avg: 8.0, max: 12.0 },
    growthRate: { min: 3, avg: 8, max: 15 },
    dealSize: { min: 15000000, avg: 75000000, max: 300000000 },
    earnOutPercent: { min: 8, avg: 18, max: 30 },
    lastUpdated: "2024-01"
  },
  Retail: {
    industry: "Retail",
    revenueMultiple: { min: 0.8, avg: 1.8, max: 3.5 },
    ebitdaMultiple: { min: 4.0, avg: 7.0, max: 11.0 },
    growthRate: { min: 2, avg: 6, max: 12 },
    dealSize: { min: 10000000, avg: 40000000, max: 150000000 },
    earnOutPercent: { min: 12, avg: 22, max: 35 },
    lastUpdated: "2024-01"
  },
  Energy: {
    industry: "Energy",
    revenueMultiple: { min: 1.2, avg: 2.5, max: 5.0 },
    ebitdaMultiple: { min: 4.5, avg: 7.5, max: 12.0 },
    growthRate: { min: 1, avg: 5, max: 10 },
    dealSize: { min: 50000000, avg: 200000000, max: 1000000000 },
    earnOutPercent: { min: 5, avg: 12, max: 20 },
    lastUpdated: "2024-01"
  },
  "Real Estate": {
    industry: "Real Estate",
    revenueMultiple: { min: 2.0, avg: 4.0, max: 7.0 },
    ebitdaMultiple: { min: 8.0, avg: 12.0, max: 18.0 },
    growthRate: { min: 2, avg: 5, max: 8 },
    dealSize: { min: 25000000, avg: 100000000, max: 500000000 },
    earnOutPercent: { min: 3, avg: 8, max: 15 },
    lastUpdated: "2024-01"
  }
};

export function getIndustryBenchmark(industry: string): IndustryBenchmark | null {
  return industryBenchmarks[industry] || null;
}

export function compareToIndustry(dealValue: number, industry: string, metric: 'revenue' | 'ebitda' | 'growth' | 'earnOut'): {
  benchmark: { min: number; avg: number; max: number };
  position: 'below_min' | 'below_avg' | 'at_avg' | 'above_avg' | 'above_max';
  percentile: number;
} | null {
  const benchmark = getIndustryBenchmark(industry);
  if (!benchmark) return null;

  let benchmarkRange: { min: number; avg: number; max: number };
  let value: number;

  switch (metric) {
    case 'revenue':
      benchmarkRange = benchmark.revenueMultiple;
      value = dealValue / 1000000; // Convert to millions for comparison
      break;
    case 'ebitda':
      benchmarkRange = benchmark.ebitdaMultiple;
      value = dealValue / 1000000;
      break;
    case 'growth':
      benchmarkRange = benchmark.growthRate;
      value = dealValue;
      break;
    case 'earnOut':
      benchmarkRange = benchmark.earnOutPercent;
      value = dealValue;
      break;
    default:
      return null;
  }

  let position: 'below_min' | 'below_avg' | 'at_avg' | 'above_avg' | 'above_max';
  let percentile: number;

  if (value < benchmarkRange.min) {
    position = 'below_min';
    percentile = 0;
  } else if (value < benchmarkRange.avg) {
    position = 'below_avg';
    percentile = ((value - benchmarkRange.min) / (benchmarkRange.avg - benchmarkRange.min)) * 50;
  } else if (value === benchmarkRange.avg) {
    position = 'at_avg';
    percentile = 50;
  } else if (value < benchmarkRange.max) {
    position = 'above_avg';
    percentile = 50 + ((value - benchmarkRange.avg) / (benchmarkRange.max - benchmarkRange.avg)) * 50;
  } else {
    position = 'above_max';
    percentile = 100;
  }

  return {
    benchmark: benchmarkRange,
    position,
    percentile: Math.round(percentile)
  };
}