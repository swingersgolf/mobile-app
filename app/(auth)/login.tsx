import { useState } from "react";
import { Text, View, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/schemas/loginSchema";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import Spinner from "@/components/Spinner";
import authStyles from "@/styles/authStyles";
import formStyles from "@/styles/FormStyles";
import Alert, { InFormAlert } from "@/components/Alert";

type LoginFormValues = {
  email: string;
  password: string;
};

const socialMediaProviders = [
  {
    name: "Google",
    icon: <AntDesign name="google" size={24} color="black" />,
    signInMethod: "signInWithGoogle",
  },
  {
    name: "Facebook",
    icon: <AntDesign name="facebook-square" size={24} color="black" />,
    signInMethod: "signInWithFacebook",
  },
  {
    name: "Twitter",
    icon: <AntDesign name="twitter" size={24} color="black" />,
    signInMethod: "signInWithTwitter",
  },
];

const Login = () => {
  const { signIn, resendVerificationCode } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: LoginFormValues) => {
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      await signIn(data.email, data.password);
      router.replace("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to create account. Please try again.";
        if (error.response.status === 428) {
          await resendVerificationCode(data.email);
          router.replace({
            pathname: "/verify",
            params: { email: data.email, password: data.password },
          });
        } else {
          setError(errorMessage);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View id="login" testID="login" style={authStyles.container}>
      {loading ? (
        <View style={authStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <Text style={authStyles.title}>Sign in to your account</Text>
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
                          ,
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
                      placeholder="Password"
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
            {error && <Alert error={error} />}
            <TextButton
              text="Sign in"
              onPress={handleSubmit(handleSignIn)}
              textColor={colors.neutral.light}
              backgroundColor={colors.primary.default}
            />
          </View>
          <View
            id="social-media-platforms"
            style={authStyles.socialMediaContainer}
          >
            {socialMediaProviders.map((provider, index) => (
              <Pressable key={index}>{provider.icon}</Pressable>
            ))}
          </View>
          <Text style={authStyles.authLink}>
            New to Swingers?&nbsp;
            <Text
              style={authStyles.link}
              onPress={() => router.push("/register")}
            >
              Create an account
            </Text>
          </Text>
        </>
      )}
    </View>
  );
};

export default Login;
