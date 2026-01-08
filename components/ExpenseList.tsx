
import React from 'react';
import { Expense } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit }) => {
  const sortedExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">История расходов</h3>
        <span className="text-xs text-slate-400 font-medium">Всего {expenses.length} записей</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-3">Дата</th>
              <th className="px-6 py-3">Категория</th>
              <th className="px-6 py-3">Описание</th>
              <th className="px-6 py-3 text-right">Сумма</th>
              <th className="px-6 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  История пока пуста.
                </td>
              </tr>
            ) : (
              sortedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 group transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(expense.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700">{expense.description || '-'}</span>
                      {expense.mileage && <span className="text-[10px] text-slate-400 italic">{expense.mileage.toLocaleString()} км</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">
                    {expense.amount.toLocaleString()} ₽
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(expense)}
                        className="text-slate-400 hover:text-blue-500 transition-colors"
                        title="Редактировать"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button 
                        onClick={() => onDelete(expense.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Удалить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
