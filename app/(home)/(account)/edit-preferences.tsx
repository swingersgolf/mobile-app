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
import PreferenceIcon from "@/utils/icon";
import Alert from "@/components/Alert";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { capitalizeWords } from "@/utils/text";

type EditPreferenceValues = {
  preferences: {
    [key: string]: string;
  };
};

const preferenceLabelMap: { [key: string]: string } = {
  indifferent: "Don't care",
  preferred: "Yes",
  disliked: "No",
};

const EditPreferencesScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, profile, updatePreferences } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preferencesList, setPreferencesList] = useState<
    { id: string; label: string }[]
  >([]);

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

  const handleSaveChanges = async (data) => {
    setLoading(true);
    setError("");

    // Create a new object with only the fields that have a value
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value != null,
      ),
    );

    try {
      updatePreferences(filteredData);
      if (router.canGoBack()) {
        router.back();
      }
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

  const handleCancel = () => {
    reset();
    router.back();
  };

  const createPostSchema = (preferences: { id: string; label: string }[]) =>
    yup.object().shape({
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
  } = useForm<EditPreferenceValues>({
    resolver: yupResolver(createPostSchema(preferencesList)),
    defaultValues: {
      preferences: {},
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
    <View style={(accountStyles.container, accountStyles.accountFormContainer)}>
      {!profile || loading ? (
        <View style={accountStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View>
            <Text style={GlobalStyles.h1}>Edit your preferences</Text>
          </View>
          <View id="edit-preferences-form" style={formStyles.form}>
            <View style={(formStyles.inputWrapper, formStyles.preferencesForm)}>
              {preferencesList.map((preference) => (
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
                    <PreferenceIcon preference={preference.label} />
                    <Text style={formStyles.preferenceLabel}>
                      {preference.label}
                    </Text>
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
                text={"Save changes"}
                onPress={handleSubmit(handleSaveChanges)}
                textColor={colors.neutral.light}
                backgroundColor={colors.primary.default}
              />
              <TextButton
                text={"Cancel"}
                onPress={handleCancel}
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

export default EditPreferencesScreen;
