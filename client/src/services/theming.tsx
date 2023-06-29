import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useLayoutEffect,
} from 'react';

import { ThemeProvider } from 'styled-components';

import { theme as lightTheme, darkTheme } from '~constants/theme';
import { usePersistedState } from '~utils/persistance';

type Theme = 'light' | 'dark';

declare global {
  interface Window {
    CURRENT_THEME: Theme;
  }
}

type AuthContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemingContext = createContext<undefined | AuthContextValue>(undefined);

export function ThemingProvider({ children }: { children: ReactNode }) {
  const [persistedTheme, setTheme] = usePersistedState<Theme>('@app/theme');
  const theme = persistedTheme || window.CURRENT_THEME || 'light';
  const values = theme === 'light' ? lightTheme : darkTheme;

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-color-scheme', theme);
    root.style.setProperty('color-scheme', theme);
    root.style.setProperty('--background-color', values.colors.background);
  }, [theme]); // eslint-disable-line

  return (
    <ThemingContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <ThemeProvider theme={values}>{children}</ThemeProvider>
    </ThemingContext.Provider>
  );
}

export const useTheming = () => {
  const context = useContext(ThemingContext);
  if (!context) throw new Error('Missing ThemingProvider!');
  return context;
};
