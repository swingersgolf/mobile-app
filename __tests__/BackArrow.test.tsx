import { render, fireEvent } from "@testing-library/react-native";
import BackButton from "@/components/BackButton";

// Mock useRouter hook and its methods
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe("BackButton", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<BackButton />);

    // Verify if the back button is rendered
    const button = getByTestId("back-button");
    expect(button).toBeTruthy();
  });

  it("calls router.back when pressed", () => {
    const { getByTestId } = render(<BackButton color="black" />);

    // Get the back button
    const backButton = getByTestId("back-button");

    // Fire the press event
    fireEvent.press(backButton);

    // Check if the back function was called
    expect(mockBack).toHaveBeenCalled();
  });
});
