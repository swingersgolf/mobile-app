import React, { FC, PropsWithChildren } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

interface FormProps {
  error?: string;
}

const Form: FC<PropsWithChildren<FormProps>> = ({ children, error }) => {
  return (
    <View style={styles.formContainer}>
      {children}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    marginTop: 20,
    width: "100%",
  },
  errorText: {
    color: colors.alert,
    textAlign: "center",
  },
});

export default Form;
