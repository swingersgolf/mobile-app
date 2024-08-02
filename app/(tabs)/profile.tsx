import { Text, StyleSheet, SafeAreaView } from "react-native";
import { useSession } from "../../contexts/AuthContext";

const Profile = () => {
  const { signOut } = useSession();
  return (
    <SafeAreaView style={styles.profile}>
      <Text>Profile</Text>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        Sign Out
      </Text>
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
