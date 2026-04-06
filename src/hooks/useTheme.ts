import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('apex-theme') as Theme) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('apex-theme', theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => prev === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggleTheme };
};
