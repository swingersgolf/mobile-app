import { useState } from "react";
import { Text, View, StyleSheet, TextInput, SafeAreaView } from "react-native";
import { colors } from "@/constants/Colors";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { useSession } from "@/contexts/AuthContext";

// Function to validate email format
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateLoginForm = (
  email: string,
  password: string,
  setInvalidFields: (fields: {
    email?: boolean;
    password?: boolean;
    emailFormat?: boolean;
  }) => void,
) => {
  const invalidFields: {
    email?: boolean;
    password?: boolean;
    emailFormat?: boolean;
  } = {};

  if (!email) {
    invalidFields.email = true;
  } else if (!isValidEmail(email)) {
    invalidFields.emailFormat = true;
  }
  if (!password) invalidFields.password = true;

  setInvalidFields(invalidFields);

  return Object.keys(invalidFields).length === 0;
};

export default function Login() {
  const { signIn } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidFields, setInvalidFields] = useState<{
    email?: boolean;
    password?: boolean;
    emailFormat?: boolean;
  }>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleLogin = async () => {
    if (!validateLoginForm(email, password, setInvalidFields)) {
      setHasAttemptedSubmit(true);
      return;
    }

    const success = await signIn(email, password);

    if (success) {
      router.replace("/");
    }
  };

  const handleChangeText = (field: "email" | "password", text: string) => {
    // Update field value
    if (field === "email") {
      setEmail(text);
      // Clear email validation errors on input change
      setInvalidFields((prev) => ({
        ...prev,
        email: text ? false : prev.email,
        emailFormat: false,
      }));
    }
    if (field === "password") setPassword(text);

    // Remove the red outline if the field has a value
    if (field !== "email") {
      setInvalidFields((prev) => ({
        ...prev,
        [field]: text ? false : prev[field],
      }));
    }
  };

  return (
    <SafeAreaView id="login" testID="login" style={styles.login}>
      <Text style={styles.title}>Login</Text>
      <View id="login-form" style={styles.form}>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          style={[
            styles.formInput,
            hasAttemptedSubmit &&
              (invalidFields.email || invalidFields.emailFormat) &&
              styles.invalidInput,
          ]}
          value={email}
          onChangeText={(text) => handleChangeText("email", text)}
          placeholderTextColor={colors.grey}
        />
        {hasAttemptedSubmit && invalidFields.emailFormat && (
          <Text style={styles.errorText}>
            Please enter a valid email address.
          </Text>
        )}
        <TextInput
          placeholder="Password"
          autoComplete="password"
          textContentType="password"
          secureTextEntry={true}
          style={[
            styles.formInput,
            invalidFields.password && styles.invalidInput,
          ]}
          value={password}
          onChangeText={(text) => handleChangeText("password", text)}
          placeholderTextColor={colors.grey}
        />
      </View>
      <TextButton
        text="Login"
        onPress={handleLogin}
        textColor={colors.white}
        backgroundColor={colors.lightGreen}
      />
      {/* Add text link to registration screen if the user does not have an account */}
      <Text>
        Don't have an account?&nbsp;
        <Text style={styles.link} onPress={() => router.push("/register")}>
          Register
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  login: {
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
    textAlign: "center",
  },
  link: {
    color: colors.darkGreen,
  },
});
