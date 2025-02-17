import formStyles from "@/styles/FormStyles";
import { Picker } from "@react-native-picker/picker";
import { useState, memo, useEffect } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View, TextInput, Text } from "react-native";
import { InFormAlert } from "./Alert";
import { useCreateRound } from "@/contexts/CreateRoundContext"; // Import the context

interface GolfCoursePickerProps {
  golfCourses: { id: number; name: string }[];
  control: Control<{ golfCourse: number }>;
  errors: FieldErrors;
}

const GolfCoursePicker = ({
  golfCourses,
  control,
  errors,
}: GolfCoursePickerProps) => {
  const { setFormData } = useCreateRound(); // Access the setFormData function
  const [searchQuery, setSearchQuery] = useState(""); // Start with no query
  const [filteredGolfCourses, setFilteredGolfCourses] = useState(
    golfCourses, // Start with the full list
  );
  const [isPickerFocused, setIsPickerFocused] = useState(false);
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();

    if (!lowerQuery.trim()) {
      setFilteredGolfCourses(golfCourses); // Reset to full list if query is empty
    } else {
      setFilteredGolfCourses(
        golfCourses.filter((course) =>
          course.name.toLowerCase().includes(lowerQuery),
        ),
      );
    }
  };

  useEffect(() => {
    setFilteredGolfCourses(golfCourses); // Reset filtered list
    setSearchQuery(""); // Reset search query
  }, [golfCourses]);

  const shouldPickerOpen = isPickerFocused || isTextInputFocused;

  return (
    <View style={[formStyles.inputWrapper, formStyles.pickerContainer]}>
      <Controller
        control={control}
        name="golfCourse"
        render={({ field: { onChange, value } }) => (
          <>
            <Text
              style={[
                formStyles.formInputTitle,
                errors.golfCourse && formStyles.formInputTitleError,
              ]}
            >
              Golf Course
            </Text>
            <TextInput
              style={[
                formStyles.formInput,
                errors.golfCourse && formStyles.invalidInput,
              ]}
              placeholder="Search Golf Course"
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setIsTextInputFocused(true)}
            />
            {shouldPickerOpen && (
              <Picker
                itemStyle={formStyles.pickerItem}
                style={[
                  formStyles.picker,
                  errors.golfCourse && formStyles.invalidInput,
                ]}
                selectedValue={value}
                onValueChange={(itemValue) => {
                  onChange(itemValue); // Update golfCourse value in react-hook-form

                  const selectedCourse = golfCourses.find(
                    (course) => course.id === Number(itemValue),
                  );
                  if (selectedCourse) {
                    setSearchQuery(selectedCourse.name); // Update search query to match selected course
                    setFormData({ golfCourse: itemValue }); // Update formData in context
                  }
                  setIsPickerFocused(false);
                  setIsTextInputFocused(false);
                }}
                onFocus={() => setIsPickerFocused(true)}
                onBlur={() => setIsPickerFocused(false)}
              >
                {filteredGolfCourses.map((course) => (
                  <Picker.Item
                    key={`Course-${course.id}`}
                    label={course.name}
                    value={course.id}
                  />
                ))}
              </Picker>
            )}

            {errors.golfCourse && (
              <InFormAlert error={errors.golfCourse.message?.toString()} />
            )}
          </>
        )}
      />
    </View>
  );
};

export default memo(GolfCoursePicker);
