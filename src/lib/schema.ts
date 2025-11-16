import { z } from "zod";

export const DealFormSchema = z.object({
  annualRevenue: z.number().min(1, "Annual revenue must be at least $1"),
  churnRate: z.number().min(0).max(100, "Churn rate cannot exceed 100%"),
  growthRate: z.number().min(-100, "Growth rate cannot be less than -100%").max(1000, "Growth rate cannot exceed 1000%").optional().default(0),
  earnOutPercent: z.number().min(0).max(100, "Earn out percentage cannot exceed 100%"),
  earnOutYears: z.number().min(1).max(10, "Earn out years cannot exceed 10").optional().default(1),
  sellerFinancingPercent: z.number().min(0).max(100, "Seller financing percentage cannot exceed 100%").optional().default(0),
  allCashPercent: z.number().min(0).max(100, "All cash percentage cannot exceed 100%").optional().default(0),
  taxRate: z.number().min(0).max(100, "Tax rate cannot exceed 100%").optional().default(20),
  interestRate: z.number().min(0).max(50, "Interest rate cannot exceed 50%").optional().default(0),
  currency: z.string().default("USD"),
  inflationRate: z.number().min(0).max(20, "Inflation rate cannot exceed 20%").optional().default(0),
}).refine((data) => {
  // Logical check: If all three percentages are provided, their sum should not exceed 100% (representing portions of the deal value)
  const sum = (data.earnOutPercent || 0) + (data.sellerFinancingPercent || 0) + (data.allCashPercent || 0);
  return sum <= 100;
}, {
  message: "The sum of earn out, seller financing, and all cash percentages cannot exceed 100%",
  path: ["earnOutPercent"], // Attach error to earnOutPercent
});


export type DealFormInput = z.infer<typeof DealFormSchema>;
