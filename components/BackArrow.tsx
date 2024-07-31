import { router } from "expo-router";
import { Pressable, StyleProp, ViewStyle, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type BackButtonProps = {
  style?: StyleProp<ViewStyle>;
};

const BackButton = ({ style }: BackButtonProps) => {
  return (
    <Pressable
      style={[styles.button, style]}
      onPress={() => router.back()}
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
