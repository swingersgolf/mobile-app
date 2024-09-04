import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { convertCamelCaseToLabel } from "@/utils/text";
import Spinner from "@/components/Spinner";

const Account = () => {
  const { user, profile } = useAuth();
  return (
    <View style={accountStyles.container}>
      {!user ? (
        <Spinner />
      ) : (
        <>
          <View style={accountStyles.accountContainer}>
            <View style={accountStyles.profilePicture}>
              <Text>Profile picture</Text>
            </View>
            <View style={accountStyles.accountContent}>
              <View style={accountStyles.infoContainer}>
                <Text style={accountStyles.infoTitle}>User</Text>
                {user &&
                  Object.entries(user).map(([key, value]) => (
                    <Text key={key} style={accountStyles.info}>
                      {convertCamelCaseToLabel(key)}: {value ?? "N/A"}
                    </Text>
                  ))}
              </View>
              <View style={accountStyles.infoContainer}>
                <Text style={accountStyles.infoTitle}>Profile</Text>
                {profile &&
                  Object.entries(profile).map(([key, value]) => (
                    <Text key={key} style={accountStyles.info}>
                      {convertCamelCaseToLabel(key)}: {value ?? "N/A"}
                    </Text>
                  ))}
              </View>
            </View>
          </View>
          <View style={accountStyles.buttonContainer}>
            <TextButton
              text={"Edit profile"}
              onPress={() => router.push("edit")}
              textColor={colors.primary.default}
              backgroundColor={colors.primary.default}
              outline
            />
          </View>
        </>
      )}
    </View>
  );
};

export default Account;

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
