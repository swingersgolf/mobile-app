import { render, fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import BackArrow from "./BackArrow";

// Mock router.back function
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

describe("BackArrow", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<BackArrow />);

    // Verify if the button is rendered
    const button = getByTestId("back-arrow");
    expect(button).toBeTruthy();
  });

  it("triggers router.back when pressed", () => {
    const { getByTestId } = render(<BackArrow />);

    // Simulate button press
    const button = getByTestId("back-arrow");
    fireEvent.press(button);

    // Check if router.back was called
    expect(router.back).toHaveBeenCalled();
  });
});
