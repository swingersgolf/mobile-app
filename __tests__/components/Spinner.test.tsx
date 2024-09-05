import { render } from "@testing-library/react-native";
import Spinner from "@/components/Spinner"; // Adjust the import path based on your project structure

describe("Spinner Component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<Spinner />);
    const spinner = getByTestId("spinner");
    expect(spinner).toBeTruthy();
  });
});
