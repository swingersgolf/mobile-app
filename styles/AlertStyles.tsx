import { StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

const alertStyles = StyleSheet.create({
  errorText: {
    color: colors.alert.error,
    fontSize: 12,
    marginLeft: 5,
  },
  alert: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    width: "100%",
    justifyContent: "flex-start",
  },
  alertIcon: {
    color: colors.alert.error,
  },
  errorTextContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -8 }],
    flexDirection: "row",
    alignItems: "center",
    pointerEvents: "none",
  },
});

export default alertStyles;
