import { colors } from "@/constants/Colors";
import { timeRanges } from "@/data/timeRanges";
import formStyles from "@/styles/FormStyles";
import GlobalStyles from "@/styles/GlobalStyles";
import { TimeRangeIcon } from "@/utils/icon";
import { getTimeRange } from "@/utils/timeRange";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { View, TouchableOpacity, Modal, Text } from "react-native";
import { FieldErrors } from "react-hook-form";
import { useCreateRound } from "@/contexts/CreateRoundContext"; // Import the context

interface TimePickerProps {
  control: Control<{ time_range: string }>;
  errors: FieldErrors;
}

const TimePicker = ({ control, errors }: TimePickerProps) => {
  const { setFormData } = useCreateRound(); // Access the setFormData function
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
                  onPress={() => {
                    onChange(timeRange.id); // Update time_range value in react-hook-form
                    setFormData({
                      time_range: timeRange.id as
                        | "early_bird"
                        | "morning"
                        | "afternoon"
                        | "twilight",
                    }); // Update formData in context
                  }}
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
            <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {timeRanges.map((timeRange) => (
                <View
                  key={`info_time_range_${timeRange.id}`}
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

export default TimePicker;
