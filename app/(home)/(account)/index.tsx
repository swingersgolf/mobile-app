import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Text, View } from "react-native";
import accountStyles from "@/styles/accountStyles";
import { convertCamelCaseToLabel } from "@/utils/text";
import Spinner from "@/components/Spinner";

const Account = () => {
  const { user, profile } = useAuth();
  return (
    <View style={accountStyles.container}>
      {!user || !profile ? (
        <View style={accountStyles.spinnerContainer}>
          <Spinner />
        </View>
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
                      {convertCamelCaseToLabel(key)}: {value}
                    </Text>
                  ))}
              </View>
              <View style={accountStyles.infoContainer}>
                <Text style={accountStyles.infoTitle}>Profile</Text>
                {profile &&
                  Object.entries(profile).map(([key, value]) => (
                    <Text key={key} style={accountStyles.info}>
                      {convertCamelCaseToLabel(key)}: {value}
                    </Text>
                  ))}
              </View>
            </View>
          </View>
        </>
      )}
      <View style={accountStyles.buttonContainer}>
        {user && profile && (
          <TextButton
            text={"Edit profile"}
            onPress={() => router.push("edit")}
            textColor={colors.neutral.light}
            backgroundColor={colors.primary.default}
          />
        )}
      </View>
    </View>
  );
};

export default Account;
