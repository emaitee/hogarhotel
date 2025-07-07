'use client';

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          axisLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
          formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#468DD6" 
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
