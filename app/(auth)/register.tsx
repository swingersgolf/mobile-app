import { FC, useState } from "react";
import { SafeAreaView, Text, View, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/utils/validationSchemas";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import * as Linking from "expo-linking";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Spinner from "@/components/Spinner";

type RegisterFormValues = {
  email: string;
  name: string;
  password: string;
};

const Register: FC = () => {
  const { createAccount, signIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleCreateAccount = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      await createAccount(data.name, data.email, data.password);
      await signIn(data.email, data.password);
      router.replace("/");
    } catch (error: any) {
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

  const handleLinkPress = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView
      id="create-account"
      testID="create-account"
      style={styles.createAccount}
    >
      <Text style={styles.title}>Create Account</Text>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <View id="create-account-form" style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="Name"
                  autoComplete="name"
                  textContentType="name"
                  style={[styles.formInput, errors.name && styles.invalidInput]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  placeholderTextColor={colors.grey}
                />
                {errors.name && (
                  <View style={styles.alert}>
                    <Feather
                      name="alert-triangle"
                      size={12}
                      style={styles.alertIcon}
                    />
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                  </View>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="Email"
                  inputMode="email"
                  autoComplete="email"
                  textContentType="emailAddress"
                  style={[
                    styles.formInput,
                    errors.email && styles.invalidInput,
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  placeholderTextColor={colors.grey}
                />
                {errors.email && (
                  <View style={styles.alert}>
                    <Feather
                      name="alert-triangle"
                      size={12}
                      style={styles.alertIcon}
                    />
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  </View>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
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
                  value={value || ""}
                  placeholderTextColor={colors.grey}
                />
                {errors.password && (
                  <View style={styles.alert}>
                    <Feather
                      name="alert-triangle"
                      size={12}
                      style={styles.alertIcon}
                    />
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  </View>
                )}
              </>
            )}
          />
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
        </View>
      )}
      <Text>
        By clicking create account you are agreeing to follow our&nbsp;
        <Text
          style={styles.link}
          onPress={() => handleLinkPress("https://google.com")}
        >
          privacy & terms
        </Text>
        .
      </Text>
      <TextButton
        text="Create Account"
        onPress={handleSubmit(handleCreateAccount)}
        textColor={colors.white}
        backgroundColor={colors.lightGreen}
      />
      <Text>
        Already have an account?&nbsp;
        <Text style={styles.link} onPress={() => router.push("/login")}>
          Login
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  createAccount: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formInput: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    color: colors.black,
  },
  invalidInput: {
    borderColor: colors.alert,
  },
  errorText: {
    color: colors.alert,
    marginVertical: 5,
    width: "100%",
    textAlign: "left",
    fontSize: 12,
  },
  link: {
    color: colors.darkGreen,
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
    color: colors.alert,
  },
  spinnerContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Register;
