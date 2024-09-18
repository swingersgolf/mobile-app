import { View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import accountStyles from "@/styles/accountStyles";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { router } from "expo-router";

const Settings = () => {
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

  return (
    <View style={accountStyles.container}>
      <View style={accountStyles.buttonContainer}>
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

export default Settings;
