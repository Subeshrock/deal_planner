export type DealSummary = {
  earnOut: { total: number; taxes: number; net: number };
  sellerFinancing: { total: number; taxes: number; net: number };
  allCash: { total: number; taxes: number; net: number };
};