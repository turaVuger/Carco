
import { ExpenseCategory } from './types';

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FUEL]: '#3b82f6', // blue
  [ExpenseCategory.MAINTENANCE]: '#10b981', // emerald
  [ExpenseCategory.INSURANCE]: '#f59e0b', // amber
  [ExpenseCategory.REPAIR]: '#ef4444', // red
  [ExpenseCategory.WASH]: '#8b5cf6', // violet
  [ExpenseCategory.TAX]: '#64748b', // slate
  [ExpenseCategory.OTHER]: '#ec4899', // pink
};

export const INITIAL_EXPENSES: any[] = [];
