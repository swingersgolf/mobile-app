import { render } from "@testing-library/react-native";
import NavButton from "./NavButton";

describe("NavButton", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<NavButton route="/test" text="Test" />);

    // Verify if the button is rendered
    const button = getByTestId("nav-button");
    expect(button).toBeTruthy();
  });
});
