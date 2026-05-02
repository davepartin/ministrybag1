"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ChartSeries = {
  key: string;
  label: string;
  color: string;
};

export function WeeklyTrendChart({
  data,
  series,
  height = 260
}: {
  data: Array<Record<string, string | number>>;
  series: ChartSeries[];
  height?: number;
}) {
  if (data.length === 0) {
    return <div className="flex h-48 items-center justify-center rounded-lg bg-stone-50 text-sm text-stone-500">No trend data yet.</div>;
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d8" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#78716c" />
          <YAxis tick={{ fontSize: 12 }} stroke="#78716c" />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e7e2d8",
              boxShadow: "0 12px 24px rgba(24, 32, 38, 0.12)"
            }}
          />
          <Legend />
          {series.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.label}
              stroke={item.color}
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
