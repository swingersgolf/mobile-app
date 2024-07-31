import React, { useState } from "react";
import axios from "axios";
import { Text, View, StyleSheet, TextInput, Alert } from "react-native";
import { colors } from "@/constants/Colors";
import * as Linking from "expo-linking";
import TextButton from "@/components/TextButton";
import { SafeAreaView } from "react-native-safe-area-context";

const validateForm = (email: string, name: string, password: string) => {
  if (!email || !name || !password) {
    console.log("All fields are required");
    Alert.alert("Error", "All fields are required");
    return false;
  }
  return true;
};

const handleLinkPress = (url: string) => Linking.openURL(url);

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = async () => {
    if (!validateForm(email, name, password)) return;

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
          style={styles.formInput}
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.grey}
        />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          style={styles.formInput}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={colors.grey}
        />
        <TextInput
          placeholder="Password"
          autoComplete="password"
          textContentType="password"
          secureTextEntry={true}
          style={styles.formInput}
          value={password}
          onChangeText={setPassword}
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
  link: {
    color: colors.darkGreen,
  },
});
