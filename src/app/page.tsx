"use client";

import { useState, useEffect } from "react";
import { InputForm } from "@/components/InputForm";
import { calculateDealScenarios } from "@/lib/calculations";
import { Chart } from "@/components/ChartDisplay";
import { Summary } from "@/components/SummaryCard";
import { ExportButton } from "@/components/ExportButton";
import { Button } from "@/components/ui/button";
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
  const [error, setError] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("deal-simulator-tutorial-seen");
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleChartCapture = (img: string) => {
    setChartImage(img);
  };

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("deal-simulator-tutorial-seen", "true");
  };

  const handleCalculate = (data: DealFormInput) => {
    try {
      setError(null);
      const { annualRevenue, churnRate, growthRate, earnOutPercent, taxRate } = data;
      setPdfData({churn: churnRate, revenue: annualRevenue, growth: growthRate, earnOutPercentage: earnOutPercent, taxRate});
      const { chartData, summary } = calculateDealScenarios(data);
      setChartData(chartData);
      setSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during calculation");
      setChartData(null);
      setSummary(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Welcome to Deal Simulator!</h2>
            <p className="mb-4">
              This tool helps you model different payout structures for business acquisitions.
              Fill in the inputs on the left, and see the results on the right.
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Hover over labels for explanations</li>
              <li>Adjust parameters to compare scenarios</li>
              <li>Export detailed PDF reports</li>
            </ul>
            <Button onClick={dismissTutorial} className="w-full">Get Started</Button>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-center mb-8">Deal Calculator</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: Form */}
        <div className="md:w-1/2">
          <InputForm onSubmit={handleCalculate} />
        </div>

        {/* Right side: Chart, Summary, Export */}
        <div className="md:w-1/2 flex flex-col space-y-6">
          {error && (
            <div className="border border-red-300 rounded-lg p-4 bg-red-50">
              <h3 className="text-red-800 font-semibold">Calculation Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {chartData && summary && pdfData && !error && (
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
