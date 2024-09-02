import { colors } from "@/constants/Colors";
import { View, StyleSheet, Animated } from "react-native";

const Spinner = () => {
  const spinValue = new Animated.Value(0);

  // Spin animation
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
  ).start();

  // Interpolating the spin value to rotate the spinner
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container} testID="spinner">
      <Animated.View
        style={[styles.loader, { transform: [{ rotate: spin }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    aspectRatio: 1 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: colors.primary.default,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
});

export default Spinner;
