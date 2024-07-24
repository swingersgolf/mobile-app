import { fireEvent, render } from "@testing-library/react-native";
import Button from "./Button";

describe("Button", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<Button text="Test" onPress={() => {}} />);

    // Verify if the button is rendered
    const button = getByTestId("button");
    expect(button).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Button text="Test" onPress={mockOnPress} />,
    );

    const button = getByTestId("button");

    // Simulate a press event
    fireEvent.press(button);

    // Verify that the onPress function was called
    expect(mockOnPress).toHaveBeenCalled();
  });
});
