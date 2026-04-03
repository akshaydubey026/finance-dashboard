import { useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export const useThemeInit = () => {
  const theme = useFinanceStore(state => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
};
