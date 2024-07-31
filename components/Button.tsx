import { Pressable, Text, StyleSheet } from "react-native";

type ButtonProps = {
  text: string;
  outline?: boolean;
  onPress: () => void;
};

const Button = ({ onPress, text, outline = false }: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        buttonStyles.base,
        outline ? buttonStyles.outlined : buttonStyles.filled,
      ]}
      testID="button"
    >
      <Text style={buttonStyles.text}>{text}</Text>
    </Pressable>
  );
};

export default Button;

const buttonStyles = StyleSheet.create({
  base: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  filled: {
    backgroundColor: "#2a9d8f",
  },
  outlined: {
    borderWidth: 1,
    borderColor: "#2a9d8f",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
