import { Pressable, StyleProp, ViewStyle, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

type BackButtonProps = {
  style?: StyleProp<ViewStyle>;
  color?: string;
};

const BackButton = ({ style, color }: BackButtonProps) => {
  const router = useRouter();
  return (
    <Pressable
      style={[styles.button, style]}
      onPress={() => router.back()}
      testID="back-button"
    >
      <FontAwesome size={28} name="chevron-left" color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    zIndex: 9999,
  },
});

export default BackButton;
