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
import Round, { User, Attribute } from "@/types/roundTypes";
import { parseRoundDate } from "@/utils/date";
import { Feather } from "@expo/vector-icons";
import { HomeStyles } from "@/styles/homeStyles";
import { router } from "expo-router";
import GlobalStyles from "@/styles/GlobalStyles";

const Home = () => {
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
      <View style={HomeStyles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={HomeStyles.container}>
      <ScrollView
        style={HomeStyles.scrollStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]} // Customize the spinner color
          />
        }
      >
        {rounds.map((round, index) => {
          const { dayOfWeek, dayNumber, month } = parseRoundDate(round.when);
          return (
            <TouchableOpacity
              key={index}
              style={HomeStyles.roundContainer}
              onPress={() =>
                router.push({
                  pathname: "/details",
                  params: { roundId: round.id }, // Pass correct roundId
                })
              }
            >
              <View style={HomeStyles.whenConatiner}>
                <Text style={GlobalStyles.h3}>{dayOfWeek}</Text>
                <Text style={GlobalStyles.h3}>{dayNumber}</Text>
                <Text style={GlobalStyles.h3}>{month}</Text>
                {/* <Text style={HomeStyles.roundDateText}>{time}</Text> */}
              </View>
              <View style={HomeStyles.infoContainer}>
                <Text style={GlobalStyles.h2}>{round.course}</Text>
                <View style={HomeStyles.attributeContainer}>
                  {round.attributes.map((attribute: Attribute) => (
                    <View key={attribute.id} style={HomeStyles.attribute}>
                      <Text style={GlobalStyles.body}>{attribute.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={HomeStyles.memberContainer}>
                {round.users.map((user: User) => (
                  <Feather
                    name="user"
                    size={20}
                    color={colors.primary.default}
                    key={user.id}
                  />
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* <TouchableOpacity style={HomeStyles.filterOverlayContainer}>
        <Feather name="filter" size={30} color={colors.neutral.light} />
      </TouchableOpacity> */}
    </View>
  );
};

export default Home;
