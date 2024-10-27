import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createPostSchema } from "@/schemas/createPostSchema";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import axios from "axios";
import Spinner from "@/components/Spinner";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateYYYY_MM_DD } from "@/utils/date";
import createStyles from "@/styles/createStyles";
import Alert, { InFormAlert } from "@/components/Alert";
import formStyles from "@/styles/FormStyles";
import { Dropdown } from "react-native-element-dropdown";

type CreatePostValues = {
  golfCourse: string;
  datetime: string;
  slots: 1 | 2 | 3;
};

const CreateScreen = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<1 | 2 | 3>(1);
  const [golfCourses] = useState<string[]>([
    "Golf Course A",
    "Golf Course B",
    "Golf Course C",
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<CreatePostValues>({
    resolver: yupResolver(createPostSchema),
    defaultValues: {
      golfCourse: "",
      datetime: "",
      slots: 1,
    },
  });

  const handleCreateAccount = async (data: CreatePostValues) => {
    setLoading(true);
    setError("");
    try {
      console.log(data);
      // Your API call here
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to create account. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = formatDateYYYY_MM_DD(date);
    setValue("datetime", formattedDate);
    trigger("datetime");
    hideDatePicker();
  };

  const handleSlotSelection = (slot: 1 | 2 | 3) => {
    setSelectedSlot(slot);
    setValue("slots", slot);
  };

  return (
    <View style={createStyles.container}>
      {loading ? (
        <View style={createStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View id="new-post-form" style={formStyles.form}>
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="golfCourse"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    {value && (
                      <Text
                        style={[
                          formStyles.formInputTitle,
                          errors.golfCourse && formStyles.formInputTitleError,
                        ]}
                      >
                        Golf Course
                      </Text>
                    )}
                    <Dropdown
                      style={[
                        formStyles.formInput,
                        errors.golfCourse && formStyles.invalidInput,
                      ]}
                      data={golfCourses.map((course) => ({
                        label: course,
                        value: course,
                      }))}
                      labelField="label"
                      valueField="value"
                      placeholder="Search Golf Course"
                      placeholderStyle={{ color: colors.neutral.medium }}
                      search
                      searchPlaceholder="Search Golf Course"
                      value={value}
                      onChange={(item) => {
                        onChange(item.value);
                      }}
                      onFocus={() => Keyboard.dismiss()}
                    />
                    {errors.golfCourse && (
                      <InFormAlert error={errors.golfCourse.message} />
                    )}
                  </>
                )}
              />
            </View>

            {/* Slots Section */}
            <View style={formStyles.slotSelectionContainer}>
              <Text style={formStyles.formInputTitle}>Select Slots</Text>
              {[1, 2, 3].map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    formStyles.slotButton,
                    selectedSlot === slot && formStyles.selectedSlotButton,
                  ]}
                  onPress={() => handleSlotSelection(slot as 1 | 2 | 3)}
                >
                  <Text
                    style={[
                      formStyles.slotButtonText,
                      selectedSlot === slot &&
                        formStyles.selectedSlotButtonText,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* DateTime Picker */}
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="datetime"
                render={({ field: { value } }) => (
                  <>
                    {value && (
                      <Text
                        style={[
                          formStyles.formInputTitle,
                          errors.datetime && formStyles.formInputTitleError,
                        ]}
                      >
                        Date and time of Round
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={showDatePicker}
                      style={[
                        formStyles.formInput,
                        errors.datetime && formStyles.invalidInput,
                      ]}
                    >
                      <Text
                        style={{
                          color: value
                            ? colors.neutral.dark
                            : colors.neutral.medium,
                        }}
                      >
                        {selectedDate
                          ? formatDateYYYY_MM_DD(selectedDate)
                          : "Date and time of round"}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="datetime"
                      date={selectedDate || new Date()}
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                    {errors.datetime && (
                      <InFormAlert error={errors.datetime.message} />
                    )}
                  </>
                )}
              />
            </View>

            {error && <Alert error={error} />}
            <TextButton
              text="Create Post"
              onPress={handleSubmit(handleCreateAccount)}
              textColor={colors.neutral.light}
              backgroundColor={colors.primary.default}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default CreateScreen;
