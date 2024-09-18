import { StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

const accountStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: 20,
    flex: 1,
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
  },
  user: {
    fontSize: 24,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 20,
    borderBottomColor: colors.neutral.light,
    borderBottomWidth: 5,
  },
  pictureContainer: {
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 16,
    color: colors.neutral.medium,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  info: {
    color: colors.neutral.dark,
    fontSize: 16,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  subtitle: {
    textAlign: "left",
  },
});

export default accountStyles;
