import formStyles from "@/styles/FormStyles";
import { Controller } from "react-hook-form";
import { View, TouchableOpacity, Text } from "react-native";
import { Control, FieldErrors } from "react-hook-form";
import { useCreateRound } from "@/contexts/CreateRoundContext"; // Import the context

interface SlotsPickerProps {
  control: Control<{ slots: string }>;
  errors: FieldErrors;
}

const SlotsPicker = ({ control, errors }: SlotsPickerProps) => {
  const { setFormData } = useCreateRound(); // Access the setFormData function
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
              key={`slots-${slot.id}`}
              control={control}
              name="slots"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={[
                    formStyles.preferenceButton,
                    value === slot.id && formStyles.selectedButton,
                  ]}
                  onPress={() => {
                    onChange(slot.id); // Update slots value in react-hook-form
                    setFormData({ slots: slot.id }); // Update formData in context
                  }}
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

export default SlotsPicker;
