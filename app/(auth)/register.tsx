import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateYYYY_MM_DD } from "@/utils/date";
import authStyles from "@/styles/authStyles";
import Alert, { InFormAlert } from "@/components/Alert";
import formStyles from "@/styles/FormStyles";
import GlobalStyles from "@/styles/GlobalStyles";

type RegisterFormValues = {
  email: string;
  name: string;
  password: string;
  birthdate: string;
};

const RegisterScreen = () => {
  const { createAccount } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
      name: "",
      email: "",
      password: "",
      birthdate: "",
    },
  });

  const handleCreateAccount = async (data: RegisterFormValues) => {
    setLoading(true);
    setError("");
    try {
      await createAccount(data.name, data.email, data.password, data.birthdate);
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

  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = formatDateYYYY_MM_DD(date);
    setValue("birthdate", formattedDate);
    trigger("birthdate"); // Re-validate the birthdate field
    hideDatePicker();
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
                name="name"
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
                          errors.name && formStyles.formInputTitleError,
                        ]}
                      >
                        Name
                      </Text>
                    )}
                    <TextInput
                      placeholder="Name"
                      autoComplete="name"
                      textContentType="name"
                      style={[
                        formStyles.formInput,
                        errors.name && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value || ""}
                      placeholderTextColor={colors.neutral.dark}
                    />
                    {errors.name && <InFormAlert error={errors.name.message} />}
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
                    {value && (
                      <Text
                        style={[
                          formStyles.formInputTitle,
                          errors.birthdate && formStyles.formInputTitleError,
                        ]}
                      >
                        Date of birth
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={showDatePicker}
                      style={[
                        formStyles.formInput,
                        errors.birthdate && formStyles.invalidInput,
                      ]}
                    >
                      <Text
                        style={{
                          color: colors.neutral.dark,
                        }}
                      >
                        {selectedDate
                          ? formatDateYYYY_MM_DD(selectedDate)
                          : "Date of birth"}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      date={selectedDate || new Date()}
                      onConfirm={(date) => handleConfirm(date)}
                      onCancel={hideDatePicker}
                    />
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
                onPress={() => handleLinkPress("https://google.com")}
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
