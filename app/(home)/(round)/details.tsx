import { useAuth } from "@/contexts/AuthContext";
import { RoundStyles } from "@/styles/roundStyles";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { View, Text, RefreshControl, ScrollView, Image } from "react-native";
import { Attribute, RoundDetails } from "@/types/roundTypes";
import { colors } from "@/constants/Colors";
import GlobalStyles from "@/styles/GlobalStyles";
import { parseRoundDate } from "@/utils/date";
import SampleProfilePicture from "@/assets/images/sample_profile_picture.webp";
import TextButton from "@/components/TextButton";
import { useRoundCache } from "@/contexts/RoundCacheContext"; // Import the context

const RoundDetailsScreen: React.FC = () => {
  const { roundId } = useLocalSearchParams();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();

  const { roundCache, setRoundCache } = useRoundCache();

  const [roundDetails, setRoundDetails] = useState<RoundDetails | null>(null);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchRoundDetails = useCallback(async () => {
    setError("");

    // Check if the details are already in cache
    if (roundCache.has(roundId as string)) {
      setRoundDetails(roundCache.get(roundId as string)!);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/v1/round/${roundId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedRoundDetails = response.data.data;

      setRoundDetails(fetchedRoundDetails);
      setRoundCache((prevCache) =>
        new Map(prevCache).set(roundId as string, fetchedRoundDetails),
      ); // Update the cache
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to fetch rounds. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }, [apiUrl, roundId, token, roundCache, setRoundCache]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoundDetails();
    setRoundCache((prevCache) => {
      const updatedCache = new Map(prevCache);
      updatedCache.delete(roundId as string); // Remove the specific round details from cache
      return updatedCache;
    });
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRoundDetails();
  }, [fetchRoundDetails]);

  if (error) {
    return (
      <View style={RoundStyles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  const renderRoundDate = () => {
    if (roundDetails) {
      const { dayOfWeek, dayNumber, month, time } = parseRoundDate(
        roundDetails.when,
      );
      return (
        <Text
          style={GlobalStyles.h2}
        >{`${dayOfWeek}, ${dayNumber} ${month}, ${time}`}</Text>
      );
    }
    return null;
  };

  const statusStyles: { [key in Attribute["status"]]: unknown } = {
    preferred: RoundStyles.preferredAttribute,
    disliked: RoundStyles.dislikedAttribute,
    indifferent: RoundStyles.indifferentAttribute,
  };

  const statusOrder: { [key in Attribute["status"]]: number } = {
    preferred: 1,
    indifferent: 2,
    disliked: 3,
  };

  const sortedPreferences = roundDetails?.preferences.sort((a, b) => {
    return statusOrder[a.status] - statusOrder[b.status];
  });

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
        {roundDetails && (
          <View style={RoundStyles.roundDetailsContainer}>
            <View>
              {renderRoundDate()}
              <Text style={GlobalStyles.h1}>{roundDetails.course}</Text>
            </View>
            <View style={RoundStyles.attributeContainer}>
              {sortedPreferences?.map((preferred: Attribute) => (
                <View
                  key={preferred.id}
                  style={[statusStyles[preferred.status] || {}]}
                >
                  <Text
                    style={[GlobalStyles.body, { color: colors.neutral.light }]}
                  >
                    {preferred.name}
                  </Text>
                </View>
              ))}
            </View>
            <View style={RoundStyles.memberList}>
              {Array.from({ length: roundDetails.spots }).map((_, index) => {
                const golfer = roundDetails.golfers[index];
                return (
                  <View key={index} style={RoundStyles.memberListItem}>
                    {golfer && index < roundDetails.golfers.length ? (
                      <>
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
          </View>
        )}
      </ScrollView>
      {roundDetails && (
        <View style={RoundStyles.actionButtonContainer}>
          <TextButton
            text={
              roundDetails.golfers.length === roundDetails.spots
                ? "Round full"
                : "Request to join"
            }
            disabled={roundDetails.golfers.length === roundDetails.spots}
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
