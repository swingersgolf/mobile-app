import NavButton from "@/components/NavButton";
import { Text, View, StyleSheet, TextInput } from "react-native";

export default function SignIn() {
  const handleCreateAccount = () => {
    // Create account logic
  };

  return (
    <View style={styles.container}>
      <View id="create-account-form">
        <TextInput placeholder="Email" keyboardType="email-address" />
        <TextInput placeholder="Name" />
        <TextInput placeholder="Password" secureTextEntry={true} />
        <TextInput placeholder="Confirm Password" secureTextEntry={true} />
      </View>
      <Text>Or create an account with</Text>
      {/* <View id="social-media-container">
        <TextInput id="google"></TextInput>
        <TextInput id="facebook"></TextInput>
        <TextInput id="apple"></TextInput>
        <TextInput id="x"></TextInput>
      </View> */}
      <Text>
        By clicking create account you are agreeing to follow our privacy policy
        and terms and conditions.
      </Text>
      <NavButton text="Create Account" onPress={handleCreateAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
