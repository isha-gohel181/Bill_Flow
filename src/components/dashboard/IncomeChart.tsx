"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { IncomePoint } from "@/types/frontend";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";

interface IncomeChartProps {
  data: IncomePoint[];
  currency?: string;
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-md text-xs space-y-1">
        <p className="font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-emerald-600 font-medium">
          Paid Income: <CurrencyDisplay amount={val} currency={currency} />
        </p>
      </div>
    );
  }
  return null;
};

export const IncomeChart: React.FC<IncomeChartProps> = ({
  data,
  currency = "INR",
}) => {
  const chartData = data.map((item) => ({
    name: item.label,
    amount: parseFloat(item.amount) || 0,
  }));

  return (
    <div className="w-full h-64 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
            tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Bar
            dataKey="amount"
            fill="#017E84"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
