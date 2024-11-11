import { useState, useCallback } from "react";
import { Text, View, Keyboard, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
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
import GlobalStyles from "@/styles/GlobalStyles";
import * as yup from "yup";
import PreferenceIcon from "@/utils/icon";

type CreatePostValues = {
  golfCourse: string;
  datetime: string;
  slots: string;
  preferences: {
    [key: string]: string;
  };
};

const preferenceLabelMap: { [key: string]: string } = {
  indifferent: "Don't care",
  preferred: "Yes",
  disliked: "No",
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
  const [preferencesList, setPreferencesList] = useState<
    { id: string; label: string }[]
  >([]);
  const group_size = ["2", "3", "4"];
  const createPostSchema = (preferences: { id: string; label: string }[]) =>
    yup.object().shape({
      golfCourse: yup.string().required("Golf Course is required"),
      datetime: yup.string().required("Date and Time is required"),
      slots: yup.string().required("Number of slots is required"),
      preferences: yup.object(
        preferences.reduce(
          (acc, pref) => {
            acc[pref.id] = yup
              .string()
              .oneOf(
                ["preferred", "disliked", "indifferent"],
                `Invalid value for ${pref.label}`,
              )
              .required(`${pref.label} preference is required`);
            return acc;
          },
          {} as Record<string, yup.StringSchema<string>>,
        ),
      ),
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm<CreatePostValues>({
    resolver: yupResolver(createPostSchema(preferencesList)),
    defaultValues: {
      golfCourse: "",
      datetime: "",
      slots: "",
      preferences: {},
    },
  });

  const capitalizeWords = (text: string) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const fetchGolfCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/course`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGolfCourses(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.message || "Failed to fetch golf courses.",
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }, [apiUrl, token]);

  const fetchPreferences = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/preference`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedPreferences = response.data.data.map(
        (preference: { id: string; name: string }) => ({
          id: preference.id.toString(),
          label: capitalizeWords(preference.name),
        }),
      );
      setPreferencesList(formattedPreferences);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Failed to fetch preferences.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }, [apiUrl, token]);

  useFocusEffect(
    useCallback(() => {
      fetchGolfCourses();
      fetchPreferences();
      reset();
      setSelectedDate(undefined);
      setError("");
      return () => {
        reset();
        setSelectedDate(undefined);
        setError("");
      };
    }, [fetchGolfCourses, fetchPreferences, reset]),
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
          preferences: data.preferences,
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
            <Text style={GlobalStyles.h3}>Details</Text>
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
                      search
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
                      placeholderStyle={formStyles.placeholderStyle}
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
                      placeholderStyle={formStyles.placeholderStyle}
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
                      <Text style={formStyles.placeholderStyle}>
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

            <Text style={GlobalStyles.h3}>Preferences</Text>
            <View
              style={(formStyles.inputWrapper, RoundStyles.preferencesForm)}
            >
              {preferencesList.map((preference) => (
                <View
                  key={preference.id}
                  style={[
                    RoundStyles.preferenceRow,
                    errors.preferences?.[preference.id]
                      ? RoundStyles.preferenceRowError
                      : null,
                  ]}
                >
                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <PreferenceIcon preference={preference.label} />
                    <Text style={RoundStyles.preferenceLabel}>
                      {preference.label}
                    </Text>
                  </View>
                  <View style={RoundStyles.preferenceOptions}>
                    {["preferred", "disliked", "indifferent"].map((status) => (
                      <Controller
                        key={status}
                        control={control}
                        name={`preferences.${preference.id}`}
                        render={({ field: { onChange, value } }) => (
                          <TouchableOpacity
                            style={[
                              RoundStyles.preferenceButton,
                              value === status && RoundStyles.selectedButton,
                            ]}
                            onPress={() => onChange(status)}
                          >
                            <Text
                              style={[
                                RoundStyles.preferenceButtonText,
                                value === status &&
                                  RoundStyles.selectedButtonText,
                              ]}
                            >
                              {preferenceLabelMap[status]}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    ))}
                  </View>
                </View>
              ))}
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
