import { useState, useCallback } from "react";
import {
  Text,
  View,
  Keyboard,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { MaterialIcons } from "@expo/vector-icons";
import { RoundStyles } from "@/styles/roundStyles";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import * as yup from "yup";
import { PreferenceIcon, TimeRangeIcon } from "@/utils/icon";
import GlobalStyles from "@/styles/GlobalStyles";
import { getTimeRange } from "@/utils/timeRange";
import { timeRanges } from "@/data/timeRanges";
import { capitalizeWords } from "@/utils/text";

type CreatePostValues = {
  golfCourse: string;
  date: string;
  time_range: "early_bird" | "morning" | "afternoon" | "twilight";
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
      date: yup.string().required("Date is required"),
      time_range: yup
        .string()
        .oneOf(
          ["early_bird", "morning", "afternoon", "twilight"],
          "Invalid time range selected",
        )
        .required("Time range is required"),
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
      date: "",
      time_range: undefined,
      slots: "",
      preferences: {},
    },
  });

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
        setPreferencesList([]);
      };
    }, [fetchGolfCourses, fetchPreferences, reset]),
  );

  const handleCreateRound = async (data: CreatePostValues) => {
    setLoading(true);
    setError("");
    console.log(data);
    try {
      const response = await axios.post(
        `${apiUrl}/v1/round`,
        {
          date: selectedDate,
          time_range: data.time_range,
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
      router.replace({
        pathname: "/(home)/(round)/details",
        params: { roundId: response.data.data.id },
      });
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
    const formattedDate = date.toISOString().slice(0, 10); // Slices the string to get the date part YYYY-MM-DD
    setSelectedDate(date);
    setValue("date", formattedDate);
    trigger("date");
    hideDatePicker();
  };

  const renderGolfCourseDropdown = () => {
    return (
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
    );
  };

  const renderSlotsDropdown = () => {
    return (
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
              {errors.slots && <InFormAlert error={errors.slots.message} />}
            </>
          )}
        />
      </View>
    );
  };

  const renderDatePicker = () => {
    return (
      <View style={formStyles.inputWrapper}>
        <Controller
          control={control}
          name="date"
          render={({ field: { value } }) => (
            <>
              {value && (
                <Text
                  style={[
                    formStyles.formInputTitle,
                    errors.date && formStyles.formInputTitleError,
                  ]}
                >
                  Date
                </Text>
              )}
              <TouchableOpacity
                onPress={showDatePicker}
                style={[
                  formStyles.formInput,
                  errors.date && formStyles.invalidInput,
                ]}
              >
                <Text style={formStyles.placeholderStyle}>
                  {selectedDate ? formatDateYYYY_MM_DD(selectedDate) : "Date"}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={selectedDate || new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              {errors.date && <InFormAlert error={errors.date.message} />}
            </>
          )}
        />
      </View>
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderTimePicker = () => {
    // Function to close the modal
    const closeModal = () => setIsModalVisible(false);

    return (
      <View style={(formStyles.inputWrapper, formStyles.preferencesForm)}>
        <View
          style={[
            formStyles.preferenceRow,
            errors.time_range ? formStyles.preferenceRowError : null,
          ]}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 5,
              alignItems: "center",
            }}
          >
            <Text style={formStyles.preferenceLabel}>Time</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <MaterialIcons
                name="info-outline"
                size={16}
                color={colors.neutral.dark}
              />
            </TouchableOpacity>
          </View>
          <View style={formStyles.preferenceOptions}>
            {timeRanges.map((timeRange) => (
              <Controller
                key={timeRange.id}
                control={control}
                name="time_range"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={[
                      formStyles.preferenceButton,
                      value === timeRange.id && formStyles.selectedButton,
                    ]}
                    onPress={() => onChange(timeRange.id)}
                  >
                    <Text
                      style={[
                        formStyles.preferenceButtonText,
                        value === timeRange.id && formStyles.selectedButtonText,
                      ]}
                    >
                      <TimeRangeIcon name={timeRange.id} size={16} />
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ))}
          </View>
        </View>

        {/* Info Modal */}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            activeOpacity={1}
            onPress={closeModal}
          >
            <View
              onStartShouldSetResponder={() => true}
              style={{
                backgroundColor: colors.neutral.light,
                padding: 20,
                borderRadius: 5,
                width: "80%",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={GlobalStyles.h2}>Time Ranges</Text>
                <TouchableOpacity onPress={closeModal}>
                  <MaterialIcons
                    name="close"
                    size={20}
                    color={colors.neutral.dark}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {timeRanges.map((timeRange) => (
                  <View
                    key={timeRange.id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 5,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <TimeRangeIcon name={timeRange.id} size={16} />
                      <Text style={GlobalStyles.body}>{timeRange.label}</Text>
                    </View>
                    <Text style={GlobalStyles.body}>
                      {getTimeRange(timeRange.id)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const renderPreference = (preference: { id: string; label: string }) => {
    return (
      <View style={(formStyles.inputWrapper, formStyles.preferencesForm)}>
        <View
          key={preference.id}
          style={[
            formStyles.preferenceRow,
            errors.preferences?.[preference.id]
              ? formStyles.preferenceRowError
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
            <PreferenceIcon name={preference.label} />
            <Text style={formStyles.preferenceLabel}>{preference.label}</Text>
          </View>
          <View style={formStyles.preferenceOptions}>
            {["preferred", "disliked", "indifferent"].map((status) => (
              <Controller
                key={status}
                control={control}
                name={`preferences.${preference.id}`}
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={[
                      formStyles.preferenceButton,
                      value === status && formStyles.selectedButton,
                    ]}
                    onPress={() => onChange(status)}
                  >
                    <Text
                      style={[
                        formStyles.preferenceButtonText,
                        value === status && formStyles.selectedButtonText,
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
      </View>
    );
  };

  const formData = [
    { key: "golfCourse", component: renderGolfCourseDropdown },
    { key: "slots", component: renderSlotsDropdown },
    { key: "date", component: renderDatePicker },
    { key: "time", component: renderTimePicker },
    ...preferencesList.map((pref) => ({
      key: `preferences.${pref.id}`,
      component: () => renderPreference(pref),
    })),
  ];

  const renderItem = ({ item }: { item: (typeof formData)[0] }) => (
    <View style={formStyles.inputWrapper}>{item.component()}</View>
  );

  return loading ? (
    <View style={createStyles.spinnerContainer}>
      <Spinner />
    </View>
  ) : (
    <FlatList
      data={formData}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      contentContainerStyle={createStyles.container}
      ListFooterComponent={() => (
        <View>
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
      )}
    />
  );
};

export default CreateScreen;
