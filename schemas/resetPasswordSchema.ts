import * as yup from "yup";

export const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  code: yup
    .string()
    .required("6-digit verification code is required")
    .matches(/^\d{6}$/, "Verification code must be exactly 6 digits"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});
