import { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/schemas/registerSchema";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { Linking } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Spinner from "@/components/Spinner";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDateYYYY_MM_DD } from "@/utils/date";
import authStyles from "@/styles/authStyles";
import Alert, { InFormAlert } from "@/components/Alert";
import formStyles from "@/styles/FormStyles";
import GlobalStyles from "@/styles/GlobalStyles";

type RegisterFormValues = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  birthdate: string;
};

const RegisterScreen = () => {
  const { createAccount } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      birthdate: "",
    },
  });

  const handleCreateAccount = async (data: RegisterFormValues) => {
    setLoading(true);
    setError("");
    try {
      await createAccount(
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.birthdate,
      );
      router.replace({
        pathname: "/verify",
        params: { email: data.email, password: data.password },
      });
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

  const handleConfirm = (event: unknown, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = formatDateYYYY_MM_DD(date);
      setValue("birthdate", formattedDate);
      trigger("birthdate"); // Re-validate the birthdate field
    }
  };

  const handleLinkPress = (url: string) => Linking.openURL(url);

  return (
    <View
      id="create-account"
      testID="create-account"
      style={authStyles.container}
    >
      {loading ? (
        <View style={authStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <Text style={GlobalStyles.h1}>Create your account</Text>
          <View id="create-account-form" style={formStyles.form}>
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="firstname"
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
                          errors.firstname && formStyles.formInputTitleError,
                        ]}
                      >
                        First Name
                      </Text>
                    )}
                    <TextInput
                      placeholder="First Name"
                      autoComplete="name-given"
                      textContentType="givenName"
                      style={[
                        formStyles.formInput,
                        errors.firstname && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value || ""}
                      placeholderTextColor={colors.neutral.dark}
                    />
                    {errors.firstname && (
                      <InFormAlert error={errors.firstname.message} />
                    )}
                  </>
                )}
              />
            </View>
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="lastname"
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
                          errors.lastname && formStyles.formInputTitleError,
                        ]}
                      >
                        Last Name
                      </Text>
                    )}
                    <TextInput
                      placeholder="Last Name"
                      autoComplete="name-family"
                      textContentType="familyName"
                      style={[
                        formStyles.formInput,
                        errors.lastname && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value || ""}
                      placeholderTextColor={colors.neutral.dark}
                    />
                    {errors.lastname && (
                      <InFormAlert error={errors.lastname.message} />
                    )}
                  </>
                )}
              />
            </View>
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
                      inputMode="email"
                      autoComplete="email"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[
                        formStyles.formInput,
                        errors.email && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value || ""}
                      placeholderTextColor={colors.neutral.dark}
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
                name="birthdate"
                render={({
                  field: { value },
                }: {
                  field: { value: string };
                }) => (
                  <>
                    <Text
                      style={[
                        formStyles.formInputTitle,
                        errors.birthdate && formStyles.formInputTitleError,
                      ]}
                    >
                      Date of Birth
                    </Text>
                    <View
                      style={[
                        formStyles.formInput,
                        errors.birthdate && formStyles.invalidInput,
                      ]}
                    >
                      <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        onChange={handleConfirm}
                      />
                    </View>
                    {errors.birthdate && (
                      <InFormAlert error={errors.birthdate.message} />
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
                      value={value || ""}
                      placeholderTextColor={colors.neutral.dark}
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
              text="Create Account"
              onPress={handleSubmit(handleCreateAccount)}
              textColor={colors.button.primary.text}
              backgroundColor={colors.button.primary.background}
            />
            <Text style={GlobalStyles.body}>
              By clicking create account you are agreeing to follow our&nbsp;
              <Text
                style={GlobalStyles.link}
                onPress={() =>
                  handleLinkPress("https://swingersgolfapp.com/privacy")
                }
              >
                privacy & terms
              </Text>
              .
            </Text>
          </View>
          <Text style={[GlobalStyles.body, { textAlign: "center" }]}>
            Already have an account?&nbsp;
            <Text
              style={GlobalStyles.link}
              onPress={() => router.push("/login")}
            >
              Login
            </Text>
          </Text>
        </>
      )}
    </View>
  );
};

export default RegisterScreen;
