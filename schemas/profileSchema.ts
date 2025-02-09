import * as yup from "yup";

export const profileSchema = yup.object().shape({
  handicap: yup
    .number()
    .nullable()
    .optional()
    .min(-54.0, "Handicap must be at least -54.0")
    .max(54.0, "Handicap must be at most 54.0"),
  postalCode: yup.string().nullable().optional(),
});

export const setProfileSchema = yup.object().shape({
  handicap: yup.number().required("Handicap is required"),
  postalCode: yup.string().required("Postal code is required"),
});

export const setPhotoSchema = yup.object().shape({
  photo: yup.string().required("Photo is required"),
});
