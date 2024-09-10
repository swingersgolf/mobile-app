import * as yup from "yup";

export const profileSchema = yup.object().shape({
  handicap: yup.number().nullable().optional(),
  postalCode: yup.string().nullable().optional(),
});
