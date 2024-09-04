import { colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  privacy: {
    textAlign: "left",
  },
  link: {
    color: colors.primary.light,
  },
  spinnerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  authLink: {
    textAlign: "center",
  },
  socialMediaContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
});
