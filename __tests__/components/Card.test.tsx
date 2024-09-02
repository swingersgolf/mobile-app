import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import Card from "@/components/Card"; // Adjust the import path based on your project structure

describe("Card", () => {
  it("renders correctly with children", () => {
    const { getByText } = render(
      <Card>
        <Text>Test Child</Text>
      </Card>,
    );

    expect(getByText("Test Child")).toBeTruthy();
  });
});
