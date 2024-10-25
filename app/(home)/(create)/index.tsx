import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
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
import authStyles from "@/styles/authStyles";
import Alert, { InFormAlert } from "@/components/Alert";
import formStyles from "@/styles/FormStyles";

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
  const [selectedSlot, setSelectedSlot] = useState<1 | 2 | 3>(1); // Initialize slot state
  const [golfCourses] = useState<string[]>([
    "Golf Course A",
    "Golf Course B",
    "Golf Course C",
  ]);
  const [filteredCourses, setFilteredCourses] = useState<string[]>(golfCourses);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleCourseSearch = (text: string) => {
    setValue("golfCourse", text);
    setFilteredCourses(
      golfCourses.filter((course) =>
        course.toLowerCase().includes(text.toLowerCase()),
      ),
    );
    setShowDropdown(text.length > 0);
  };

  const handleSlotSelection = (slot: 1 | 2 | 3) => {
    setSelectedSlot(slot);
    setValue("slots", slot);
  };

  return (
    <View style={authStyles.container}>
      {loading ? (
        <View style={authStyles.spinnerContainer}>
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
                    <TextInput
                      placeholder="Search Golf Course"
                      style={[
                        formStyles.formInput,
                        errors.golfCourse && formStyles.invalidInput,
                      ]}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        handleCourseSearch(text);
                      }}
                      value={value || ""}
                      placeholderTextColor={colors.neutral.medium}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && (
                      <FlatList
                        data={filteredCourses}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => {
                              onChange(item);
                              setShowDropdown(false);
                            }}
                            style={formStyles.dropdownItem}
                          >
                            <Text>{item}</Text>
                          </TouchableOpacity>
                        )}
                        style={formStyles.dropdown}
                      />
                    )}
                    {errors.golfCourse && (
                      <InFormAlert error={errors.golfCourse.message} />
                    )}
                  </>
                )}
              />
            </View>

            {/* Slots Section */}
            <Text style={formStyles.formInputTitle}>Select Slots</Text>
            <View style={formStyles.slotSelectionContainer}>
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
                      selectedSlot === slot && formStyles.selectedSlotButtonText,
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
                        Datetime of Round
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
                          : "Datetime of Round"}
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
              text="Create Account"
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
