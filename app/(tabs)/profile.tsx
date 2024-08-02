import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <SafeAreaView style={styles.profile}>
      <Text>Profile</Text>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
