import { useAuth } from "@/contexts/AuthContext";
import { RoundStyles } from "@/styles/roundStyles";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { View, Text, RefreshControl, ScrollView, Image } from "react-native";
import { RoundDetails } from "@/types/roundTypes";
import { colors } from "@/constants/Colors";
import GlobalStyles from "@/styles/GlobalStyles";
import { parseRoundDate } from "@/utils/date";
import SampleProfilePicture from "@/assets/images/sample_profile_picture.webp";
import TextButton from "@/components/TextButton";

const RoundDetailsScreen = () => {
  const { roundId } = useLocalSearchParams();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();

  const [RoundDetails, setRoundDetails] = useState<RoundDetails | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoundDetails = useCallback(async () => {
    setError("");
    try {
      const response = await axios.get(`${apiUrl}/v1/round/${roundId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoundDetails(response.data.data);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to fetch rounds. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
    }
  }, [apiUrl, roundId, token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoundDetails();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRoundDetails();
  }, [apiUrl, fetchRoundDetails, token]);

  if (error) {
    return (
      <View style={RoundStyles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  const renderRoundDate = () => {
    if (RoundDetails) {
      const { dayOfWeek, dayNumber, month, time } = parseRoundDate(
        RoundDetails.when,
      );
      return (
        <Text
          style={GlobalStyles.h2}
        >{`${dayOfWeek}, ${dayNumber} ${month}, ${time}`}</Text>
      );
    }
    return null; // Handle the case where RoundDetails is null
  };

  return (
    <View style={RoundStyles.container}>
      <ScrollView
        style={RoundStyles.scrollStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]} // Customize the spinner color
          />
        }
      >
        {RoundDetails && (
          <View style={RoundStyles.roundDetailsContainer}>
            <View>
              {renderRoundDate()}
              <Text style={GlobalStyles.h1}>{RoundDetails.course}</Text>
            </View>
            <View style={RoundStyles.memberList}>
              {Array.from({ length: RoundDetails.spots }).map((_, index) => {
                const golfer = RoundDetails.golfers[index];
                return (
                  <View key={index} style={RoundStyles.memberListItem}>
                    {golfer && index < RoundDetails.golfers.length ? (
                      <>
                        {/* { golfer.is_host && <View style={RoundStyles.hostIndicator} /> } */}
                        {/* <View style={RoundStyles.hostIndicator} /> */}
                        <Image
                          style={RoundStyles.memberProfilePicture}
                          source={SampleProfilePicture}
                        />
                        <Text style={GlobalStyles.h3}>{golfer.name}</Text>
                      </>
                    ) : (
                      <Text style={[GlobalStyles.h4]}>
                        Waiting for member to join
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
            {RoundDetails.golfers.length === RoundDetails.spots && (
              <Text style={GlobalStyles.h4}>This round is full</Text>
            )}
          </View>
        )}
      </ScrollView>
      {RoundDetails && RoundDetails.golfers.length < RoundDetails.spots && (
        <View style={RoundStyles.actionButtonContainer}>
          <TextButton
            text="Request to join"
            onPress={() => {}}
            textColor={colors.neutral.light}
            backgroundColor={colors.primary.default}
          />
        </View>
      )}
    </View>
  );
};

export default RoundDetailsScreen;
