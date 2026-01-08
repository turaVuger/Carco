
import React, { useState, useEffect } from 'react';
import { ExpenseCategory, Expense } from '../types';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  editingExpense?: Expense | null;
  onCancelEdit: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, onUpdateExpense, editingExpense, onCancelEdit }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FUEL);
  const [description, setDescription] = useState('');
  const [mileage, setMileage] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setDate(editingExpense.date);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setMileage(editingExpense.mileage?.toString() || '');
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    const data = {
      date,
      amount: Number(amount),
      category,
      description,
      mileage: mileage ? Number(mileage) : undefined,
    };

    if (editingExpense) {
      onUpdateExpense({ ...data, id: editingExpense.id });
    } else {
      onAddExpense(data);
    }

    // Reset fields
    setAmount('');
    setDescription('');
    setMileage('');
    if (editingExpense) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-2xl shadow-sm border transition-all duration-300 ${editingExpense ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-slate-100'}`}>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        {editingExpense ? 'Редактировать расход' : 'Добавить расход'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Дата</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Сумма (₽)</label>
          <input
            type="number"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Категория</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.values(ExpenseCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Пробег (км)</label>
          <input
            type="number"
            placeholder="Опционально"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-600 mb-1">Описание</label>
        <input
          type="text"
          placeholder="Например: Заправка 95, Замена масла..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
        >
          {editingExpense ? 'Сохранить изменения' : 'Добавить запись'}
        </button>
        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
