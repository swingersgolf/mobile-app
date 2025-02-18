import formStyles from "@/styles/FormStyles";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { InFormAlert } from "./Alert";
import { useCreateRound } from "@/contexts/CreateRoundContext"; // Import the context
import GlobalStyles from "@/styles/GlobalStyles";

interface GolfCoursePickerProps {
  golfCourses: { id: number; name: string }[];
}

const GolfCoursePicker = ({ golfCourses }: GolfCoursePickerProps) => {
  const { setFormData, control, errors } = useCreateRound(); // Access the setFormData function
  const [searchQuery, setSearchQuery] = useState(""); // Start with no query
  const [filteredGolfCourses, setFilteredGolfCourses] = useState(
    golfCourses, // Start with the full list
  );
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

  const handleSelectCourse = (courseId: number, courseName: string) => {
    handleSearch(courseName);
    setFormData({ golfCourse: courseId.toString() }); // Update formData in context
    setIsTextInputFocused(false); // Close the dropdown
    Keyboard.dismiss(); // Close the keyboard
  };

  const handleFocus = () => {
    setIsTextInputFocused(true);
  };

  return (
    <View style={[formStyles.inputWrapper]}>
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
              onFocus={handleFocus}
            />

            {isTextInputFocused && filteredGolfCourses.length > 0 && (
              <FlatList
                data={filteredGolfCourses}
                keyExtractor={(item) => `Course-${item.id}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onChange(item.id); // Update golfCourse value in react-hook-form
                      handleSelectCourse(item.id, item.name); // Set the selected course name
                    }}
                    style={formStyles.flatListItem}
                  >
                    <Text style={GlobalStyles.body}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                style={formStyles.flatList}
              />
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

export default GolfCoursePicker;
