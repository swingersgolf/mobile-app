import { StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

const accountStyles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  spinnerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  accountContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    rowGap: 30,
  },
  accountContent: {
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
    width: "100%",
  },
  profilePicture: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    borderRadius: 9999,
    backgroundColor: colors.neutral.medium,
  },
  user: {
    fontSize: 24,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  infoTitle: {
    fontSize: 20,
    color: colors.neutral.dark,
  },
  info: {
    color: colors.neutral.medium,
    fontSize: 16,
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
});

export default accountStyles;
