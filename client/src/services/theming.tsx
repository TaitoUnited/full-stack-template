import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useLayoutEffect,
} from 'react';

import { usePersistedState } from '~utils/persistance';

type Theme = 'light' | 'dark';

declare global {
  interface Window {
    CURRENT_THEME: Theme;
  }
}

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<undefined | ThemeContextValue>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [persistedTheme, setTheme] = usePersistedState<Theme>('@app/theme');
  const theme = persistedTheme || window.CURRENT_THEME || 'light';

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-color-scheme', theme);
    root.style.setProperty('color-scheme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('Missing ThemeProvider!');
  return context;
};
