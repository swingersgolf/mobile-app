// /mobile-app/validationSchemas.ts
import * as yup from "yup";
import { isOver18 } from "@/utils/date";

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
  birthdate: yup
    .string()
    .required("Date of birth is required")
    .test(
      "is-valid-format",
      "Date of birth must be in YYYY-MM-DD format",
      (value) => {
        if (!value) return true; // Skip format check if birthdate is not provided
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      },
    )
    .test("is-over-18", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return isOver18(date);
    }),
});

export const accountSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});
