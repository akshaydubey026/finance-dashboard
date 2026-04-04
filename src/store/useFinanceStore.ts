import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Filters, Role, SortOption } from '../types';

interface FinanceState {
  transactions: Transaction[];
  filters: Filters;
  role: Role;
  theme: 'dark' | 'light';
  budget: number;
  isLoading: boolean;
  error: string | null;
  sortBy: SortOption;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
  setRole: (role: Role) => void;
  setBudget: (budget: number) => void;
  toggleTheme: () => void;
  clearError: () => void;
  setSortBy: (sortBy: SortOption) => void;
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
      isLoading: false,
      error: null,
      sortBy: 'date_desc',
      addTransaction: async (tx) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          if (tx.amount < 0) throw new Error("Amount cannot be negative");
          set((state) => ({ transactions: [{ ...tx, id: crypto.randomUUID() }, ...state.transactions] }));
        } catch (err: any) {
          set({ error: err.message || 'Failed to add transaction' });
        } finally {
          set({ isLoading: false });
        }
      },
      deleteTransaction: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          set((state) => ({ transactions: state.transactions.filter(t => t.id !== id) }));
        } catch (err: any) {
          set({ error: err.message || 'Failed to delete transaction' });
        } finally {
          set({ isLoading: false });
        }
      },
      updateTransaction: async (id, tx) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          if (tx.amount !== undefined && tx.amount < 0) throw new Error("Amount cannot be negative");
          set((state) => ({ transactions: state.transactions.map(t => t.id === id ? { ...t, ...tx } : t) }));
        } catch (err: any) {
          set({ error: err.message || 'Failed to update transaction' });
        } finally {
          set({ isLoading: false });
        }
      },
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),
      setRole: (role) => set({ role }),
      setBudget: (budget) => set({ budget }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      clearError: () => set({ error: null }),
      setSortBy: (sortBy) => set({ sortBy })
    }),
    { 
      name: 'finance-storage',
      partialize: (state) => ({ 
        transactions: state.transactions, 
        filters: state.filters, 
        role: state.role, 
        theme: state.theme, 
        budget: state.budget,
        sortBy: state.sortBy
      })
    }
  )
);
