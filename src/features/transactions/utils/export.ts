import type { Transaction } from '../../../types';
import { format, parseISO } from 'date-fns';

export const downloadCSV = (transactions: Transaction[]) => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
  
  const csvRows = transactions.map(t => {
    return [
      format(parseISO(t.date), 'yyyy-MM-dd'),
      `"${t.description.replace(/"/g, '""')}"`, // escape quotes
      t.category,
      t.amount.toString(),
      t.type
    ].join(',');
  });

  const csvString = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadJSON = (transactions: Transaction[]) => {
  const jsonString = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `transactions-${format(new Date(), 'yyyy-MM-dd')}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
