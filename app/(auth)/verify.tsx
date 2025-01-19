import Alert, { InFormAlert } from "@/components/Alert";
import Spinner from "@/components/Spinner";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { verifyEmailSchema } from "@/schemas/verifyEmailSchema";
import authStyles from "@/styles/authStyles";
import formStyles from "@/styles/FormStyles";
import GlobalStyles from "@/styles/GlobalStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

type VerifyEmailFormValues = {
  code: string;
};

const VerifyEmailScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, verifyEmail, resendVerificationCode } = useAuth();
  const { email, password } = useLocalSearchParams(); // Retrieve the email

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: yupResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleVerifyEmail = async (data: VerifyEmailFormValues) => {
    setLoading(true);
    setError("");
    try {
      await verifyEmail(email as string, data.code);
      await signIn(email as string, password as string);
      router.push("/set-photo");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to verify email. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationCode = async () => {
    setLoading(true);
    setError("");
    try {
      await resendVerificationCode(email as string);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to resend code. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View id="verify-email" testID="verify-email" style={authStyles.container}>
      {loading ? (
        <View style={authStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View>
            <Text style={GlobalStyles.h1}>Enter your code</Text>
            <Text style={GlobalStyles.body}>
              We have sent a 6-digit verification code to your email.
            </Text>
          </View>
          <View id="login-form" style={formStyles.form}>
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="code"
                render={({
                  field: { onChange, onBlur, value },
                }: {
                  field: {
                    onChange: (value: string) => void;
                    onBlur: () => void;
                    value: string;
                  };
                }) => (
                  <>
                    {value && (
                      <Text
                        style={[
                          formStyles.formInputTitle,
                          errors.code && formStyles.formInputTitleError,
                        ]}
                      >
                        Code
                      </Text>
                    )}
                    <TextInput
                      placeholder="6-digit code"
                      autoComplete="off"
                      textContentType="oneTimeCode"
                      keyboardType="number-pad"
                      style={[
                        formStyles.formInput,
                        errors.code && formStyles.invalidInput,
                      ]}
                      maxLength={6}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={colors.neutral.dark}
                    />
                    {errors.code && <InFormAlert error={errors.code.message} />}
                  </>
                )}
              />
            </View>
            {error && <Alert error={error} />}
            <View style={authStyles.buttonContainer}>
              <TextButton
                text="Verify"
                onPress={handleSubmit(handleVerifyEmail)}
                textColor={colors.button.primary.text}
                backgroundColor={colors.button.primary.background}
              />
              <TextButton
                text={"Resend code"}
                onPress={handleResendVerificationCode}
                textColor={colors.button.secondary.text}
                backgroundColor={colors.button.secondary.background}
                outline
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default VerifyEmailScreen;
