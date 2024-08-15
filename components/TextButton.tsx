import { Pressable, Text, ViewStyle, TextStyle } from "react-native";

type ButtonProps = {
  text: string;
  outline?: boolean;
  onPress: () => void;
  textColor: string;
  backgroundColor: string;
};

const TextButton = ({
  onPress,
  text,
  outline = false,
  textColor,
  backgroundColor,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => {
        const buttonStyle: ViewStyle = {
          paddingVertical: 15,
          borderRadius: 5,
          width: "100%",
          alignItems: "center",
          backgroundColor: outline
            ? "transparent"
            : pressed
              ? "lighten"
              : backgroundColor,
          borderWidth: outline ? 1 : 0,
          borderColor: outline
            ? pressed
              ? "lighten"
              : backgroundColor
            : "transparent",
          opacity: pressed ? 0.7 : 1, // Adjust opacity when pressed
        };

        return buttonStyle;
      }}
      testID="text-button"
    >
      <Text
        style={{
          color: outline ? backgroundColor : textColor,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default TextButton;
