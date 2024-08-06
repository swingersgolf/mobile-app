import { Text, StyleSheet, SafeAreaView, View, Image } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import TextButton from "@/components/TextButton"; // Assuming this is the path to your component
import { colors } from "@/constants/Colors";

const Profile = () => {
  const { signOut } = useAuth(); // Assuming `user` contains user data

  return (
    <SafeAreaView style={styles.profile}>
      <View style={styles.profileContent}>
        {true ? (
          <View style={styles.profileImage}>
            <Text style={{ color: colors.white, textAlign: "center" }}>
              Click to add profile picture
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: "" }}
            alt="Profile Picture"
            style={styles.profileImage}
          />
        )}
        <View style={styles.profileField}>
          <Text style={styles.fieldTitle}>Name</Text>
          <Text style={styles.fieldContent}>John Doe</Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldTitle}>Email</Text>
          <Text style={styles.fieldContent}>johndoe@example.com</Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldTitle}>Age</Text>
          <Text style={styles.fieldContent}>74</Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldTitle}>Handicap Index</Text>
          <Text style={styles.fieldContent}>-12.0</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TextButton
            text="Edit Profile"
            onPress={() => {
              /* Add edit profile functionality */
            }}
            textColor={colors.white}
            backgroundColor={colors.lightGreen}
          />
          <TextButton
            text="Sign Out"
            onPress={signOut}
            textColor={colors.lightGreen}
            backgroundColor={colors.lightGreen}
            outline
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: 20,
    padding: 20,
  },
  profileImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    padding: 20,
    borderRadius: 9999,
    backgroundColor: colors.grey,
  },
  profileFields: {},
  profileField: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    gap: 6,
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.lightGreen,
  },
  fieldContent: {
    fontSize: 20,
    color: colors.black,
  },
  buttonsContainer: {
    width: "100%",
    gap: 6,
  },
});
