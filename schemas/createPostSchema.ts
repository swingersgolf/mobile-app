import * as yup from "yup";

export const createPostSchema = yup.object().shape({
  golfCourse: yup.string().required("Golf Course is required"),
  datetime: yup.string().required("Date and Time is required"),
  slots: yup.mixed<1 | 2 | 3>().oneOf([1, 2, 3]).required("Slots are required"),
});
