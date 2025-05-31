"use client";

import { Button } from "@/components/ui/button";
import { DealSummaryPdf } from "@/components/DealSummaryPdf"; // adjust path as needed
import type { DealSummary } from "@/types/deal";
import { pdf } from "@react-pdf/renderer";

type ExportButtonProps = {
  summary: DealSummary;
  revenue: number;
  churn: number;
  growth?: number;
  earnOutPercentage?: number;
  taxRate?: number;
  yearlyData: { year: number; earnOut: number; sellerFinancing: number; allCash: number }[];
  chartImage?: string | null; // 🔁 ADD THIS
};

export function ExportButton({
  summary,
  revenue,
  churn,
  growth,
  earnOutPercentage = 30,
  taxRate = 20,
  yearlyData,
  chartImage,
}: ExportButtonProps) {
  const handleExport = async () => {
  try {
    const doc = (
      <DealSummaryPdf
        revenue={revenue}
        churn={churn}
        growth={growth}
        earnOutPercentage={earnOutPercentage}
        taxRate={taxRate}
        summary={summary}
        yearlyData={yearlyData}
        chartImage={chartImage}
      />
    );

    const asPdf = pdf(); // ✅ fixed
    await asPdf.updateContainer(doc); // ✅ also await this
    const blob = await asPdf.toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "deal_summary.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
};


  return <Button onClick={handleExport}>Export to PDF</Button>;
}
