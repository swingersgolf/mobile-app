import Alert, { InFormAlert } from "@/components/Alert";
import Spinner from "@/components/Spinner";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import authStyles from "@/styles/authStyles";
import formStyles from "@/styles/FormStyles";
import GlobalStyles from "@/styles/GlobalStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

type ForgotPasswordFormValues = {
  email: string;
};

const ForgotPasswordScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { forgotPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setError("");
    try {
      await forgotPassword(data.email);
      router.push({
        pathname: "/reset",
        params: { email: data.email },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to send code to email. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
            <Text style={GlobalStyles.h1}>Enter your email</Text>
            <Text style={GlobalStyles.body}>
              We will send you a 6-digit code to verify your identity.
            </Text>
          </View>
          <View id="login-form" style={formStyles.form}>
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="email"
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
                          errors.email && formStyles.formInputTitleError,
                        ]}
                      >
                        Email
                      </Text>
                    )}
                    <TextInput
                      placeholder="Email"
                      keyboardType="email-address"
                      autoComplete="email"
                      textContentType="emailAddress"
                      autoCapitalize="none"
                      style={[
                        formStyles.formInput,
                        errors.email && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={colors.neutral.dark}
                    />
                    {errors.email && (
                      <InFormAlert error={errors.email.message} />
                    )}
                  </>
                )}
              />
            </View>
            {error && <Alert error={error} />}
            <View style={authStyles.buttonContainer}>
              <TextButton
                text="Send code"
                onPress={handleSubmit(handleForgotPassword)}
                textColor={colors.button.primary.text}
                backgroundColor={colors.button.primary.background}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default ForgotPasswordScreen;
