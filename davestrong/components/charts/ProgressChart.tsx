"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function ProgressChart({
  title,
  data,
  dataKey,
  labelKey = "date",
  color = "#2f6f5e",
  type = "line",
  unit
}: {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  labelKey?: string;
  color?: string;
  type?: "line" | "bar";
  unit?: string;
}) {
  return (
    <div className="surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-bold text-ink">{title}</h2>
        {unit ? <span className="rounded-lg bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-600">{unit}</span> : null}
      </div>
      {data.length === 0 ? (
        <div className="flex h-44 items-center justify-center rounded-lg bg-stone-50 text-sm text-stone-500">No data yet.</div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d8" />
                <XAxis dataKey={labelKey} tick={{ fontSize: 12 }} stroke="#78716c" />
                <YAxis tick={{ fontSize: 12 }} stroke="#78716c" />
                <Tooltip />
                <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d8" />
                <XAxis dataKey={labelKey} tick={{ fontSize: 12 }} stroke="#78716c" />
                <YAxis tick={{ fontSize: 12 }} stroke="#78716c" />
                <Tooltip />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
