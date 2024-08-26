import { colors } from "@/constants/Colors";
import { StyleSheet, Dimensions } from "react-native";
import Svg, { Polygon } from "react-native-svg";

const { width } = Dimensions.get("window");

const TrapezoidBackground = () => {
  return (
    <Svg height="300" width={width} style={styles.trapezoid}>
      <Polygon
        points={`0,0 ${width},0 ${width},200 0,250`}
        fill={colors.primary.default}
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  trapezoid: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

export default TrapezoidBackground;
