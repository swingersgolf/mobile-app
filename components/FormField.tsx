import React, { FC } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Controller, Control } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";

interface FormFieldProps extends TextInputProps {
  name: string;
  control: Control<any>;
  error?: string;
}

const FormField: FC<FormFieldProps> = ({ name, control, error, ...rest }) => {
  return (
    <View style={styles.fieldContainer}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={[styles.input, error && styles.invalidInput]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ""}
              placeholderTextColor={colors.grey}
              {...rest}
            />
            {error && (
              <View style={styles.errorContainer}>
                <Feather
                  name="alert-triangle"
                  size={12}
                  style={styles.alertIcon}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    width: "100%",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    color: colors.black,
  },
  invalidInput: {
    borderColor: colors.alert,
  },
  errorContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  alertIcon: {
    color: colors.alert,
    marginRight: 6,
  },
  errorText: {
    color: colors.alert,
    fontSize: 12,
  },
});

export default FormField;
