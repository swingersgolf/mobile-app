import { View, Alert, Linking } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import accountStyles from "@/styles/accountStyles";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { router } from "expo-router";

const AccountSettingsScreen = () => {
  const { signOut } = useAuth();
  const { user, forgotPassword } = useAuth();

  const handleResetPassword = () => {
    try {
      if (user) {
        forgotPassword(user?.email);
        router.push({
          pathname: "/reset",
          params: { email: user?.email },
        });
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleContactSupport = async () => {
    const supportEmail = "support@example.com";
    const subject = "Support Request";
    const body = `Hello Support Team,\n\nI need help with...`;
    const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(mailto);
      if (supported) {
        await Linking.openURL(mailto);
      } else {
        Alert.alert("Error", "No email application available");
      }
    } catch (error) {
      console.error("Error opening email app:", error);
      Alert.alert("Error", "Unable to open email application");
    }
  };

  return (
    <View>
      <View style={accountStyles.paddedButtonContainer}>
        <TextButton
          text={"Contact support"}
          onPress={handleContactSupport}
          outline
          textColor={colors.primary.default}
          backgroundColor={colors.primary.default}
        />
        {user && (
          <TextButton
            text={"Reset password"}
            onPress={handleResetPassword}
            outline
            textColor={colors.primary.default}
            backgroundColor={colors.primary.default}
          />
        )}
        <TextButton
          text={"Sign out"}
          onPress={signOut}
          outline
          textColor={colors.primary.default}
          backgroundColor={colors.primary.default}
        />
      </View>
    </View>
  );
};

export default AccountSettingsScreen;
