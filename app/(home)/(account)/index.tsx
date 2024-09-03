import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { convertCamelCaseToLabel } from "@/utils/text";
import { accountStyles } from "./accountStyles";

const Account = () => {
  const { user, profile } = useAuth();
  return (
    <View style={accountStyles.container}>
      <View style={accountStyles.accountContent}>
        <Text>Profile Picture</Text>
        <View style={accountStyles.userContent}>
          {user &&
            Object.entries(user).map(([key, value]) => (
              <Text key={key} style={accountStyles.userInfo}>
                {convertCamelCaseToLabel(key)}: {value ?? "N/A"}
              </Text>
            ))}
        </View>
        <View style={accountStyles.profileContent}>
          {profile &&
            Object.entries(profile).map(([key, value]) => (
              <Text key={key} style={accountStyles.profileInfo}>
                {convertCamelCaseToLabel(key)}: {value ?? "N/A"}
              </Text>
            ))}
        </View>
      </View>
      <View style={accountStyles.buttonContainer}>
        <TextButton
          text={"Edit profile"}
          onPress={() => router.push("edit")}
          textColor={colors.neutral.light}
          backgroundColor={colors.primary.default}
        />
        <TextButton
          text={"Settings"}
          onPress={() => router.push("settings")}
          textColor={colors.primary.default}
          backgroundColor={colors.primary.default}
          outline
        />
      </View>
      {/* <View id="subscription-banner-container">
        <Text>Subscription banner</Text>
      </View> */}
    </View>
  );
};

export default Account;
