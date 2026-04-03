import { useFinanceStore } from '../../store/useFinanceStore';
import { ShieldAlert, Sun, Moon, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 transition-colors duration-300">
      <div className="flex items-center gap-3 lg:hidden">
         <button onClick={onMenuToggle} className="p-1.5 -ml-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 transition-colors">
           <Menu className="w-6 h-6" />
         </button>
         <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">FinDash</span>
      </div>
      
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {/* Read Only Badge */}
        <AnimatePresence mode="wait">
          {role === 'Viewer' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hidden md:flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Viewer Mode (Read-only)
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Role Toggle */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800 transition-colors">
          <button
            onClick={() => setRole('Admin')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${role === 'Admin' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
          >
            Admin
          </button>
          <button
            onClick={() => setRole('Viewer')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${role === 'Viewer' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
          >
            Viewer
          </button>
        </div>
      </div>
    </header>
  );
};
