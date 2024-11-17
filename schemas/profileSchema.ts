import * as yup from "yup";

export const profileSchema = yup.object().shape({
  handicap: yup.number().nullable().optional(),
  postalCode: yup.string().nullable().optional(),
});

export const setProfileSchema = yup.object().shape({
  handicap: yup.number().required("Handicap is required"),
  postalCode: yup.string().required("Postal code is required"),
});
