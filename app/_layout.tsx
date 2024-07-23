import React from "react";
import { Slot } from "expo-router";
import { SessionProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function Root() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </SessionProvider>
  );
}
