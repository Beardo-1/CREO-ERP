import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', sales: 2400000, deals: 12 },
  { month: 'Feb', sales: 1800000, deals: 8 },
  { month: 'Mar', sales: 3200000, deals: 15 },
  { month: 'Apr', sales: 2800000, deals: 11 },
  { month: 'May', sales: 4100000, deals: 18 },
  { month: 'Jun', sales: 3600000, deals: 14 },
];

export function SalesChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'sales' ? `$${(value as number / 1000000).toFixed(1)}M` : value,
                name === 'sales' ? 'Sales' : 'Deals'
              ]}
            />
            <Bar dataKey="sales" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}