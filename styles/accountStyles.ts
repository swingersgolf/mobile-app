import { StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

const accountStyles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.background.secondary,
  },
  scrollContainerContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: 5,
    backgroundColor: colors.background.secondary,
  },
  spinnerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  editContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 20,
  },
  accountFormContainer: {
    padding: 20,
    rowGap: 20,
    flex: 1,
  },
  accountContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
  accountContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  profilePicture: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    borderRadius: 9999,
    overflow: "hidden",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: 10,
    backgroundColor: colors.background.primary,
    padding: 20,
  },
  pictureContainer: {
    alignItems: "center",
    padding: 40,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    rowGap: 10,
  },
  paddedButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    rowGap: 10,
    padding: 20,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
    width: "100%",
  },
  formInput: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
    color: colors.neutral.dark,
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    rowGap: 5,
    width: "100%",
  },
  preferenceLabel: {
    display: "flex",
    flexDirection: "row",
    gap: 2.5,
    alignItems: "center",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default accountStyles;
