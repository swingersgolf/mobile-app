import { render } from "@testing-library/react-native";
import BackArrow from "@/components/BackArrow";
import React from "react";

// Mock router.back function
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

describe("BackArrow", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <BackArrow
        onPress={function (): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );

    // Verify if the button is rendered
    const button = getByTestId("back-arrow");
    expect(button).toBeTruthy();
  });
});
