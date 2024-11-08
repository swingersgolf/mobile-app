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
import { formatDateDayMonthTime } from "@/utils/date";
import createStyles from "@/styles/createStyles";
import Alert, { InFormAlert } from "@/components/Alert";
import formStyles from "@/styles/FormStyles";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { RoundStyles } from "@/styles/roundStyles";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

type CreatePostValues = {
  golfCourse: string;
  datetime: string;
  slots: string;
};

const CreateScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [golfCourses, setGolfCourses] = useState<
    { id: string; name: string }[]
  >([]);
  const group_size = ["2", "3", "4"];

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

  const fetchGolfCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/course`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGolfCourses(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch golf courses.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }, [apiUrl, token]);

  useFocusEffect(
    useCallback(() => {
      fetchGolfCourses();
      reset();
      setSelectedDate(undefined);
      setError("");
    }, [fetchGolfCourses, reset]),
  );

  const handleCreateRound = async (data: CreatePostValues) => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${apiUrl}/v1/round`,
        {
          when: selectedDate,
          group_size: data.slots,
          course_id: data.golfCourse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      router.replace("/(round)");
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
    setValue("datetime", date.toISOString());
    trigger("datetime");
    hideDatePicker();
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
                        label: course.name, // Set label to the course name
                        value: course.id, // Set value to the course id
                      }))}
                      labelField="label"
                      valueField="value"
                      placeholder="Golf Course"
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
                        onChange(item.value); // Now this will be the course id
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
                        Group Size
                      </Text>
                    )}
                    <Dropdown
                      style={[
                        formStyles.formInput,
                        errors.slots && formStyles.invalidInput,
                      ]}
                      data={group_size.map((course) => ({
                        label: course,
                        value: course,
                      }))}
                      labelField="label"
                      valueField="value"
                      placeholder="Group size"
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
                onPress={handleSubmit(handleCreateRound)}
                textColor={colors.neutral.light}
                backgroundColor={colors.primary.default}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default CreateScreen;
