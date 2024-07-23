import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "@/constants/Colors";

const ThemeContext = createContext(lightColors);

export function useTheme() {
  return useContext(ThemeContext);
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = useMemo(
    () => (colorScheme === "dark" ? darkColors : lightColors),
    [colorScheme],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
