
import React, { useState, useEffect } from 'react';
import { Expense, AIInsight } from '../types';
import { analyzeExpenses } from '../services/geminiService';

interface AIInsightsProps {
  expenses: Expense[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ expenses }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    if (expenses.length < 3) return;
    setLoading(true);
    const result = await analyzeExpenses(expenses);
    setInsights(result.insights);
    setLoading(false);
  };

  useEffect(() => {
    if (expenses.length >= 3) {
      getInsights();
    }
  }, [expenses.length]);

  if (expenses.length < 3) {
    return (
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-blue-700">
        <h3 className="font-semibold flex items-center gap-2">
          <span className="text-xl">💡</span> Совет ИИ
        </h3>
        <p className="mt-2 text-sm">Добавьте хотя бы 3 записи, чтобы искусственный интеллект смог проанализировать ваши расходы и дать рекомендации.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-xl">🤖</span> Рекомендации ИИ
        </h3>
        <button 
          onClick={getInsights} 
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {loading ? 'Анализирую...' : 'Обновить'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.length > 0 ? (
          insights.map((insight, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border ${
                insight.type === 'warning' ? 'bg-red-50 border-red-100 text-red-700' :
                insight.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                'bg-blue-50 border-blue-100 text-blue-700'
              }`}
            >
              <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
              <p className="text-xs leading-relaxed">{insight.description}</p>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-4 text-slate-400 italic">
            {loading ? 'Подождите, Gemini анализирует ваши данные...' : 'Нет активных рекомендаций'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
