import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { Text, StyleSheet, View } from "react-native";

const Account = () => {
  const { signOut } = useAuth();

  return (
    <View style={styles.profile}>
      <Text>Account</Text>
      <TextButton
        text="Sign out"
        backgroundColor={colors.primary.default}
        textColor={colors.neutral.light}
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
