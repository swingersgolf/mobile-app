import { colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const RoundStyles = StyleSheet.create({
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
  roundRequestContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    columnGap: 20,
    rowGap: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    height: "100%",
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
    columnGap: 5,
    rowGap: 5,
    flexWrap: "wrap",
    width: 50,
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
  memberIconFilled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 2,
    height: 20,
    width: 20,
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.default,
  },
  memberIconEmpty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 2,
    height: 20,
    width: 20,
    borderColor: colors.neutral.medium,
    backgroundColor: colors.neutral.light,
  },
  roundDetailsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    rowGap: 20,
  },
  roundEditContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    rowGap: 20,
  },
  memberList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    rowGap: 10,
    width: "100%",
  },
  memberListItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 20,
    height: 50,
    padding: 10,
    width: "100%",
    backgroundColor: colors.neutral.light,
  },
  memberProfilePicture: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    width: 40,
    height: 40,
  },
  memberListItemContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 10,
  },
  actionButtonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  hostIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderRightWidth: 15, // Width of the left border
    borderTopWidth: 15, // Height of the bottom border
    borderRightColor: "transparent", // Left border color (transparent)
    borderTopColor: colors.primary.default, // Bottom border color (color of the triangle)
    borderStyle: "solid",
  },
  preferredAttribute: {
    backgroundColor: colors.primary.default,
    borderColor: colors.primary.default,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  indifferentAttribute: {
    backgroundColor: colors.neutral.medium,
    borderColor: colors.neutral.medium,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  dislikedAttribute: {
    backgroundColor: colors.alert.error,
    borderColor: colors.alert.error,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 10,
  },
  myRoundsButton: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.primary.default,
  },
  myRoundsButtonText: {
    color: colors.neutral.light,
  },
  textButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    rowGap: 10,
  },
  notificationItemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: 20,
    width: "100%",
    paddingVertical: 5,
  },
  notificationHeaderContainer: {
    width: "100%",
    borderTopColor: colors.neutral.light,
    borderTopWidth: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 9999,
    backgroundColor: colors.primary.default,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary.dark,
    marginBottom: 10,
  },
  preferencesSection: {
    marginTop: 10,
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
  preferenceOptions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceLabel: {
    color: colors.neutral.mediumDark,
  },
  preferenceButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
  },
  selectedButton: {
    backgroundColor: colors.primary.default,
    borderColor: colors.primary.default,
  },
  preferenceButtonText: {
    color: colors.neutral.dark,
  },
  selectedButtonText: {
    color: colors.neutral.light,
  },
  preferencesForm: {
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
    width: "100%",
  },
});
