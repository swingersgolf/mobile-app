import { View, Text, TextInput } from "react-native";
import { accountStyles } from "./accountStyles";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { convertCamelCaseToLabel } from "@/utils/text";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Alert from "@/components/Alert";
import { router } from "expo-router";

const EditAccount = () => {
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [updatedProfile, setUpdatedProfile] = useState(profile);

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      if (updatedProfile) {
        await updateProfile(updatedProfile);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to update account. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={accountStyles.container}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Text>Edit account screen</Text>
          <View style={accountStyles.profileContent}>
            {updatedProfile &&
              Object.entries(updatedProfile).map(([key, value]) => {
                return (
                  <TextInput
                    key={key}
                    value={value}
                    placeholder={convertCamelCaseToLabel(key)}
                    placeholderTextColor={colors.neutral.medium}
                    onChangeText={(text) =>
                      setUpdatedProfile({ ...updatedProfile, [key]: text })
                    }
                    style={accountStyles.input}
                  />
                );
              })}
          </View>
          <TextButton
            text={"Save changes"}
            onPress={handleSaveChanges}
            textColor={colors.primary.default}
            backgroundColor={colors.primary.default}
            outline
          />
          {error && <Alert error={error} />}
        </>
      )}
    </View>
  );
};

export default EditAccount;
