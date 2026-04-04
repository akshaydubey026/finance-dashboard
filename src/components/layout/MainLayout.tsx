import type { ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toast } from '../ui/Toast';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative isolate transition-colors duration-300">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all w-full">
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[100vw]">
          <div className="w-full max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Toast />
    </div>
  );
};
