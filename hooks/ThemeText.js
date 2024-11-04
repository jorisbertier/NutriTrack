import React, { createContext, useContext, useState } from 'react';

// Crée le contexte
const ThemeContext = createContext();

// Crée un provider pour gérer le thème
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: colors[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le contexte de thème
export const useTheme = () => useContext(ThemeContext);