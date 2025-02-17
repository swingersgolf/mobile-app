import { useState, useCallback } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import createStyles from "@/styles/createStyles";
import Alert from "@/components/Alert";
import formStyles from "@/styles/FormStyles";
import { PreferenceIcon } from "@/utils/icon";
import { useCreateRound } from "@/contexts/CreateRoundContext";

const CreatePreferencesScreen = () => {
  const [error, setError] = useState("");

  const {
    formData,
    setFormData,
    createRound,
    control,
    errors,
    preferencesList,
    isPreferencesFilled,
    fetchPreferences,
  } = useCreateRound();

  useFocusEffect(
    useCallback(() => {
      fetchPreferences();
      setError("");
      return () => {
        setError("");
      };
    }, [fetchPreferences]),
  );

  const PreferenceSelection = (preference: { id: string; label: string }) => {
    const preferenceLabelMap: { [key: string]: string } = {
      indifferent: "Don't care",
      preferred: "Yes",
      disliked: "No",
    };

    return (
      <View style={(formStyles.inputWrapper, formStyles.preferencesForm)}>
        <View
          key={`preference_${preference.label}`}
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
                    onPress={() => {
                      onChange(status);
                      setFormData({
                        preferences: {
                          ...formData.preferences,
                          [preference.id]: status as
                            | "preferred"
                            | "disliked"
                            | "indifferent",
                        },
                      });
                    }}
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

  return (
    <View style={[createStyles.container, createStyles.scrollViewContent]}>
      {preferencesList.map((preference) => (
        <PreferenceSelection key={preference.id} {...preference} />
      ))}
      <View>
        {error && <Alert error={error} />}
        <TextButton
          text="Create Post"
          disabled={!isPreferencesFilled()}
          onPress={() => {
            createRound();
          }}
          textColor={colors.button.primary.text}
          backgroundColor={colors.button.primary.background}
        />
      </View>
    </View>
  );
};

export default CreatePreferencesScreen;
