import alertStyles from "@/styles/AlertStyles";
import { Feather } from "@expo/vector-icons";
import { View, Text } from "react-native";

interface AlertProps {
  error: string | undefined;
}

export const InFormAlert = ({ error }: AlertProps) => {
  return (
    <View style={alertStyles.errorTextContainer}>
      <Text style={alertStyles.errorText}>{error}</Text>
    </View>
  );
};

const Alert = ({ error }: AlertProps) => {
  return (
    <View style={alertStyles.alert}>
      <Feather name="alert-triangle" size={12} style={alertStyles.alertIcon} />
      <Text style={alertStyles.errorText}>{error}</Text>
    </View>
  );
};

export default Alert;
