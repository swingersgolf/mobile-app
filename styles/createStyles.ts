import { StyleSheet } from "react-native";

const createStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
    width: "100%",
    padding: 20,
  },
  spinnerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default createStyles;
