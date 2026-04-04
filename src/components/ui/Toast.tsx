import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';

export const Toast = () => {
  const { error, clearError } = useFinanceStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-2xl shadow-xl border border-red-500/50"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium pr-4">{error}</p>
          <button 
            onClick={clearError}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
