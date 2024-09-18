import Alert, { InFormAlert } from "@/components/Alert";
import Spinner from "@/components/Spinner";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import accountStyles from "@/styles/accountStyles";
import formStyles from "@/styles/FormStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

type ResetPasswordFormValues = {
  email: string;
  code: string;
  password: string;
};

const Reset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword, signIn } = useAuth();
  const { email } = useLocalSearchParams(); // Retrieve the email

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: (email as string) ?? "",
    },
  });

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    setError("");
    try {
      await resetPassword(data.email, data.code, data.password);
      await signIn(data.email, data.password);
      router.dismissAll();
      router.replace("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to reset password. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      id="verify-email"
      testID="verify-email"
      style={(accountStyles.container, accountStyles.accountFormContainer)}
    >
      {loading ? (
        <View style={accountStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View>
            <Text style={accountStyles.title}>Enter your credentials</Text>
            <Text style={accountStyles.privacy}>
              We have sent a 6-digit verification code to your email.
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
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.email && (
                      <InFormAlert error={errors.email.message} />
                    )}
                  </>
                )}
              />
            </View>
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="password"
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
                          errors.password && formStyles.formInputTitleError,
                        ]}
                      >
                        Password
                      </Text>
                    )}
                    <TextInput
                      placeholder="New Password"
                      autoComplete="password"
                      textContentType="password"
                      secureTextEntry={true}
                      style={[
                        formStyles.formInput,
                        errors.password && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.password && (
                      <InFormAlert error={errors.password.message} />
                    )}
                  </>
                )}
              />
            </View>
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
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.code && <InFormAlert error={errors.code.message} />}
                  </>
                )}
              />
            </View>
            {error && <Alert error={error} />}
            <View style={accountStyles.buttonContainer}>
              <TextButton
                text="Confirm"
                onPress={handleSubmit(handleResetPassword)}
                textColor={colors.neutral.light}
                backgroundColor={colors.primary.default}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default Reset;
