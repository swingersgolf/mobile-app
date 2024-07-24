// __tests__/BackButton.test.tsx

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import BackButton from "./BackButton";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Mock router.back function
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

// Mock ThemeContext
const mockTheme = {
  backgroundPrimary: "black", // Replace with the expected theme color
};

const MockThemeProvider: React.FC = ({ children }) => (
  <ThemeProvider value={mockTheme}>{children}</ThemeProvider>
);

describe("BackButton", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <BackButton />
      </MockThemeProvider>,
    );

    // Verify if the button is rendered
    const button = getByTestId("back-button");
    expect(button).toBeTruthy();
  });

  it("triggers router.back when pressed", () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <BackButton />
      </MockThemeProvider>,
    );

    // Simulate button press
    const button = getByTestId("back-button");
    fireEvent.press(button);

    // Check if router.back was called
    expect(router.back).toHaveBeenCalled();
  });
});
