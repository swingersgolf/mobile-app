import { FC, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/utils/validationSchemas";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { Linking } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Spinner from "@/components/Spinner";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateYYYY_MM_DD } from "@/utils/date";
import { authStyles } from "./authStyles";
import Alert from "@/components/Alert";

type RegisterFormValues = {
  email: string;
  name: string;
  password: string;
  birthdate: string;
};

const Register: FC = () => {
  const { createAccount, signIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
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
    setError(""); // Clear any previous errors
    try {
      await createAccount(data.name, data.email, data.password, data.birthdate);
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
    hideDatePicker();
  };

  const handleLinkPress = (url: string) => Linking.openURL(url);

  return (
    <View
      id="create-account"
      testID="create-account"
      style={authStyles.container}
    >
      <Text style={authStyles.title}>Create your account</Text>
      {loading ? (
        <View style={authStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View id="create-account-form" style={authStyles.form}>
            <View style={authStyles.inputWrapper}>
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
                    <TextInput
                      placeholder="Name"
                      autoComplete="name"
                      textContentType="name"
                      style={[
                        authStyles.formInput,
                        errors.name && authStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value || ""}
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.name && (
                      <View style={authStyles.errorTextContainer}>
                        <Text style={authStyles.errorText}>
                          {errors.name.message}
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
                      inputMode="email"
                      autoComplete="email"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[
                        authStyles.formInput,
                        errors.email && authStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value || ""}
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
                name="birthdate"
                render={({
                  field: { value },
                }: {
                  field: { value: string };
                }) => (
                  <>
                    <TouchableOpacity
                      onPress={showDatePicker}
                      style={[
                        authStyles.formInput,
                        errors.birthdate && authStyles.invalidInput,
                      ]}
                    >
                      <Text
                        style={{
                          color: value
                            ? colors.neutral.dark
                            : colors.neutral.medium,
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
                      <View style={authStyles.errorTextContainer}>
                        <Text style={authStyles.errorText}>
                          {errors.birthdate.message}
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
                      value={value || ""}
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
              text="Create Account"
              onPress={handleSubmit(handleCreateAccount)}
              textColor={colors.neutral.light}
              backgroundColor={colors.primary.default}
            />
            <Text style={authStyles.privacy}>
              By clicking create account you are agreeing to follow our&nbsp;
              <Text
                style={authStyles.link}
                onPress={() => handleLinkPress("https://google.com")}
              >
                privacy & terms
              </Text>
              .
            </Text>
          </View>
          <Text style={authStyles.authLink}>
            Already have an account?&nbsp;
            <Text style={authStyles.link} onPress={() => router.push("/login")}>
              Login
            </Text>
          </Text>
        </>
      )}
    </View>
  );
};

export default Register;
