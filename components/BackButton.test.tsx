import { render, fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import BackButton from "./BackButton";

// Mock router.back function
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

describe("BackButton", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<BackButton />);

    // Verify if the button is rendered
    const button = getByTestId("back-button");
    expect(button).toBeTruthy();
  });

  it("triggers router.back when pressed", () => {
    const { getByTestId } = render(<BackButton />);

    // Simulate button press
    const button = getByTestId("back-button");
    fireEvent.press(button);

    // Check if router.back was called
    expect(router.back).toHaveBeenCalled();
  });
});
