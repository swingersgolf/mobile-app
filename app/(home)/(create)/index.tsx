import { useState, useCallback } from "react";
import { Text, View, Keyboard, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import { createPostSchema } from "@/schemas/createPostSchema";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import axios from "axios";
import Spinner from "@/components/Spinner";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateDayMonthTime, formatDateYYYY_MM_DD } from "@/utils/date";
import createStyles from "@/styles/createStyles";
import Alert, { InFormAlert } from "@/components/Alert";
import formStyles from "@/styles/FormStyles";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { RoundStyles } from "@/styles/roundStyles";

type CreatePostValues = {
  golfCourse: string;
  datetime: string;
  slots: string;
};

const CreateScreen = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [golfCourses] = useState<string[]>([
    "Golf Course A",
    "Golf Course B",
    "Golf Course C",
  ]);
  const golfers = ["1", "2", "3"];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm<CreatePostValues>({
    resolver: yupResolver(createPostSchema),
    defaultValues: {
      golfCourse: "",
      datetime: "",
      slots: "",
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

  const handleClear = () => {
    reset();
    setSelectedDate(undefined);
    setError("");
  }

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
                      placeholderStyle={{
                        color: value
                          ? colors.neutral.dark
                          : colors.neutral.medium,
                        fontSize: 14,
                      }}
                      selectedTextStyle={{
                        color: colors.neutral.dark,
                        fontSize: 14,
                      }}
                      itemTextStyle={{
                        color: colors.neutral.dark,
                        fontSize: 14,
                      }}
                      value={value}
                      onChange={(item) => {
                        onChange(item.value);
                      }}
                      onFocus={() => Keyboard.dismiss()}
                      renderRightIcon={() =>
                        errors.golfCourse ? null : (
                          <MaterialIcons
                            name="arrow-drop-down"
                            size={14}
                            color={colors.neutral.medium}
                          />
                        )
                      }
                    />
                    {errors.golfCourse && (
                      <InFormAlert error={errors.golfCourse.message} />
                    )}
                  </>
                )}
              />
            </View>

            {/* Slots Dropdown */}
            <View style={formStyles.inputWrapper}>
              <Controller
                control={control}
                name="slots"
                render={({ field: { onChange, value } }) => (
                  <>
                    {value && (
                      <Text
                        style={[
                          formStyles.formInputTitle,
                          errors.slots && formStyles.formInputTitleError,
                        ]}
                      >
                        Golfers
                      </Text>
                    )}
                    <Dropdown
                      style={[
                        formStyles.formInput,
                        errors.slots && formStyles.invalidInput,
                      ]}
                      data={golfers.map((course) => ({
                        label: course,
                        value: course,
                      }))}
                      labelField="label"
                      valueField="value"
                      placeholder="Select number of golfers"
                      placeholderStyle={{
                        color: value
                          ? colors.neutral.dark
                          : colors.neutral.medium,
                        fontSize: 14,
                      }}
                      selectedTextStyle={{
                        color: colors.neutral.dark,
                        fontSize: 14,
                      }}
                      itemTextStyle={{
                        color: colors.neutral.dark,
                        fontSize: 14,
                      }}
                      value={value}
                      onChange={(item) => onChange(item.value)}
                      renderRightIcon={() =>
                        errors.slots ? null : (
                          <MaterialIcons
                            name="arrow-drop-down"
                            size={14}
                            color={colors.neutral.medium}
                          />
                        )
                      }
                    />
                    {errors.slots && (
                      <InFormAlert error={errors.slots.message} />
                    )}
                  </>
                )}
              />
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
                        Date and time
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
                          fontSize: 14,
                        }}
                      >
                        {selectedDate
                          ? formatDateDayMonthTime(selectedDate)
                          : "Date and time"}
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
            <View style={RoundStyles.textButtonContainer}>
              <TextButton
                text="Create Post"
                onPress={handleSubmit(handleCreateAccount)}
                textColor={colors.neutral.light}
                backgroundColor={colors.primary.default}
              />
              <TextButton
                text="Clear"
                onPress={handleClear}
                textColor={colors.primary.default}
                backgroundColor={colors.primary.default}
                outline
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default CreateScreen;
