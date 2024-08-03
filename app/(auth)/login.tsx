import { FC } from "react";
import { SafeAreaView, Text, View, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validationSchemas";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { useSession } from "@/contexts/AuthContext";
import { Feather } from "@expo/vector-icons";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login: FC = () => {
  const { signIn } = useSession();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const success = await signIn(data.email, data.password);

    if (success) {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView id="login" testID="login" style={styles.login}>
      <Text style={styles.title}>Login</Text>
      <View id="login-form" style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                style={[styles.formInput, errors.email && styles.invalidInput]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.grey}
              />
              {errors.email && (
                <View style={styles.alert}>
                  <Feather
                    name="alert-triangle"
                    size={12}
                    style={styles.alertIcon}
                  />
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                </View>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
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
                value={value}
                placeholderTextColor={colors.grey}
              />
              {errors.password && (
                <View style={styles.alert}>
                  <Feather
                    name="alert-triangle"
                    size={12}
                    style={styles.alertIcon}
                  />
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                </View>
              )}
            </>
          )}
        />
      </View>
      <TextButton
        text="Login"
        onPress={handleSubmit(onSubmit)}
        textColor={colors.white}
        backgroundColor={colors.lightGreen}
      />
      <Text>
        Don't have an account?&nbsp;
        <Text style={styles.link} onPress={() => router.push("/register")}>
          Register
        </Text>
      </Text>
    </SafeAreaView>
  );
};

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
    textAlign: "left",
  },
  link: {
    color: colors.darkGreen,
  },
  alert: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    columnGap: 6,
  },
  alertIcon: {
    color: colors.alert,
  },
});

export default Login;
