import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Banknote, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', commission: 45000, expenses: 12000 },
  { month: 'Feb', commission: 38000, expenses: 15000 },
  { month: 'Mar', commission: 52000, expenses: 18000 },
  { month: 'Apr', commission: 48000, expenses: 14000 },
  { month: 'May', commission: 65000, expenses: 20000 },
  { month: 'Jun', commission: 58000, expenses: 16000 },
];

const paymentMethodData = [
  { name: 'Bank Transfer', value: 45, color: '#3B82F6' },
  { name: 'Cash', value: 25, color: '#10B981' },
  { name: 'Card', value: 20, color: '#F59E0B' },
  { name: 'Cheque', value: 10, color: '#8B5CF6' },
];

export function FinancialDashboard() {
  return (
    <div className="space-y-8">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">$324K</div>
          <div className="text-gray-600 text-sm">Total Commission</div>
          <div className="text-green-500 text-sm font-medium mt-1">+12.5% from last month</div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">$89K</div>
          <div className="text-gray-600 text-sm">Total Expenses</div>
          <div className="text-red-500 text-sm font-medium mt-1">+8.2% from last month</div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">$235K</div>
          <div className="text-gray-600 text-sm">Net Profit</div>
          <div className="text-green-500 text-sm font-medium mt-1">+15.3% from last month</div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Banknote className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">$45K</div>
          <div className="text-gray-600 text-sm">Pending Payments</div>
          <div className="text-green-500 text-sm font-medium mt-1">-5.1% from last month</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Commission vs Expenses Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Commission vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip 
                  formatter={(value, name) => [`$${(value as number).toLocaleString()}`, name === 'commission' ? 'Commission' : 'Expenses']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="commission" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {paymentMethodData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600">Payment Method</th>
                <th className="text-right py-4 px-2 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-center py-4 px-2 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2024-01-22', description: 'Commission - Downtown Condo Sale', type: 'Commission', method: 'Bank Transfer', amount: 25000, status: 'Completed' },
                { date: '2024-01-21', description: 'Marketing Expenses', type: 'Expense', method: 'Card', amount: -1200, status: 'Completed' },
                { date: '2024-01-20', description: 'Commission - Family Home Sale', type: 'Commission', method: 'Cheque', amount: 18000, status: 'Pending' },
                { date: '2024-01-19', description: 'Office Rent', type: 'Expense', method: 'Bank Transfer', amount: -2500, status: 'Completed' },
                { date: '2024-01-18', description: 'Commission - Commercial Property', type: 'Commission', method: 'Cash', amount: 35000, status: 'Completed' },
              ].map((transaction, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2 text-sm text-gray-900">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="py-4 px-2 text-sm text-gray-900">{transaction.description}</td>
                  <td className="py-4 px-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'Commission' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-600">{transaction.method}</td>
                  <td className={`py-4 px-2 text-sm text-right font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Add missing Pie import
import { Pie } from 'recharts';