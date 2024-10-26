// context/ThemeContext.js
'use client';
import { createContext, useContext, useState } from 'react';

// Create the context
const ThemeContext = createContext();

// Custom hook for using the context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Context provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // default theme is 'light'

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
