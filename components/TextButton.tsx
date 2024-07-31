import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

type ButtonProps = {
  text: string;
  outline?: boolean;
  onPress: () => void;
};

const TextButton = ({ onPress, text, outline = false }: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        buttonStyles.base,
        outline ? buttonStyles.outlined : buttonStyles.filled,
      ]}
      testID="button"
    >
      <Text
        style={[
          buttonStyles.textBase,
          outline ? buttonStyles.outlinedText : buttonStyles.filledText,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default TextButton;

const buttonStyles = StyleSheet.create({
  base: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  filled: {
    backgroundColor: colors.darkGreen,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.darkGreen,
  },
  textBase: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  filledText: {
    color: colors.white,
  },
  outlinedText: {
    color: colors.darkGreen,
  },
});
