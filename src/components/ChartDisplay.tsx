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
    <div
      ref={chartRef}
      className="h-80"
      style={hidden ? { position: "absolute", left: "-9999px" } : {}}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="earnOut" fill="#3b82f6" name="Earn Out" />
          <Bar dataKey="sellerFinancing" fill="#10b981" name="Seller Financing" />
          <Bar dataKey="allCash" fill="#f59e0b" name="All Cash" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

