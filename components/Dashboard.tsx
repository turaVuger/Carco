
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { Expense, ExpenseCategory, StatsPeriod } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const [period, setPeriod] = useState<StatsPeriod>('all');

  const filteredExpenses = useMemo(() => {
    if (period === 'all') return expenses;
    const now = new Date();
    const filterDate = new Date();
    if (period === 'month') filterDate.setMonth(now.getMonth() - 1);
    if (period === 'quarter') filterDate.setMonth(now.getMonth() - 3);
    if (period === 'year') filterDate.setFullYear(now.getFullYear() - 1);
    
    return expenses.filter(e => new Date(e.date) >= filterDate);
  }, [expenses, period]);

  const totalSpent = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      const month = e.date.substring(0, 7); // YYYY-MM
      months[month] = (months[month] || 0) + e.amount;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, total]) => ({ name, total }));
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Статистика</h3>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value as StatsPeriod)}
          className="p-2 rounded-xl bg-white border border-slate-100 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">За все время</option>
          <option value="month">За месяц</option>
          <option value="quarter">За квартал</option>
          <option value="year">За год</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Всего за период</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">{totalSpent.toLocaleString()} ₽</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Записей</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">{filteredExpenses.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Средний чек</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">
            {filteredExpenses.length > 0 ? (totalSpent / filteredExpenses.length).toFixed(0).toLocaleString() : 0} ₽
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Категории трат</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as ExpenseCategory]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} ₽`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Динамика по месяцам</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} ₽`} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
