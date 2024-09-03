import { FC, useState } from "react";
import { Text, View, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validationSchemas";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { authStyles } from "./authStyles";
import Alert from "@/components/Alert";

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

const Login: FC = () => {
  const { signIn } = useAuth();
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
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View id="login" testID="login" style={authStyles.container}>
      <Text style={authStyles.title}>Sign in to your account</Text>
      {loading ? (
        <View style={authStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View id="login-form" style={authStyles.form}>
            <View style={authStyles.inputWrapper}>
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
                    <TextInput
                      placeholder="Email"
                      keyboardType="email-address"
                      autoComplete="email"
                      textContentType="emailAddress"
                      style={[
                        authStyles.formInput,
                        errors.email && authStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.email && (
                      <View style={authStyles.errorTextContainer}>
                        <Text style={authStyles.errorText}>
                          {errors.email.message}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              />
            </View>
            <View style={authStyles.inputWrapper}>
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
                    <TextInput
                      placeholder="Password"
                      autoComplete="password"
                      textContentType="password"
                      secureTextEntry={true}
                      style={[
                        authStyles.formInput,
                        errors.password && authStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.password && (
                      <View style={authStyles.errorTextContainer}>
                        <Text style={authStyles.errorText}>
                          {errors.password.message}
                        </Text>
                      </View>
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
