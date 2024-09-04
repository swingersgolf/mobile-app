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
import { profileSchema } from "@/schemas/profileSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { ProfileType } from "@/types/authTypes";

const EditAccount = () => {
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveChanges = async (data: ProfileType) => {
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      await updateProfile(data);
      router.back();
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

  const handleCancel = () => {
    reset();
    router.back();
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      handicap: profile?.handicap || 0,
      postalCode: profile?.postalCode || "",
    },
  });

  return (
    <View style={accountStyles.container}>
      {loading ? (
        <View style={accountStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View style={accountStyles.formContainer}>
            <View id="login-form" style={formStyles.form}>
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
                        onChangeText={onChange}
                        value={value}
                        placeholderTextColor={colors.neutral.medium}
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
                        placeholderTextColor={colors.neutral.medium}
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
                  text={"Save changes"}
                  onPress={handleSubmit(handleSaveChanges)}
                  textColor={colors.neutral.light}
                  backgroundColor={colors.primary.default}
                />
                <TextButton
                  text={"Cancel"}
                  onPress={handleCancel}
                  textColor={colors.primary.default}
                  backgroundColor={colors.primary.default}
                  outline
                />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default EditAccount;
