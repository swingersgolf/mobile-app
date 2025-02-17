import * as yup from "yup";

export const profileSchema = yup.object().shape({
  handicap: yup
    .string()
    .nullable()
    .optional()
    .test(
      "is-valid-handicap",
      "Handicap must between -54.0 and +54.0",
      (value) => {
        if (!value) return true; // Allow null or optional values
        const num = parseFloat(value);
        return (
          !isNaN(num) &&
          num >= -54.0 &&
          num <= 54.0 &&
          /^\+?-?\d{1,2}(\.\d{1})?$/.test(value) // Allows whole numbers and max one decimal place
        );
      },
    ),
  postalCode: yup.string().nullable().optional(),
});

export const setProfileSchema = yup.object().shape({
  handicap: yup.number().required("Handicap is required"),
  postalCode: yup.string().required("Postal code is required"),
});

export const setPhotoSchema = yup.object().shape({
  photo: yup.string().required("Photo is required"),
});
