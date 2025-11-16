import { DealFormInput } from "./schema";
import type { DealSummary } from "../types/deal";
import { ChartData } from "@/types/chart";

// Helper functions for financial metrics
function calculateNPV(cashFlows: number[], discountRate: number): number {
  return cashFlows.reduce((npv, cf, t) => npv + cf / Math.pow(1 + discountRate, t), 0);
}

function calculateIRR(cashFlows: number[]): number {
  // Simple approximation using binary search
  let low = -0.99;
  let high = 10;
  let mid = 0;
  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const npv = calculateNPV(cashFlows, mid);
    if (Math.abs(npv) < 0.01) break;
    if (npv > 0) low = mid;
    else high = mid;
  }
  return mid * 100; // Return as percentage
}

function calculatePaybackPeriod(cashFlows: number[]): number {
  let cumulative = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    cumulative += cashFlows[i];
    if (cumulative >= 0) return i;
  }
  return cashFlows.length;
}

export function calculateDealScenarios(data: DealFormInput): { chartData: ChartData[]; summary: DealSummary; metrics: { npv: number; irr: number; paybackPeriod: number } } {
  const {
    annualRevenue,
    churnRate,
    growthRate = 0,
    earnOutPercent,
    taxRate = 0,
    earnOutYears = 3,
    interestRate = 0,
    allCashPercent = 0,
    sellerFinancingPercent = 0,
  } = data;

  // Validate inputs
  if (annualRevenue <= 0) throw new Error("Annual revenue must be positive");
  if (churnRate < 0 || churnRate > 100) throw new Error("Churn rate must be between 0 and 100");
  if (earnOutPercent < 0 || earnOutPercent > 100) throw new Error("Earn out percentage must be between 0 and 100");
  if (taxRate < 0 || taxRate > 100) throw new Error("Tax rate must be between 0 and 100");
  if (earnOutYears < 1 || earnOutYears > 10) throw new Error("Earn out years must be between 1 and 10");

  const earnOutFraction = earnOutPercent / 100;
  const churnFraction = churnRate / 100;
  const growthFraction = (growthRate ?? 0) / 100;
  const taxFraction = (taxRate ?? 20) / 100;
  const sellerFinanceFraction = sellerFinancingPercent / 100;
  const interest = interestRate / 100;
  const allCashFraction = allCashPercent / 100;

  let revenue = annualRevenue;

  const chartData: ChartData[] = Array.from({ length: earnOutYears }, (_, i) => {
    const year = i + 1;
    const earnOut = revenue * earnOutFraction;
    const sellerFinancing = revenue * sellerFinanceFraction * Math.pow(1 + interest, year);
    const allCash = year === 1 ? annualRevenue * allCashFraction : 0;

    const data = {
      year: `Year ${year}`,
      earnOut: Math.round(earnOut),
      sellerFinancing: Math.round(sellerFinancing),
      allCash: Math.round(allCash),
    };

    revenue = revenue * (1 + growthFraction - churnFraction);
    return data;
  });

  const totalEarnOut = chartData.reduce((acc, d) => acc + d.earnOut, 0);
  const totalSellerFinancing = chartData.reduce((acc, d) => acc + d.sellerFinancing, 0);
  const totalAllCash = annualRevenue * allCashFraction;

  // Calculate cash flows for metrics (negative for outflows, positive for inflows)
  // Assuming buyer pays, so payouts are positive for seller
  const cashFlows = chartData.map(d => d.earnOut + d.sellerFinancing + d.allCash);
  // Add initial cash if any (but allCash is year 1, already included)

  const npv = calculateNPV(cashFlows, interest / 100);
  const irr = calculateIRR(cashFlows);
  const paybackPeriod = calculatePaybackPeriod(cashFlows);

  return {
    chartData,
    summary: {
      earnOut: {
        total: Math.round(totalEarnOut),
        taxes: Math.round(totalEarnOut * taxFraction),
        net: Math.round(totalEarnOut * (1 - taxFraction)),
      },
      sellerFinancing: {
        total: Math.round(totalSellerFinancing),
        taxes: Math.round(totalSellerFinancing * taxFraction),
        net: Math.round(totalSellerFinancing * (1 - taxFraction)),
      },
      allCash: {
        total: Math.round(totalAllCash),
        taxes: Math.round(totalAllCash * taxFraction),
        net: Math.round(totalAllCash * (1 - taxFraction)),
      },
    },
    metrics: {
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100, // Round to 2 decimals
      paybackPeriod,
    },
  };
}
