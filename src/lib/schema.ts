import { z } from "zod";

export const DealFormSchema = z.object({
  annualRevenue: z.number().min(0),
  churnRate: z.number().min(0),
  growthRate: z.number().min(0).optional().default(0),
  earnOutPercent: z.number().min(0),
  earnOutYears: z.number().min(1).optional().default(1),
  sellerFinancingPercent: z.number().min(0).optional().default(0),
  allCashPercent: z.number().min(0).optional().default(0),
  taxRate: z.number().min(0).optional().default(20),
  interestRate: z.number().min(0).optional().default(0),
});


export type DealFormInput = z.infer<typeof DealFormSchema>;
