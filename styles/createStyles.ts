import { StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

const accountStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: 20,
    flex: 1,
    padding: 20,
  },
  spinnerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default accountStyles;
