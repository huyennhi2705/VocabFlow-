"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WeeklyChart({ data }: { data: Array<{ day: string; date: string; count: number }> }) {
  return (
    <div className="w-full min-w-0">
      {data.every((item) => item.count === 0) ? (
        <div className="grid h-full place-items-center text-sm text-slate-400">Chưa có từ mới trong 7 ngày qua.</div>
      ) : (
        <ResponsiveContainer width="100%" aspect={2.5} minWidth={0} initialDimension={{ width: 600, height: 240 }}>
          <BarChart data={data} margin={{ top: 10, right: 6, left: -22, bottom: 0 }}>
            <CartesianGrid stroke="#edf0f6" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8790a4", fontSize: 12 }} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#8790a4", fontSize: 12 }} />
            <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload.date ?? ""} />
            <Bar dataKey="count" name="Từ mới" fill="#6a68e8" radius={[8, 8, 0, 0]} maxBarSize={42} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
