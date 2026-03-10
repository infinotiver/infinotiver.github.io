import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type BackgroundType =
  | "default"
  | "blur-minimal"
  | "solid"
  | "transparent";

interface ThemeContextType {
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(() => {
    try {
      const stored = localStorage.getItem("karretOS_bg");
      if (
        stored &&
        ["default", "blur-minimal", "solid", "transparent"].includes(stored)
      ) {
        return stored as BackgroundType;
      }
      return "default";
    } catch {
      return "default";
    }
  });

  const updateBackground = (type: BackgroundType) => {
    setBackgroundType(type);
    try {
      localStorage.setItem("karretOS_bg", type);
    } catch {
      // Silently fail if localStorage unavailable
    }
  };

  return (
    <ThemeContext.Provider
      value={{ backgroundType, setBackgroundType: updateBackground }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
