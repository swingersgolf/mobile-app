import { render } from "@testing-library/react-native";
import AuthHeader from "@/components/AuthHeader";

// Mock the SVG component
jest.mock("@/assets/branding/Icon.svg", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => {
      return <View testID="icon-mock" />;
    },
  };
});

describe("AuthHeader", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<AuthHeader />);

    // Check if the auth header is rendered
    const authHeader = getByTestId("auth-header");
    expect(authHeader).toBeTruthy();

    // Check if the icon is rendered
    const icon = getByTestId("icon-mock");
    expect(icon).toBeTruthy();

    // Check if the back button is rendered
    const backButton = getByTestId("back-button");
    expect(backButton).toBeTruthy();
  });
});
