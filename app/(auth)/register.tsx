import { FC, useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/utils/validationSchemas";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Spinner from "@/components/Spinner";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateYYYY_MM_DD } from "@/utils/date";

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
      style={styles.createAccount}
    >
      <Text style={styles.title}>Create your account</Text>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View id="create-account-form" style={styles.form}>
            <View style={styles.inputWrapper}>
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
                        styles.formInput,
                        errors.name && styles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value || ""}
                      placeholderTextColor={colors.neutral.medium}
                    />
                    {errors.name && (
                      <View style={styles.errorTextContainer}>
                        <Text style={styles.errorText}>
                          {errors.name.message}
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
                        styles.formInput,
                        errors.email && styles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value || ""}
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
                        styles.formInput,
                        errors.birthdate && styles.invalidInput,
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
                          : "Birthdate"}
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
                      <View style={styles.errorTextContainer}>
                        <Text style={styles.errorText}>
                          {errors.birthdate.message}
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
                      value={value || ""}
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
              text="Create Account"
              onPress={handleSubmit(handleCreateAccount)}
              textColor={colors.neutral.light}
              backgroundColor={colors.primary.default}
            />
            <Text style={styles.privacy}>
              By clicking create account you are agreeing to follow our&nbsp;
              <Text
                style={styles.link}
                onPress={() => handleLinkPress("https://google.com")}
              >
                privacy & terms
              </Text>
              .
            </Text>
          </View>
          <Text style={styles.login}>
            Already have an account?&nbsp;
            <Text style={styles.link} onPress={() => router.push("/login")}>
              Login
            </Text>
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  createAccount: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
  alert: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    width: "100%",
    justifyContent: "flex-start",
  },
  alertIcon: {
    color: colors.alert.error,
  },
  privacy: {
    textAlign: "left",
  },
  link: {
    color: colors.primary.light,
  },
  spinnerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  login: {
    textAlign: "center",
  },
});

export default Register;
