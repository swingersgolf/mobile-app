import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";

const Requests = () => {
  const { roundId } = useLocalSearchParams();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const [error, setError] = useState<string>("");
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/v1/round/${roundId}/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const fetchedRequests = response.data.data;
      setRequests(fetchedRequests);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to fetch requests. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await axios.post(
        `${apiUrl}/v1/round/${roundId}/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
        `${apiUrl}/v1/round/${roundId}/reject/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
    <View>
      <Text>Requests</Text>
    </View>
  );
};

export default Requests;
