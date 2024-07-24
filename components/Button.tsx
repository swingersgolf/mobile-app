import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type ButtonProps = {
  text: string;
  outline?: boolean;
  onPress: () => void;
};

const Button = ({ onPress, text, outline = false }: ButtonProps) => {
  const { accent, backgroundPrimary } = useTheme();

  const buttonStyles = StyleSheet.create({
    base: {
      paddingVertical: 15,
      borderWidth: 1,
      borderColor: accent,
      display: "flex",
      alignItems: "center",
      borderRadius: 9999,
    } as ViewStyle,
    filled: {
      backgroundColor: accent,
    } as ViewStyle,
    outlined: {
      backgroundColor: "transparent",
    } as ViewStyle,
    text: {
      color: outline ? accent : backgroundPrimary,
    } as TextStyle,
  });

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
