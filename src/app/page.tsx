"use client";

import { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { calculateDealScenarios } from "@/lib/calculations";
import { Chart } from "@/components/ChartDisplay";
import { Summary } from "@/components/SummaryCard";
import { ExportButton } from "@/components/ExportButton";
import type { DealFormInput } from "@/lib/schema";
import type { ChartData } from "@/types/chart";
import type { DealSummary } from "@/types/deal";

interface PDFData {
  revenue: number;
  churn: number;
  growth?: number;
  earnOutPercentage?: number;
  taxRate?: number;
}

export default function DealPage() {
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
  const [summary, setSummary] = useState<DealSummary | null>(null);
  const [pdfData, setPdfData] = useState<PDFData>()
  const [chartImage, setChartImage] = useState<string | null>(null);

  const handleChartCapture = (img: string) => {
    setChartImage(img);
  };

  const handleCalculate = (data: DealFormInput) => {
    const { annualRevenue, churnRate, growthRate, earnOutPercent, taxRate } = data;
    setPdfData({churn: churnRate, revenue: annualRevenue, growth: growthRate, earnOutPercentage: earnOutPercent, taxRate});
    const { chartData, summary } = calculateDealScenarios(data);
    setChartData(chartData);
    setSummary(summary);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Deal Calculator</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: Form */}
        <div className="md:w-1/2">
          <InputForm onSubmit={handleCalculate} />
        </div>

        {/* Right side: Chart, Summary, Export */}
        <div className="md:w-1/2 flex flex-col space-y-6">
          {chartData && summary && pdfData && (
            <>
              <Chart data={chartData} />
              {/* 🔁 Hidden chart used only for image capture */}
              {chartImage === null && (
               <Chart
                 data={chartData}
                 hidden
                 onCapture={handleChartCapture}
               />
              )}
              <Summary summary={summary} />
               <ExportButton summary={summary} revenue={pdfData.revenue} churn={pdfData?.churn} earnOutPercentage={pdfData?.earnOutPercentage} growth={pdfData?.growth} taxRate={pdfData?.taxRate} yearlyData={chartData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
