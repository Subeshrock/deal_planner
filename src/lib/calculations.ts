import { DealFormInput } from "./schema";
import type { DealSummary } from "../types/deal";
import { ChartData } from "@/types/chart";

export function calculateDealScenarios(data: DealFormInput): { chartData: ChartData[]; summary: DealSummary } {
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
  };
}
