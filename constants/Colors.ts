import { Appearance } from "react-native";

export const lightColors = {
  primary: {
    default: "#07663b",
    light: "#4CAF74",
    dark: "#044929",
  },
  neutral: {
    light: "#F4F4F4",
    medium: "#B2B2B2",
    dark: "#2E2E2E",
  },
  secondary: {
    yellow: "#FFCD05",
    blue: "#7DBBFA",
  },
  background: {
    primary: "#F9F9F9",
    secondary: "#E0E0E0",
  },
  alert: {
    success: "#4CAF74",
    error: "#FF5252",
    warning: "#FFCD05",
    info: "#7DBBFA",
  },
  button: {
    primary: {
      background: "#07663b",
      text: "#F4F4F4",
    },
    secondary: {
      background: "#F4F4F4",
      text: "#07663b",
    },
  },
};

export const darkColors = {
  primary: {
    default: "#07663b",
    light: "#4CAF74",
    dark: "#044929",
  },
  neutral: {
    light: "#2E2E2E",
    medium: "#B2B2B2",
    dark: "#F4F4F4",
  },
  secondary: {
    yellow: "#FFCD05",
    blue: "#7DBBFA",
  },
  background: {
    primary: "#2A2A2A",
    secondary: "#1E1E1E",
  },
  alert: {
    success: "#4CAF74",
    error: "#FF5252",
    warning: "#FFCD05",
    info: "#7DBBFA",
  },
  button: {
    primary: {
      background: "#F4F4F4",
      text: "#2E2E2E",
    },
    secondary: {
      background: "#F4F4F4",
      text: "#F4F4F4",
    },
  },
};

export const colors =
  Appearance.getColorScheme() === "dark" ? darkColors : lightColors;
