import { StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

const formStyles = StyleSheet.create({
  form: {
    width: "100%",
    justifyContent: "center",
    rowGap: 20,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
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
  formInput: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
    color: colors.neutral.dark,
  },
  invalidInput: {
    borderColor: colors.alert.error,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    width: "100%",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.neutral.light,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.light,
    backgroundColor: colors.background.primary,
    width: "100%",
  },
  placeholderStyle: {
    color: colors.neutral.mediumDark,
    fontSize: 14,
  },
});

export default formStyles;
