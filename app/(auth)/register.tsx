import React, { useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { colors } from "@/constants/Colors";
import * as Linking from "expo-linking";
import TextButton from "@/components/TextButton";

// Function to validate email format
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (
  email: string,
  name: string,
  password: string,
  setInvalidFields: (fields: {
    email?: boolean;
    name?: boolean;
    password?: boolean;
    emailFormat?: boolean;
  }) => void,
) => {
  const invalidFields: {
    email?: boolean;
    name?: boolean;
    password?: boolean;
    emailFormat?: boolean;
  } = {};

  if (!email) {
    invalidFields.email = true;
  } else if (!isValidEmail(email)) {
    invalidFields.emailFormat = true;
  }
  if (!name) invalidFields.name = true;
  if (!password) invalidFields.password = true;

  setInvalidFields(invalidFields);

  return Object.keys(invalidFields).length === 0;
};

const handleLinkPress = (url: string) => Linking.openURL(url);

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [invalidFields, setInvalidFields] = useState<{
    email?: boolean;
    name?: boolean;
    password?: boolean;
    emailFormat?: boolean;
  }>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleCreateAccount = async () => {
    if (!validateForm(email, name, password, setInvalidFields)) {
      setHasAttemptedSubmit(true);
      return;
    }

    try {
      const response = await axios.post("https://example.com/api/register", {
        email,
        name,
        password,
      });
      console.log(response.data);
      Alert.alert("Success", "Account created successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while creating the account");
    }
  };

  const handleChangeText = (
    field: "email" | "name" | "password",
    text: string,
  ) => {
    // Update field value
    if (field === "email") {
      setEmail(text);
      // Check email validity and update invalidFields
      if (!text) {
        setInvalidFields((prev) => ({
          ...prev,
          email: true,
          emailFormat: false,
        }));
      } else if (!isValidEmail(text)) {
        setInvalidFields((prev) => ({
          ...prev,
          emailFormat: true,
        }));
      } else {
        setInvalidFields((prev) => ({
          ...prev,
          email: false,
          emailFormat: false,
        }));
      }
    }
    if (field === "name") setName(text);
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
    <SafeAreaView
      id="create-account"
      testID="create-account"
      style={styles.createAccount}
    >
      <Text style={styles.title}>Create Account</Text>
      <View id="create-account-form" style={styles.form}>
        <TextInput
          placeholder="Name"
          autoComplete="name"
          textContentType="name"
          style={[styles.formInput, invalidFields.name && styles.invalidInput]}
          value={name}
          onChangeText={(text) => handleChangeText("name", text)}
          placeholderTextColor={colors.grey}
        />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          style={[
            styles.formInput,
            (invalidFields.email ||
              (invalidFields.emailFormat && hasAttemptedSubmit)) &&
              styles.invalidInput,
          ]}
          value={email}
          onChangeText={(text) => handleChangeText("email", text)}
          placeholderTextColor={colors.grey}
        />
        {invalidFields.emailFormat && hasAttemptedSubmit && (
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
        onPress={handleCreateAccount}
        textColor={colors.white}
        backgroundColor={colors.lightGreen}
      />
    </SafeAreaView>
  );
}

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
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginVertical: 5,
    width: "100%",
    textAlign: "center",
  },
  link: {
    color: colors.darkGreen,
  },
});
