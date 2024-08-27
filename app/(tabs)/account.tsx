import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  TextInput,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import axios from "axios";
import { Feather } from "@expo/vector-icons";

const editableFields = [
  { key: "handicap", label: "Handicap", keyboardType: "numeric" },
  { key: "birthdate", label: "Birthdate", keyboardType: "default" },
  { key: "postalcode", label: "Postal Code", keyboardType: "default" },
];
const uneditableFields = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
];

const Account = () => {
  const { signOut, account, updateAccount, fetchAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editedAccount, setEditedAccount] = useState<Partial<typeof account>>(
    {},
  );

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAccount({ ...account }); // Initialize with current account values
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(""); // Clear any previous errors
    try {
      await updateAccount(editedAccount);
      await fetchAccount();
      setIsEditing(false);
      setEditedAccount({});
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to update account. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAccount({ ...account }); // Reset to the original account values
  };

  const handleChange = (field: keyof typeof account, value: string) => {
    setEditedAccount((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.profile}>
      {isLoading || !account ? (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
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
          <View id="uneditable-fields" style={styles.uneditableFields}>
            {uneditableFields.map((field, index) => (
              <View key={index} style={styles.profileField}>
                <Text style={styles.fieldTitle}>{field.label}</Text>
                <Text style={styles.fieldContent}>
                  {account?.[field.key as keyof typeof account] &&
                    account[field.key as keyof typeof account]}
                </Text>
              </View>
            ))}
          </View>
          <View id="editable-fields" style={styles.editableFields}>
            {editableFields.map((field, index) => (
              <View style={styles.profileField} key={index}>
                <Text style={styles.fieldTitle}>{field.label}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedAccount[field.key]?.toString() || ""}
                    onChangeText={(value) => handleChange(field.key, value)}
                    keyboardType={field.keyboardType as any}
                  />
                ) : (
                  <Text style={styles.fieldContent}>
                    {account?.[field.key] && account[field.key]}
                  </Text>
                )}
              </View>
            ))}
          </View>
          {error && (
            <View style={styles.alert}>
              <Feather
                name="alert-triangle"
                size={12}
                style={styles.alertIcon}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <View style={styles.buttonsContainer}>
            {isEditing ? (
              <View style={styles.editButtonsContainer}>
                <TextButton
                  text="Save"
                  onPress={handleSave}
                  textColor={colors.neutral.light}
                  backgroundColor={colors.primary.default}
                  width={"47.5%"}
                />
                <TextButton
                  text="Cancel"
                  onPress={handleCancel}
                  textColor={colors.primary.default}
                  outline
                  backgroundColor={colors.background.primary}
                  width={"47.5%"}
                />
              </View>
            ) : (
              <TextButton
                text="Edit Profile"
                onPress={handleEdit}
                textColor={colors.neutral.light}
                backgroundColor={colors.primary.default}
              />
            )}
            <TextButton
              text="Sign Out"
              onPress={signOut}
              textColor={colors.primary.default}
              outline
              backgroundColor={colors.background.primary}
            />
          </View>
        </View>
      )}
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
  input: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
    color: colors.neutral.dark,
  },
  buttonsContainer: {
    width: "100%",
    gap: 6,
  },
  editButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editableFields: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    width: "100%",
  },
  uneditableFields: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    width: "100%",
    paddingBottom: 6,
    borderBottomColor: colors.neutral.medium,
    borderBottomWidth: 1,
  },
  alert: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    columnGap: 6,
  },
  alertIcon: {
    color: colors.alert.error,
  },
  errorText: {
    color: colors.alert.error,
    width: "100%",
    textAlign: "left",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
