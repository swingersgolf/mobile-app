import { Text, View } from "react-native";
import TextButton from "@/components/TextButton";
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/constants/Colors";
import { accountStyles } from "./accountStyles";

const Settings = () => {
  const { signOut } = useAuth();
  return (
    <View style={accountStyles.container}>
      <Text>Settings</Text>
      <TextButton
        text={"Sign out"}
        onPress={signOut}
        textColor={colors.primary.default}
        backgroundColor={colors.primary.default}
        outline
      />
    </View>
  );
};

export default Settings;
