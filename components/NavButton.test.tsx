import { fireEvent, render } from "@testing-library/react-native";
import NavButton from "./NavButton";

describe("NavButton", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <NavButton text="Test" onPress={() => {}} />
    );

    // Verify if the button is rendered
    const button = getByTestId("nav-button");
    expect(button).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <NavButton text="Test" onPress={mockOnPress} />
    );

    const button = getByTestId("nav-button");

    // Simulate a press event
    fireEvent.press(button);

    // Verify that the onPress function was called
    expect(mockOnPress).toHaveBeenCalled();
  });
});
