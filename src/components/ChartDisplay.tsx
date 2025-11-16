import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRef } from "react";

import type { ChartData } from "@/types/chart";

interface ChartProps {
    data?: ChartData[];
    onCapture?: (img: string) => void;
    hidden?: boolean;
}

export function Chart({ data, hidden = false }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div className={hidden ? "hidden" : ""}>
      <div
        ref={chartRef}
        className="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
            <Legend />
            <Bar dataKey="earnOut" fill="#3b82f6" name="Earn Out" />
            <Bar dataKey="sellerFinancing" fill="#10b981" name="Seller Financing" />
            <Bar dataKey="allCash" fill="#f59e0b" name="All Cash" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {!hidden && (
        <div className="mt-2 text-right">
          <p className="text-xs text-gray-500">
            Right-click or take screenshot to save chart
          </p>
        </div>
      )}
    </div>
  );
}

