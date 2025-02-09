import { Appearance, StyleSheet } from "react-native";
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
    color: colors.neutral.dark,
    fontSize: 14,
  },
  preferencesForm: {
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
    width: "100%",
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
    borderRadius: 5,
  },
  preferenceRowError: {
    borderColor: colors.alert.error,
  },
  preferencesSection: {
    marginTop: 10,
  },
  preferenceOptions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  preferenceLabel: {
    color: colors.neutral.dark,
  },
  preferenceButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
  },
  preferenceButtonText: {
    color: colors.neutral.dark,
  },
  selectedButton: {
    backgroundColor: colors.primary.default,
    borderColor: colors.primary.default,
  },
  selectedButtonText: {
    color:
      Appearance.getColorScheme() === "dark"
        ? colors.neutral.dark
        : colors.neutral.light,
  },
  textButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    rowGap: 10,
  },
  modalFormContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalForm: {
    backgroundColor: colors.background.primary,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    rowGap: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: colors.alert.error,
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: "column", // Stack children vertically
    justifyContent: "flex-start", // Ensure they start from the top
    alignItems: "stretch", // Stretch form fields across the container
  },
  picker: {
    overflow: "hidden", // Optional: Hide the overflowing items
    height: 100, // Set the height of the dropdown
  },
  pickerItem: {
    color: colors.neutral.dark,
    fontSize: 14,
    height: 100, // Set the height of each item in the dropdown
  },
});

export default formStyles;
