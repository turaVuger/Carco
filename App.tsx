
import React, { useState, useEffect } from 'react';
import { Expense, VehicleInfo, Document } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import VehicleProfile from './components/VehicleProfile';

type Tab = 'dashboard' | 'expenses' | 'garage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('autocare_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [vehicle, setVehicle] = useState<VehicleInfo>(() => {
    const saved = localStorage.getItem('autocare_vehicle');
    return saved ? JSON.parse(saved) : { brand: 'Мой', model: 'Автомобиль', year: '-', plate: '-', vin: '-' };
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('autocare_docs');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    localStorage.setItem('autocare_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('autocare_vehicle', JSON.stringify(vehicle));
  }, [vehicle]);

  useEffect(() => {
    localStorage.setItem('autocare_docs', JSON.stringify(documents));
  }, [documents]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setExpenses(prev => [...prev, expense]);
  };

  const handleUpdateExpense = (updated: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      if (editingExpense?.id === id) setEditingExpense(null);
    }
  };

  const handleAddDocument = (doc: Omit<Document, 'id'>) => {
    const newDoc: Document = { ...doc, id: crypto.randomUUID() };
    setDocuments(prev => [...prev, newDoc]);
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Удалить этот документ?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">AutoCare</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Digital Garage</p>
            </div>
          </div>

          <nav className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Сводка
            </button>
            <button 
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'expenses' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Расходы
            </button>
            <button 
              onClick={() => setActiveTab('garage')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'garage' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Гараж
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <AIInsights expenses={expenses} />
                <div className="mt-8">
                  <Dashboard expenses={expenses} />
                </div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
                  <h4 className="font-bold opacity-80 uppercase text-[10px] tracking-widest mb-4">Автомобиль в системе</h4>
                  <div className="flex gap-4 items-center">
                    {vehicle.photo ? (
                      <img src={vehicle.photo} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20" alt="Car" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🚗</div>
                    )}
                    <div>
                      <p className="text-xl font-bold">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-xs opacity-70 font-mono tracking-widest">{vehicle.plate || '-'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('garage')}
                    className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Перейти в гараж
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4">Документы</h4>
                  <div className="space-y-3">
                    {documents.slice(0, 3).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer" onClick={() => setActiveTab('garage')}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          </div>
                          <span className="text-sm font-medium text-slate-700">{doc.title}</span>
                        </div>
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                    ))}
                    {documents.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Нет документов</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-4 sticky top-24">
              <ExpenseForm 
                onAddExpense={handleAddExpense} 
                onUpdateExpense={handleUpdateExpense}
                editingExpense={editingExpense}
                onCancelEdit={() => setEditingExpense(null)}
              />
            </div>
            <div className="lg:col-span-8">
              <ExpenseList 
                expenses={expenses} 
                onDelete={handleDeleteExpense} 
                onEdit={(exp) => {
                  setEditingExpense(exp);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'garage' && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <VehicleProfile 
              info={vehicle} 
              documents={documents} 
              onUpdateInfo={setVehicle}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button for adding expense quick access if on dashboard */}
      {activeTab === 'dashboard' && (
        <button 
          onClick={() => setActiveTab('expenses')}
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
        >
          <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
      )}
    </div>
  );
};

export default App;
