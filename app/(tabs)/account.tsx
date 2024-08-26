import { Text, StyleSheet, SafeAreaView, View, Image } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import TextButton from "@/components/TextButton"; // Assuming this is the path to your component
import { colors } from "@/constants/Colors";

const Account = () => {
  const { signOut, account } = useAuth(); // Assuming `user` contains user data
  return (
    <SafeAreaView style={styles.profile}>
      <View style={styles.profileContent}>
        {true ? (
          <View style={styles.profileImage}>
            <Text style={{ textAlign: "center" }}>
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
          <Text style={styles.fieldContent}>
            {account?.name && account.name}
          </Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldTitle}>Email</Text>
          <Text style={styles.fieldContent}>
            {account?.email && account.email}
          </Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldTitle}>Handicap</Text>
          <Text style={styles.fieldContent}>
            {account?.handicap && account.handicap}
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TextButton
            text="Edit Profile"
            onPress={() => {
              /* Add edit profile functionality */
            }}
            textColor={colors.neutral.light}
            backgroundColor={colors.primary.default}
          />
          <TextButton
            text="Sign Out"
            onPress={signOut}
            textColor={colors.primary.default}
            outline
            backgroundColor={colors.background.primary}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
    backgroundColor: colors.neutral.medium,
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
    color: colors.neutral.dark,
  },
  fieldContent: {
    fontSize: 20,
    color: colors.neutral.dark,
  },
  buttonsContainer: {
    width: "100%",
    gap: 6,
  },
});
