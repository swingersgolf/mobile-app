import { View, Text, TouchableOpacity } from "react-native";
import accountStyles from "@/styles/accountStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { router, useFocusEffect } from "expo-router";
import formStyles from "@/styles/FormStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import GlobalStyles from "@/styles/GlobalStyles";
import * as yup from "yup";
import { PreferenceIcon } from "@/utils/icon";
import Alert from "@/components/Alert";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { capitalizeWords } from "@/utils/text";
import { preferenceLabelMap, Preferences } from "@/utils/preference";

const SetPreferencesScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, profile, preferences, updatePreferences } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preferencesList, setPreferencesList] = useState<
    { preference_id: string; preference_name: string }[]
  >([]);

  const fetchPreferences = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/preference`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedPreferences = response.data.data.map(
        (preference: { id: string; name: string }) => ({
          preference_id: Number(preference.id),
          preference_name: capitalizeWords(preference.name),
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

  const handleSaveChanges = async (data: {
    preferences: Record<string, string>;
  }) => {
    setLoading(true);
    setError("");

    const formattedPreferences = preferencesList.map((preference) => ({
      preference_id: Number(preference.preference_id),
      preference_name: preference.preference_name,
      status: data.preferences[preference.preference_id], // Access the status for each preference
    }));

    const preferencesData = {
      preferences: formattedPreferences,
    };

    try {
      updatePreferences(preferencesData);
      router.replace("/(home)/(round)");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to update account. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const createPostSchema = (
    preferences: { preference_id: string; preference_name: string }[],
  ) =>
    yup.object().shape({
      preferences: yup.object(
        preferences.reduce(
          (acc, pref) => {
            acc[pref.preference_id] = yup
              .string()
              .oneOf(
                ["preferred", "disliked", "indifferent"],
                `Invalid value for ${pref.preference_name}`,
              )
              .required(`${pref.preference_name} preference is required`);
            return acc;
          },
          {} as Record<string, yup.StringSchema<string>>,
        ),
      ),
    });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<Preferences>({
    resolver: yupResolver(createPostSchema(preferencesList)),
    defaultValues: {
      preferences: preferences
        ? preferences.reduce(
            (acc, pref) => {
              acc[pref.preference_id] = pref.status || "indifferent"; // Default to "indifferent" if no status is set
              return acc;
            },
            {} as Record<string, string>,
          )
        : {}, // Fallback to empty object if no preferences are available
    },
  });

  useFocusEffect(
    useCallback(() => {
      fetchPreferences();
      reset();
      setError("");
      return () => {
        reset();
        setError("");
      };
    }, [fetchPreferences, reset]),
  );

  return (
    <View style={accountStyles.container}>
      {!profile || loading ? (
        <View style={accountStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View>
            <Text style={GlobalStyles.h1}>Set your preferences</Text>
          </View>
          <View id="edit-preferences-form" style={formStyles.form}>
            <View style={(formStyles.inputWrapper, formStyles.preferencesForm)}>
              {preferencesList.map((preference) => (
                <View
                  key={preference.preference_id}
                  style={[
                    formStyles.preferenceRow,
                    errors.preferences?.[preference.preference_id]
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
                    <PreferenceIcon name={preference.preference_name} />
                    <Text style={formStyles.preferenceLabel}>
                      {preference.preference_name}
                    </Text>
                  </View>
                  <View style={formStyles.preferenceOptions}>
                    {["preferred", "disliked", "indifferent"].map((status) => (
                      <Controller
                        key={status}
                        control={control}
                        name={`preferences.${preference.preference_id}`}
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
                                value === status &&
                                  formStyles.selectedButtonText,
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
            <View style={accountStyles.buttonContainer}>
              <TextButton
                text="Complete"
                onPress={handleSubmit(handleSaveChanges)}
                textColor={isValid ? colors.neutral.light : colors.neutral.dark}
                backgroundColor={
                  isValid ? colors.primary.default : colors.neutral.medium
                }
                disabled={!isValid}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default SetPreferencesScreen;
