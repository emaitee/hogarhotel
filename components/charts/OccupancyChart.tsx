'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface OccupancyChartProps {
  data: Array<{
    day: string;
    bookings: number;
  }>;
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          axisLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Bar 
          dataKey="bookings" 
          fill="#468DD6" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
