import { router } from "expo-router";
import { Pressable, StyleProp, ViewStyle, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@/contexts/ThemeContext";

type BackButtonProps = {
  style?: StyleProp<ViewStyle>;
};

const BackButton = ({ style }: BackButtonProps) => {
  const theme = useTheme();
  return (
    <Pressable
      style={[styles.button, style]}
      onPress={() => router.back()}
      testID="back-arrow"
    >
      <FontAwesome
        size={28}
        name="chevron-left"
        color={theme.backgroundPrimary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    zIndex: 9999,
  },
});

export default BackButton;
