export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
  description: string;
}

export type Role = 'Admin' | 'Viewer';

export interface Filters {
  type: TransactionType | 'all';
  category: string | 'all';
  search: string;
  timeRange: 'all' | 'today' | 'week' | 'month';
}

export type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
