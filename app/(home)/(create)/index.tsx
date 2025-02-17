import { useState, useCallback } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import axios from "axios";
import createStyles from "@/styles/createStyles";
import Alert from "@/components/Alert";
import { useAuth } from "@/contexts/AuthContext";
import TimePicker from "@/components/TimePicker";
import SlotsPicker from "@/components/SlotsPicker";
import DatePicker from "@/components/DatePicker";
import { useCreateRound } from "@/contexts/CreateRoundContext";
import GolfCoursePicker from "@/components/GolfCoursePicker";
import { router } from "expo-router";

const CreateScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const {
    formData,
    setFormData,
    isDetailsFilled,
    control,
    errors,
    setValue,
    resetForm,
  } = useCreateRound();
  const [error, setError] = useState("");
  const [golfCourses, setGolfCourses] = useState<
    { id: number; name: string }[]
  >([]);

  const fetchGolfCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/course`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGolfCourses(response.data.data);
    } catch (error: unknown) {
      setError(
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "Failed to fetch golf courses."
          : "An unexpected error occurred. Please try again.",
      );
    }
  }, [apiUrl, token]);

  useFocusEffect(
    useCallback(() => {
      fetchGolfCourses();
      resetForm();
      return () => {
        setError("");
      };
    }, [fetchGolfCourses, resetForm]),
  );

  return (
    <View style={[createStyles.container, createStyles.scrollViewContent]}>
      <GolfCoursePicker
        golfCourses={golfCourses}
        control={control}
        errors={errors}
      />
      <DatePicker control={control} errors={errors} setValue={setValue} />
      <TimePicker control={control} errors={errors} />
      <SlotsPicker control={control} errors={errors} />
      <View>
        {error && <Alert error={error} />}
        <TextButton
          text="Continue"
          onPress={() => {
            setFormData(formData);
            router.push("/preferences");
          }}
          disabled={!isDetailsFilled()}
          textColor={colors.button.primary.text}
          backgroundColor={colors.button.primary.background}
        />
      </View>
    </View>
  );
};

export default CreateScreen;
