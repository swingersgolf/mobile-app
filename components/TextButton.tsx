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
  const buttonStyle: ViewStyle = {
    paddingVertical: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    backgroundColor: outline ? "transparent" : backgroundColor,
    borderWidth: outline ? 1 : 0,
    borderColor: outline ? backgroundColor : "transparent",
  };

  const textStyle: TextStyle = {
    color: outline ? backgroundColor : textColor,
    fontSize: 20,
    fontWeight: "bold",
  };

  return (
    <Pressable onPress={onPress} style={buttonStyle} testID="text-button">
      <Text style={textStyle}>{text}</Text>
    </Pressable>
  );
};

export default TextButton;
