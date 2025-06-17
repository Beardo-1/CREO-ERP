import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Download, Filter } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
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

export default function FinancialDashboard() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.financialDashboard.title)}</h1>
          <p className="text-gray-600">{t(appContent.financialDashboard.subtitle)}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.financialDashboard.totalRevenue)}</p>
                <p className="text-2xl font-bold text-green-600">$2,450,000</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% {t(appContent.financialDashboard.fromLastMonth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.financialDashboard.totalCommissions)}</p>
                <p className="text-2xl font-bold text-blue-600">$147,000</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% {t(appContent.financialDashboard.fromLastMonth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.financialDashboard.expenses)}</p>
                <p className="text-2xl font-bold text-amber-600">$89,500</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.2% {t(appContent.financialDashboard.fromLastMonth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.financialDashboard.netProfit)}</p>
                <p className="text-2xl font-bold text-purple-600">$57,500</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15.7% {t(appContent.financialDashboard.fromLastMonth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.financialDashboard.revenueOverTime)}</h3>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>{t(appContent.financialDashboard.last6Months)}</option>
                  <option>{t(appContent.financialDashboard.lastYear)}</option>
                </select>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">{t(appContent.financialDashboard.chartPlaceholder)}</p>
            </div>
          </div>

          {/* Commission Breakdown */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.financialDashboard.commissionBreakdown)}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.financialDashboard.salesCommissions)}</p>
                  <p className="text-sm text-gray-600">45 {t(appContent.financialDashboard.transactions)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">$98,500</p>
                  <p className="text-sm text-gray-600">67%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.financialDashboard.rentalCommissions)}</p>
                  <p className="text-sm text-gray-600">28 {t(appContent.financialDashboard.transactions)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">$32,000</p>
                  <p className="text-sm text-gray-600">22%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.financialDashboard.referralBonuses)}</p>
                  <p className="text-sm text-gray-600">12 {t(appContent.financialDashboard.referrals)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">$16,500</p>
                  <p className="text-sm text-gray-600">11%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Tracking */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t(appContent.financialDashboard.expenseTracking)}</h3>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                {t(appContent.financialDashboard.addExpense)}
              </button>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>{t(appContent.financialDashboard.exportReport)}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
              <p className="text-2xl font-bold text-red-600">$25,000</p>
              <p className="text-sm text-gray-600">{t(appContent.financialDashboard.marketing)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">$18,500</p>
              <p className="text-sm text-gray-600">{t(appContent.financialDashboard.officeRent)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">$12,000</p>
              <p className="text-sm text-gray-600">{t(appContent.financialDashboard.utilities)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">$34,000</p>
              <p className="text-sm text-gray-600">{t(appContent.financialDashboard.other)}</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t(appContent.financialDashboard.recentTransactions)}</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              {t(appContent.financialDashboard.viewAll)}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.financialDashboard.date)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.financialDashboard.description)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.financialDashboard.type)}</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">{t(appContent.financialDashboard.amount)}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Dec 10, 2024</td>
                  <td className="py-3 px-4 text-gray-900">{t(appContent.financialDashboard.sampleTransaction1)}</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.financialDashboard.commission)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">+$8,500</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Dec 8, 2024</td>
                  <td className="py-3 px-4 text-gray-900">{t(appContent.financialDashboard.sampleTransaction2)}</td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.financialDashboard.expense)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-red-600">-$2,500</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Dec 5, 2024</td>
                  <td className="py-3 px-4 text-gray-900">{t(appContent.financialDashboard.sampleTransaction3)}</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.financialDashboard.commission)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">+$12,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add missing Pie import
import { Pie } from 'recharts';