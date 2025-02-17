import { colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

const createStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollViewContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  spinnerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default createStyles;
