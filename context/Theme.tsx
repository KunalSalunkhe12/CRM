"use client";

import { createContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  COLORS: Record<Theme, string[]>;
}

const COLORS = {
  light: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
  dark: ["#4FC3F7", "#4DB6AC", "#FFF176", "#FF8A65"],
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  COLORS: COLORS,
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
