import * as yup from "yup";

export const profileSchema = yup.object().shape({
  handicap: yup.number(),
  postalCode: yup.string(),
});
