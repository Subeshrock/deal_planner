import type { DealSummary } from "@/types/deal";

type SummaryProps = {
  summary: DealSummary;
};

export function Summary({ summary }: SummaryProps) {
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
    </div>
  );
}
