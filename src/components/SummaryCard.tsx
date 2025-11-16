import type { DealSummary, DealMetrics } from "@/types/deal";

type SummaryProps = {
  summary: DealSummary;
  metrics?: DealMetrics;
};

export function Summary({ summary, metrics }: SummaryProps) {
  return (
    <div className="border rounded-xl p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold">Deal Summary</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <h3 className="text-lg font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
            <p>Total: <strong>${value.total.toLocaleString()}</strong></p>
            <p>Taxes: <strong>${value.taxes.toLocaleString()}</strong></p>
            <p>Net: <strong>${value.net.toLocaleString()}</strong></p>
          </div>
        ))}
      </div>

      {metrics && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Financial Metrics</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <p>NPV: <strong>${metrics.npv.toLocaleString()}</strong></p>
            <p>IRR: <strong>{metrics.irr}%</strong></p>
            <p>Payback Period: <strong>{metrics.paybackPeriod} years</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}
