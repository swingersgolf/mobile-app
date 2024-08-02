import { Text, StyleSheet, SafeAreaView } from "react-native";

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
