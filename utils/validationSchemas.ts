// /mobile-app/validationSchemas.ts
import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const accountSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});
