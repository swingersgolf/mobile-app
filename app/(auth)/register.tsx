import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  Linking,
} from "react-native";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const data = {
      email,
      name,
      password,
    };

    try {
      console.log("Creating account...");
      console.log(data);
      const response = await axios.post(
        "https://example.com/api/register",
        data,
      );
      Alert.alert("Success", "Account created successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while creating the account");
    }
  };

  const handleOpenPrivacyTerms = () => {
    Linking.openURL("https://google.com");
  };

  return (
    <View id="create-account" style={styles.createAccount}>
      <Text>Create Account</Text>
      <View id="social-media-container" style={styles.socialMediaContainer}>
        <Text>Twitter</Text>
        <Text>Facebook</Text>
        <Text>Google</Text>
      </View>
      <Text>Or create an account with</Text>
      <View id="create-account-form" style={styles.form}>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.formInput}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Name"
          style={styles.formInput}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          style={styles.formInput}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={true}
          style={styles.formInput}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <Text>
        By clicking create account you are agreeing to follow our
        <Text style={styles.link} onPress={handleOpenPrivacyTerms}>
          {" "}
          privacy & terms
        </Text>
        .
      </Text>
      <Button title="Create Account" onPress={handleCreateAccount} />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  createAccount: {
    padding: 20,
  },
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formInput: {
    width: "100%",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
