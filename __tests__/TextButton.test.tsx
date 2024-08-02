import { fireEvent, render } from "@testing-library/react-native";
import TextButton from "@/components/TextButton";

describe("TextButton", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <TextButton
        text="Test"
        onPress={() => {}}
        textColor={""}
        backgroundColor={""}
      />,
    );

    // Verify if the button is rendered
    const button = getByTestId("button");
    expect(button).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <TextButton
        text="Test"
        onPress={mockOnPress}
        textColor={""}
        backgroundColor={""}
      />,
    );

    const button = getByTestId("button");

    // Simulate a press event
    fireEvent.press(button);

    // Verify that the onPress function was called
    expect(mockOnPress).toHaveBeenCalled();
  });
});
