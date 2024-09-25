import { colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  spinnerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  roundContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    columnGap: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    borderBottomColor: colors.neutral.light,
    borderBottomWidth: 5,
  },
  whenConatiner: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    rowGap: 10,
    flex: 1,
  },
  memberContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    columnGap: 5,
    rowGap: 5,
    flexWrap: "wrap",
    width: 46,
  },
  attributeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    columnGap: 10,
    rowGap: 10,
    flexWrap: "wrap",
  },
  attribute: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary.default,
  },
  scrollStyle: {
    width: "100%",
    backgroundColor: colors.background.primary,
  },
  filterOverlayContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    backgroundColor: colors.secondary.blue,
    borderRadius: 9999,
  },
});