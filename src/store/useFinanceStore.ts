import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Filters, Role } from '../types';

interface FinanceState {
  transactions: Transaction[];
  filters: Filters;
  role: Role;
  theme: 'dark' | 'light';
  budget: number;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setRole: (role: Role) => void;
  setBudget: (budget: number) => void;
  toggleTheme: () => void;
}

const generateMockData = (): Transaction[] => {
  return [
    { id: '1', amount: 4500, date: new Date(Date.now() - 86400000 * 2).toISOString(), category: 'Salary', type: 'income', description: 'April Salary' },
    { id: '2', amount: 150, date: new Date(Date.now() - 86400000 * 1).toISOString(), category: 'Food', type: 'expense', description: 'Groceries' },
    { id: '3', amount: 60, date: new Date().toISOString(), category: 'Transport', type: 'expense', description: 'Uber' },
    { id: '4', amount: 1200, date: new Date(Date.now() - 86400000 * 5).toISOString(), category: 'Housing', type: 'expense', description: 'Rent' },
    { id: '5', amount: 300, date: new Date(Date.now() - 86400000 * 10).toISOString(), category: 'Freelance', type: 'income', description: 'Web Project' },
  ];
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: generateMockData(),
      filters: { type: 'all', category: 'all', search: '', timeRange: 'all' },
      role: 'Admin',
      theme: 'dark',
      budget: 5000,
      addTransaction: (tx) => set((state) => ({
        transactions: [{ ...tx, id: crypto.randomUUID() }, ...state.transactions]
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      updateTransaction: (id, tx) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...tx } : t)
      })),
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),
      setRole: (role) => set({ role }),
      setBudget: (budget) => set({ budget }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
    }),
    { name: 'finance-storage' }
  )
);
