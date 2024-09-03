import { colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

interface AlertProps {
  error: string;
}

const Alert = ({ error }: AlertProps) => {
  return (
    <View style={styles.alert}>
      <Feather name="alert-triangle" size={12} style={styles.alertIcon} />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  errorText: {
    color: colors.alert.error,
    fontSize: 12,
    marginLeft: 5,
  },
  alert: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    width: "100%",
    justifyContent: "flex-start",
  },
  alertIcon: {
    color: colors.alert.error,
  },
});

export default Alert;
