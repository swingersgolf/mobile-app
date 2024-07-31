import { Pressable, StyleProp, ViewStyle, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";

type BackButtonProps = {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

const BackButton = ({ style, onPress }: BackButtonProps) => {
  return (
    <Pressable
      style={[styles.button, style]}
      onPress={onPress}
      testID="back-arrow"
    >
      <FontAwesome size={28} name="chevron-left" color="black" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    zIndex: 9999,
  },
});

export default BackButton;
