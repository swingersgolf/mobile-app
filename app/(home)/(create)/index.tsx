import { useState, useCallback } from "react";
import { Text, View, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import axios from "axios";
import Spinner from "@/components/Spinner";
import createStyles from "@/styles/createStyles";
import Alert, { InFormAlert } from "@/components/Alert";
import formStyles from "@/styles/FormStyles";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import GolfCoursePicker from "@/components/GolfCoursePicker";
import { CreatePostValues } from "@/types/roundTypes";

const CreateScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [golfCourses, setGolfCourses] = useState<
    { id: number; name: string }[]
  >([]);
  const [preferencesList, setPreferencesList] = useState<
    { id: string; label: string }[]
  >([]);
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
      setError("");
      return () => {
        reset();
        setError("");
        setPreferencesList([]);
      };
    }, [fetchGolfCourses, fetchPreferences, reset]),
  );

  const handleCreateRound = async (data: CreatePostValues) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${apiUrl}/v1/round`,
        {
          date: data.date,
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

  const handleConfirm = (event: unknown, date?: Date) => {
    if (date) {
      const formattedDate = date.toISOString().slice(0, 10); // Format YYYY-MM-DD
      setValue("date", formattedDate, { shouldValidate: true }); // Update only the date field
    }
  };

  const DatePicker = () => {
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
                  formStyles.dateTimeInput,
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

  const TimePicker = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
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
                key={`time_range_${timeRange.id}`}
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
                    key={`time_range_${timeRange.id}`}
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

  const SlotsPicker = () => {
    const slots = [
      {
        label: "2",
        id: "2",
      },
      {
        label: "3",
        id: "3",
      },
      {
        label: "4",
        id: "4",
      },
    ];

    return (
      <View style={(formStyles.inputWrapper, formStyles.preferencesForm)}>
        <View
          style={[
            formStyles.preferenceRow,
            errors.slots ? formStyles.preferenceRowError : null,
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
            <Text style={formStyles.preferenceLabel}>Slots</Text>
          </View>
          <View style={formStyles.preferenceOptions}>
            {slots.map((slot) => (
              <Controller
                control={control}
                name="slots"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={[
                      formStyles.preferenceButton,
                      value === slot.id && formStyles.selectedButton,
                    ]}
                    onPress={() => onChange(slot.id)}
                  >
                    <Text
                      style={[
                        formStyles.preferenceButtonText,
                        value === slot.id && formStyles.selectedButtonText,
                      ]}
                    >
                      {slot.label}
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

  const PreferenceSelection = (preference: { id: string; label: string }) => {
    const preferenceLabelMap: { [key: string]: string } = {
      indifferent: "Don't care",
      preferred: "Yes",
      disliked: "No",
    };

    return (
      <View style={(formStyles.inputWrapper, formStyles.preferencesForm)}>
        <View
          key={`preference_${preference.id}`}
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
                key={`preference_${preference.id}_${status}`}
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

  return loading ? (
    <View style={createStyles.spinnerContainer}>
      <Spinner />
    </View>
  ) : (
    <ScrollView
      style={createStyles.container}
      contentContainerStyle={createStyles.scrollViewContent}
    >
      <GolfCoursePicker
        golfCourses={golfCourses}
        control={control}
        errors={errors}
      />
      <DatePicker />
      <TimePicker />
      <SlotsPicker />
      {preferencesList.map((preference) => (
        <PreferenceSelection key={preference.id} {...preference} />
      ))}
      <View>
        {error && <Alert error={error} />}
        <View style={RoundStyles.textButtonContainer}>
          <TextButton
            text="Create Post"
            onPress={handleSubmit(handleCreateRound)}
            textColor={colors.button.primary.text}
            backgroundColor={colors.button.primary.background}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateScreen;
