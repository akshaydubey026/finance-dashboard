import { useMemo, useState } from 'react';
import { useFinanceStore } from '../../../store/useFinanceStore';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Tooltip } from '../../../components/ui/Tooltip';
import { TransactionModal } from './TransactionModal';
import { format, parseISO, isToday, isThisWeek, isSameMonth } from 'date-fns';
import { ArrowDownRight, ArrowUpRight, Search, Trash2, Edit2, Coffee, Home, Bus, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': case 'groceries': return <Coffee className="w-4 h-4" />;
    case 'housing': case 'rent': return <Home className="w-4 h-4" />;
    case 'transport': return <Bus className="w-4 h-4" />;
    case 'salary': case 'freelance': return <Briefcase className="w-4 h-4" />;
    default: return <DollarSign className="w-4 h-4" />;
  }
};

export const TransactionTable = () => {
  const { transactions, filters, setFilters, role, deleteTransaction } = useFinanceStore();
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setTxToEdit(id);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setTxToEdit(null);
    setIsModalOpen(true);
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (filters.timeRange === 'today') return isToday(parseISO(t.date));
        if (filters.timeRange === 'week') return isThisWeek(parseISO(t.date));
        if (filters.timeRange === 'month') return isSameMonth(parseISO(t.date), new Date());
        return true;
      })
      .filter(t => (filters.type === 'all' ? true : t.type === filters.type))
      .filter(t => (filters.category === 'all' ? true : t.category.toLowerCase().includes(filters.category.toLowerCase())))
      .filter(t => (t.description.toLowerCase().includes(filters.search.toLowerCase()) || t.category.toLowerCase().includes(filters.search.toLowerCase())))
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortOrder === 'desc' 
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
          return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
      });
  }, [transactions, filters, sortField, sortOrder]);

  return (
    <>
      <Card className="p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-900/50 h-auto">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-shadow placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-sm dark:shadow-none"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <select
                className="w-full sm:w-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-sm dark:shadow-none"
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value as any })}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              {role === 'Admin' && (
                <Button size="sm" onClick={handleAdd} className="w-full sm:w-auto hidden md:inline-flex shadow-sm">
                   + Add Transaction
                </Button>
              )}
            </div>
            {role === 'Admin' && (
              <Button size="sm" onClick={handleAdd} className="w-full sm:hidden shadow-sm">
                 + Add Transaction
              </Button>
            )}
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-hide">
             {['all', 'today', 'week', 'month'].map(range => {
                const isActive = filters.timeRange === range;
                return (
                  <Button
                    key={range}
                    variant={isActive ? 'primary' : 'ghost'}
                    size="sm"
                    className={`rounded-full shrink-0 text-xs font-semibold transition-all ${
                      isActive 
                        ? 'shadow-sm' 
                        : 'bg-zinc-200/50 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                    }`}
                    onClick={() => setFilters({ timeRange: range as any })}
                  >
                    {range === 'all' ? 'All Time' : range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'Today'}
                  </Button>
                )
             })}
          </div>
        </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 transition-colors">
            <tr>
              <th className="px-6 py-4 font-medium pl-8">Transaction</th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors" onClick={() => { setSortField('date'); setSortOrder(s => s === 'asc' ? 'desc' : 'asc') }}>
                <span className="flex items-center gap-1">Date {sortField === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}</span>
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors" onClick={() => { setSortField('amount'); setSortOrder(s => s === 'asc' ? 'desc' : 'asc') }}>
                <span className="flex items-center gap-1">Amount {sortField === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}</span>
              </th>
              <th className="px-6 py-4 font-medium pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 bg-white dark:bg-zinc-900/30">
            <AnimatePresence>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={tx.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    <td className="px-6 py-4 pl-8">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${tx.type === 'income' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20'}`}>
                          {getCategoryIcon(tx.category)}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">{tx.description}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{tx.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      {format(parseISO(tx.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={tx.type === 'income' ? 'success' : 'danger'} className="inline-flex items-center gap-1 w-fit">
                        {tx.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        ${tx.amount.toLocaleString()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 pr-8">
                      <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        {role === 'Admin' ? (
                          <>
                            <Button variant="ghost" size="sm" className="p-1.5 h-auto text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100/50 hover:bg-zinc-200/50 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg" onClick={() => handleEdit(tx.id)}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1.5 h-auto text-red-600 dark:text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-500/20 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg" onClick={() => deleteTransaction(tx.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                           <Tooltip content="Only admins can modify transactions">
                             <div className="flex items-center gap-2">
                               <Button variant="ghost" size="sm" className="p-1.5 h-auto opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg">
                                 <Edit2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                               </Button>
                               <Button variant="ghost" size="sm" className="p-1.5 h-auto opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg">
                                 <Trash2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                               </Button>
                             </div>
                           </Tooltip>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={4} className="px-6 py-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                       <Search className="w-10 h-10 mb-3 text-zinc-300 dark:text-zinc-700" />
                       <p className="text-zinc-600 dark:text-zinc-400 font-medium">No transactions found</p>
                       <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-600">Try adjusting your filters or search query.</p>
                       <Button variant="ghost" size="sm" className="mt-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none" onClick={() => setFilters({ search: '', type: 'all', category: 'all' })}>
                         Clear Filters
                       </Button>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
        </div>
      </Card>
      
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} transactionToEdit={txToEdit} />
    </>
  );
};
