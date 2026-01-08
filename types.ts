
export enum ExpenseCategory {
  FUEL = 'Бензин',
  MAINTENANCE = 'ТО',
  INSURANCE = 'Страховка',
  REPAIR = 'Ремонт',
  WASH = 'Мойка/Парковка',
  TAX = 'Налоги',
  OTHER = 'Прочее'
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  mileage?: number;
}

export interface AIInsight {
  title: string;
  description: string;
  type: 'warning' | 'tip' | 'success';
}

export interface AIAnalysisResponse {
  insights: AIInsight[];
}

export interface VehicleInfo {
  brand: string;
  model: string;
  year: string;
  plate: string;
  vin: string;
  photo?: string;
}

export interface Document {
  id: string;
  title: string;
  image: string;
  expiryDate?: string;
}

export type StatsPeriod = 'all' | 'month' | 'quarter' | 'year';
