import { FC, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validationSchemas";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import Spinner from "@/components/Spinner";

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
    <View id="login" testID="login" style={styles.login}>
      <Text style={styles.title}>Sign in to your account</Text>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View id="login-form" style={styles.form}>
            <View style={styles.inputWrapper}>
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
                        styles.formInput,
                        errors.email && styles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.email && (
                      <View style={styles.errorTextContainer}>
                        <Text style={styles.errorText}>
                          {errors.email.message}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              />
            </View>
            <View style={styles.inputWrapper}>
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
                        styles.formInput,
                        errors.password && styles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.password && (
                      <View style={styles.errorTextContainer}>
                        <Text style={styles.errorText}>
                          {errors.password.message}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              />
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
            <TextButton
              text="Sign in"
              onPress={handleSubmit(handleSignIn)}
              textColor={colors.neutral.light}
              backgroundColor={colors.primary.default}
            />
          </View>
          <View id="social-media-platforms" style={styles.socialMediaContainer}>
            {socialMediaProviders.map((provider, index) => (
              <Pressable key={index}>{provider.icon}</Pressable>
            ))}
          </View>
          <Text style={styles.register}>
            New to Swingers?&nbsp;
            <Text style={styles.link} onPress={() => router.push("/register")}>
              Create an account
            </Text>
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  login: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    rowGap: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 10,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  formInput: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
    color: colors.neutral.dark,
  },
  invalidInput: {
    borderColor: colors.alert.error,
  },
  errorTextContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -8 }],
    flexDirection: "row",
    alignItems: "center",
    pointerEvents: "none", // This ensures that clicks pass through to the input field
  },
  errorText: {
    color: colors.alert.error,
    fontSize: 12,
    marginLeft: 5,
  },
  link: {
    color: colors.primary.light,
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
  spinnerContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  register: {
    textAlign: "center",
  },
  socialMediaContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
});

export default Login;
