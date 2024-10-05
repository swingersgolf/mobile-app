import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Round } from "@/types/roundTypes";
import { parseRoundDate } from "@/utils/date";
import { Feather } from "@expo/vector-icons";
import { RoundStyles } from "@/styles/roundStyles";
import { router } from "expo-router";
import GlobalStyles from "@/styles/GlobalStyles";

const RoundScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();

  const [rounds, setRounds] = useState<Round[]>([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  const fetchRounds = useCallback(async () => {
    setError("");
    try {
      const response = await axios.get(`${apiUrl}/v1/round`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRounds(response.data.data);
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
  }, [apiUrl, token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRounds();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRounds();
  }, [apiUrl, fetchRounds, token]);

  if (error) {
    return (
      <View style={RoundStyles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

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
        {rounds &&
          rounds.map((round) => {
            const { dayOfWeek, dayNumber, month } = parseRoundDate(round.when);
            return (
              <TouchableOpacity
                key={round.id}
                style={RoundStyles.roundContainer}
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: { roundId: round.id }, // Pass correct roundId
                  })
                }
              >
                <View style={RoundStyles.whenConatiner}>
                  <Text style={GlobalStyles.h3}>{dayOfWeek}</Text>
                  <Text style={GlobalStyles.h3}>{dayNumber}</Text>
                  <Text style={GlobalStyles.h3}>{month}</Text>
                </View>
                <View style={RoundStyles.infoContainer}>
                  <Text style={GlobalStyles.h2}>{round.course}</Text>
                  {/* <View style={RoundStyles.attributeContainer}>
                    {round.preferred.map((preferred: Attribute) => (
                      <View key={preferred.id} style={(RoundStyles.attribute)}>
                        <Text style={GlobalStyles.body}>{preferred.name}</Text>
                      </View>
                    ))}
                  </View> */}
                </View>
                <View style={RoundStyles.memberContainer}>
                  {[...Array(round.spots)].map((_, index) => {
                    return (
                      <View key={index} style={RoundStyles.memberIconContainer}>
                        <Feather
                          name="user"
                          size={20}
                          color={
                            index < round.golfer_count
                              ? colors.primary.default
                              : colors.background.primary
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
      {/* <TouchableOpacity style={RoundStyles.filterOverlayContainer}>
        <Feather name="filter" size={30} color={colors.neutral.light} />
      </TouchableOpacity> */}
    </View>
  );
};

export default RoundScreen;
