import { colors } from "@/constants/Colors";
import {
  GestureResponderEvent,
  TouchableOpacity,
  Text,
  ViewStyle,
} from "react-native";
import { DimensionValue } from "react-native";

type ButtonProps = {
  text: string;
  outline?: boolean;
  onPress?: (event: GestureResponderEvent) => void; // No need for null as a type here
  textColor: string;
  backgroundColor: string;
  width?: DimensionValue;
  fontSize?: number;
  disabled?: boolean;
};

const TextButton = ({
  onPress,
  text,
  outline = false,
  textColor,
  backgroundColor,
  width,
  fontSize,
  disabled,
}: ButtonProps) => {
  // Define the button style outside to apply directly in TouchableOpacity
  const buttonStyle: ViewStyle = {
    paddingVertical: 15,
    borderRadius: 5,
    width: width ? width : "100%",
    alignItems: "center",
    backgroundColor: disabled
      ? colors.neutral.medium
      : outline
        ? "transparent"
        : backgroundColor,
    borderWidth: 1,
    borderColor: disabled
      ? colors.neutral.medium
      : outline
        ? textColor
        : backgroundColor,
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        buttonStyle,
        { opacity: disabled ? 0.5 : 1 }, // Optional opacity for disabled state
      ]}
      testID="text-button"
    >
      <Text
        style={{
          color: textColor,
          fontSize: fontSize ? fontSize : 16,
          fontWeight: "bold",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default TextButton;
