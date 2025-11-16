import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useRef } from "react";
// import html2canvas from "html2canvas";

interface ChartProps {
    data?: any;
    onCapture?: any;
    hidden?: boolean | undefined;
}

export function Chart({ data, onCapture, hidden = false }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (onCapture && chartRef.current) {
  //     setTimeout(() => {
  //       html2canvas(chartRef.current!).then((canvas) => {
  //         const image = canvas.toDataURL("image/png");
  //         onCapture(image);
  //       });
  //     }, 500); // wait for Recharts to render
  //   }
  // }, [onCapture]);

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

