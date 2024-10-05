import {
  GestureResponderEvent,
  Pressable,
  Text,
  ViewStyle,
} from "react-native";
import { DimensionValue } from "react-native";

type ButtonProps = {
  text: string;
  outline?: boolean;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  textColor: string;
  backgroundColor: string;
  width?: DimensionValue | undefined;
  fontSize?: number | undefined;
};

const TextButton = ({
  onPress,
  text,
  outline = false,
  textColor,
  backgroundColor,
  width,
  fontSize,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => {
        const buttonStyle: ViewStyle = {
          paddingVertical: 15,
          borderRadius: 5,
          width: width ? width : "100%",
          alignItems: "center",
          backgroundColor: outline
            ? "transparent"
            : pressed
              ? "lighten"
              : backgroundColor,
          borderWidth: 1,
          borderColor: outline ? textColor : backgroundColor,
          opacity: pressed ? 0.7 : 1, // Adjust opacity when pressed
        };

        return buttonStyle;
      }}
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
    </Pressable>
  );
};

export default TextButton;
