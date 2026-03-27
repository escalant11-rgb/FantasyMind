import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'sepia' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  styles: {
    bg: string;
    text: string;
    heading: string;
    border: string;
    card: string;
    accent: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('globalTheme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('globalTheme', theme);
    // Apply theme class to html for tailwind or global styles if needed
    document.documentElement.classList.remove('light', 'sepia', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const getStyles = () => {
    switch (theme) {
      case 'light':
        return {
          bg: '#F5F5F0',
          text: '#333333',
          heading: '#111111',
          border: 'rgba(0,0,0,0.1)',
          card: '#FFFFFF',
          accent: '#DC2626' // red-600
        };
      case 'sepia':
        return {
          bg: '#F4ECD8',
          text: '#5B4636',
          heading: '#433422',
          border: 'rgba(91,70,54,0.1)',
          card: '#EFE6CF',
          accent: '#8C6239'
        };
      default: // dark
        return {
          bg: '#000000',
          text: '#E0E0E0',
          heading: '#FFFFFF',
          border: 'rgba(255,255,255,0.1)',
          card: '#0A0A0A',
          accent: '#DC2626'
        };
    }
  };

  const styles = getStyles();

  return (
    <ThemeContext.Provider value={{ theme, setTheme, styles }}>
      <div 
        className="min-h-screen transition-colors duration-500"
        style={{ backgroundColor: styles.bg, color: styles.text }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
