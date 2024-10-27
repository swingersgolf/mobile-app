import { StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

const formStyles = StyleSheet.create({
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  slotSelectionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  slotButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.background.primary,
  },
  selectedSlotButton: {
    backgroundColor: colors.primary.default,
  },
  slotButtonText: {
    color: colors.neutral.dark,
  },
  selectedSlotButtonText: {
    color: colors.background.primary,
  },
});

export default formStyles;
