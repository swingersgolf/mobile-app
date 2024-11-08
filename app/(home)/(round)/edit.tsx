import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import { Key, useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GlobalStyles from "@/styles/GlobalStyles";
import { RoundStyles } from "@/styles/roundStyles";
import SampleProfilePicture from "@/assets/images/sample_profile_picture.webp";
import alertStyles from "@/styles/AlertStyles";
import { Golfer } from "@/types/roundTypes";
import TextButton from "@/components/TextButton";
import { useRouter } from "expo-router";

const EditRoundScreen = () => {
  const { roundId, golfers } = useLocalSearchParams();
  const parsedgolfers = golfers ? JSON.parse(golfers as string) : [];
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const [error, setError] = useState<string>("");

  const router = useRouter(); // Initialize the router

  const deleteRound = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this round?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${apiUrl}/v1/round/${roundId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              router.replace("/"); // Navigate to home screen after deletion
            } catch (error: unknown) {
              if (isAxiosError(error) && error.response) {
                const errorMessage =
                  error.response.data.message ||
                  "Failed to delete round. Please try again.";
                setError(errorMessage);
              } else {
                setError("An unexpected error occurred. Please try again.");
              }
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const removeGolfer = async (golferId: string) => {
    try {
      await axios.post(
        `${apiUrl}/v1/round/${roundId}/reject`,
        { user_id: golferId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to reject golfer. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  console.log(parsedgolfers, golfers);

  return (
    <View style={[RoundStyles.container, RoundStyles.roundEditContainer]}>
      {parsedgolfers.length > 0 && (
        <>
          <Text style={GlobalStyles.h1}>Golfers</Text>
          {error ? <Text style={alertStyles.errorText}>{error}</Text> : null}
          <View style={RoundStyles.memberList}>
            {parsedgolfers.map(
              (golfer: Golfer, index: Key | null | undefined) => (
                <View key={index} style={RoundStyles.memberListItem}>
                  <View style={RoundStyles.memberListItemContent}>
                    <Image
                      style={RoundStyles.memberProfilePicture}
                      source={SampleProfilePicture} // Replace with actual golfer image if available
                    />
                    <Text style={GlobalStyles.h3}>{golfer.name}</Text>
                  </View>
                  <View style={RoundStyles.buttonContainer}>
                    <TouchableOpacity onPress={() => removeGolfer(golfer.id)}>
                      <MaterialIcons name="cancel" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ),
            )}
          </View>
        </>
      )}
      <TextButton
        text="Delete Round"
        onPress={deleteRound}
        textColor="red"
        backgroundColor="red"
        outline
      />
    </View>
  );
};

export default EditRoundScreen;
