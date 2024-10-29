import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Key, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GlobalStyles from "@/styles/GlobalStyles";
import { RoundStyles } from "@/styles/roundStyles";
import SampleProfilePicture from "@/assets/images/sample_profile_picture.webp";
import alertStyles from "@/styles/AlertStyles";
import { Golfer } from "@/types/roundTypes";
import { useRoundCache } from "@/contexts/RoundCacheContext"; // Import the context

const Requests = () => {
  const { roundId, requests } = useLocalSearchParams();
  const parsedRequests = requests ? JSON.parse(requests as string) : [];
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const [error, setError] = useState<string>("");
  const router = useRouter(); // Initialize router for navigation

  // Access the round cache
  const { setRoundCache } = useRoundCache();

  const updateRoundCache = (
    requestId: string,
    status: "accepted" | "rejected",
  ) => {
    setRoundCache((prevCache) => {
      const updatedCache = new Map(prevCache);
      const roundDetails = updatedCache.get(roundId as string);

      if (roundDetails) {
        // Update the golfer's status based on the requestId
        const updatedGolfers = roundDetails.golfers.map((golfer) =>
          golfer.id === requestId ? { ...golfer, status } : golfer,
        );

        // Update the round details in the cache
        updatedCache.set(roundId as string, {
          ...roundDetails,
          golfers: updatedGolfers,
        });
      }

      // Check if there are no pending golfers left
      const hasPendingGolfers = updatedCache
        .get(roundId as string)
        ?.golfers.some((golfer) => golfer.status === "pending");

      // If no pending golfers, navigate to the round details screen
      if (!hasPendingGolfers) {
        console.log("All golfers have been accepted or rejected");
        router.back();
      }

      return updatedCache;
    });
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await axios.post(
        `${apiUrl}/v1/round/${roundId}/accept`,
        { user_id: requestId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update cache to update the user status to accepted
      updateRoundCache(requestId, "accepted");
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to accept request. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await axios.post(
        `${apiUrl}/v1/round/${roundId}/reject`,
        { user_id: requestId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update cache to update the user status to rejected
      updateRoundCache(requestId, "rejected");
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to reject request. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <View style={[RoundStyles.container, RoundStyles.roundRequestContainer]}>
      <Text style={GlobalStyles.h1}>Round requests</Text>
      {error ? <Text style={alertStyles.errorText}>{error}</Text> : null}
      <View style={RoundStyles.memberList}>
        {parsedRequests.map(
          (request: Golfer, index: Key | null | undefined) => (
            <View key={index} style={RoundStyles.memberListItem}>
              <View style={RoundStyles.memberListItemContent}>
                <Image
                  style={RoundStyles.memberProfilePicture}
                  source={SampleProfilePicture} // Replace with actual golfer image if available
                />
                <Text style={GlobalStyles.h3}>{request.name}</Text>
              </View>
              <View style={RoundStyles.buttonContainer}>
                <TouchableOpacity onPress={() => acceptRequest(request.id)}>
                  <MaterialIcons name="check-circle" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rejectRequest(request.id)}>
                  <MaterialIcons name="cancel" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ),
        )}
      </View>
    </View>
  );
};

export default Requests;
