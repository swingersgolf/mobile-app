import formStyles from "@/styles/FormStyles";
import { Controller } from "react-hook-form";
import { View, Text } from "react-native";
import { InFormAlert } from "./Alert";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCreateRound } from "@/contexts/CreateRoundContext"; // Import the context

const DatePicker = () => {
  const { setFormData, setValue, errors, control } = useCreateRound(); // Access the setFormData function

  const handleConfirm = (event: unknown, date?: Date) => {
    if (date) {
      const formattedDate = date.toISOString().slice(0, 10); // Format YYYY-MM-DD
      setValue("date", formattedDate, { shouldValidate: true }); // Update only the date field
      setFormData({ date: formattedDate }); // Update formData in context
    }
  };

  return (
    <View style={formStyles.inputWrapper}>
      <Controller
        control={control}
        name="date"
        render={({ field: { value } }: { field: { value: string } }) => (
          <>
            <Text
              style={[
                formStyles.formInputTitle,
                errors.date && formStyles.formInputTitleError,
              ]}
            >
              Date
            </Text>
            <View
              style={[
                formStyles.formInput,
                errors.date && formStyles.invalidInput,
              ]}
            >
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                onChange={(event, date) => handleConfirm(event, date)}
                mode="date"
                minimumDate={new Date()}
              />
            </View>
            {errors.date && <InFormAlert error={errors.date.message} />}
          </>
        )}
      />
    </View>
  );
};

export default DatePicker;
