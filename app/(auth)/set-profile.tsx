import { View, Text, TextInput } from "react-native";
import accountStyles from "@/styles/accountStyles";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Alert, { InFormAlert } from "@/components/Alert";
import { router } from "expo-router";
import formStyles from "@/styles/FormStyles";
import { setProfileSchema } from "@/schemas/profileSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { Profile } from "@/types/authTypes";
import GlobalStyles from "@/styles/GlobalStyles";

const SetProfileScreen = () => {
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveChanges = async (data: Profile) => {
    setLoading(true);
    setError("");

    // Create a new object with only the fields that have a value
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value != null,
      ),
    );

    try {
      await updateProfile(filteredData);
      router.push("set-preferences");
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

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(setProfileSchema),
    defaultValues: {
      handicap: profile?.handicap,
      postalCode: profile?.postalCode,
    },
  });

  return (
    <View style={accountStyles.container}>
      {!profile || loading ? (
        <View style={accountStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View>
            <Text style={GlobalStyles.h1}>Set your profile</Text>
          </View>
          <View id="edit-profile-form" style={formStyles.form}>
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="handicap"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    {value && (
                      <Text
                        style={[
                          formStyles.formInputTitle,
                          errors.handicap && formStyles.formInputTitleError,
                        ]}
                      >
                        Handicap
                      </Text>
                    )}
                    <TextInput
                      placeholder="Enter handicap (e.g., 10.5)"
                      keyboardType="decimal-pad"
                      autoComplete="off"
                      style={[
                        formStyles.formInput,
                        errors.handicap && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={(val) => {
                        onChange(val === "" ? null : val); // Set null if the input is cleared
                      }}
                      value={value?.toString()}
                      placeholderTextColor={colors.neutral.dark}
                    />
                    {errors.handicap && (
                      <InFormAlert error={errors.handicap.message} />
                    )}
                  </>
                )}
              />
            </View>
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="postalCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    {value && (
                      <Text
                        style={[
                          formStyles.formInputTitle,
                          errors.postalCode && formStyles.formInputTitleError,
                        ]}
                      >
                        Postal Code
                      </Text>
                    )}
                    <TextInput
                      placeholder="Enter postal code (e.g., A1A1A1)"
                      keyboardType="default"
                      autoComplete="postal-code"
                      textContentType="postalCode"
                      style={[
                        formStyles.formInput,
                        errors.postalCode && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={colors.neutral.dark}
                    />
                    {errors.postalCode && (
                      <InFormAlert error={errors.postalCode.message} />
                    )}
                  </>
                )}
              />
            </View>
            {error && <Alert error={error} />}
            <View style={accountStyles.buttonContainer}>
              <TextButton
                text="Continue"
                onPress={handleSubmit(handleSaveChanges)}
                textColor={
                  isValid ? colors.button.primary.text : colors.neutral.dark
                }
                backgroundColor={
                  isValid
                    ? colors.button.primary.background
                    : colors.neutral.medium
                }
                disabled={!isValid}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default SetProfileScreen;
