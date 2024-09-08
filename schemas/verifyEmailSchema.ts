import * as yup from "yup";

export const verifyEmailSchema = yup.object().shape({
  code: yup
    .string()
    .required("6-digit verification code is required")
    .matches(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});
