import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

type NavButtonProps = {
  route: string;
  text: string;
  outline?: boolean;
};

const NavButton = ({ route, text, outline = false }: NavButtonProps) => {
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
    <Link
      href={route}
      asChild
      style={[
        buttonStyles.base,
        outline ? buttonStyles.outlined : buttonStyles.filled,
      ]}
      testID="nav-button"
    >
      <Pressable>
        <Text style={buttonStyles.text}>{text}</Text>
      </Pressable>
    </Link>
  );
};

export default NavButton;
