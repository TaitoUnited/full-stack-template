import { createContext, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { theme as lightTheme, darkTheme } from '~constants/theme';
import { usePersistedState } from '~utils/persistance';

type CurrentTheme = 'light' | 'dark';

type AuthContextValue = {
  currentTheme: CurrentTheme;
  setCurrentTheme: (t: CurrentTheme) => void;
  toggleTheme: () => void;
};

const ThemingContext = createContext<undefined | AuthContextValue>(undefined);

export function ThemingProvider({ children }: { children: ReactNode }) {
  const [persistedTheme, setCurrentTheme] = usePersistedState<CurrentTheme>('@app/theme'); // prettier-ignore
  const currentTheme = persistedTheme || (window as any).CURRENT_THEME || 'light' as CurrentTheme; // prettier-ignore
  const theme = currentTheme === 'light' ? lightTheme : darkTheme;

  function toggleTheme() {
    setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('color-scheme', currentTheme);
    root.style.setProperty('--background-color', theme.colors.background);
  }, [currentTheme]); // eslint-disable-line

  return (
    <ThemingContext.Provider
      value={{ currentTheme, setCurrentTheme, toggleTheme }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemingContext.Provider>
  );
}

export const useTheming = () => {
  const context = useContext(ThemingContext);
  if (!context) throw new Error('Missing ThemingProvider!');
  return context;
};
