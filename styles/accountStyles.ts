import { StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

export const accountStyles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  spinnerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  accountContent: {
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
    width: "100%",
    padding: 20,
  },
  userContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  userInfo: {
    color: colors.neutral.medium,
  },
  profileContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  profileInfo: {
    color: colors.neutral.medium,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    rowGap: 10,
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
  formInputTitle: {
    color: colors.neutral.dark,
    fontSize: 16,
    textAlign: "left",
    position: "absolute",
    left: 10,
    top: -10,
    backgroundColor: colors.background.primary,
    zIndex: 100,
    paddingHorizontal: 5,
  },
  formInputTitleError: {
    color: colors.alert.error,
  },
});
