import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Appearance,
} from "react-native";
import { classifyPreference } from "@/utils/preference";
import { RoundDetails } from "@/types/roundTypes";
import { parseRoundDate } from "@/utils/date";
import { MaterialIcons } from "@expo/vector-icons";
import { RoundStyles } from "@/styles/roundStyles";
import { router, useFocusEffect } from "expo-router";
import GlobalStyles from "@/styles/GlobalStyles";
import { useRoundCache } from "@/contexts/RoundCacheContext";
import { PreferenceIcon, TimeRangeIcon } from "@/utils/icon";
import { capitalizeWords, formatDistanceMetric } from "@/utils/text";

const RoundScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, preferences, user } = useAuth();
  const { roundCache, setRoundCache } = useRoundCache();

  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchRounds = useCallback(async () => {
    setError("");
    try {
      const response = await axios.get(`${apiUrl}/v1/round`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedRounds = response.data.data;
      const roundsMap = new Map<string, RoundDetails>();

      fetchedRounds.forEach((round: RoundDetails) => {
        roundsMap.set(round.id.toString(), round);
      });

      setRoundCache((prevCache) => {
        const updatedCache = new Map(prevCache);
        roundsMap.forEach((value, key) => updatedCache.set(key, value));
        return updatedCache;
      });
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
  }, [apiUrl, token, setRoundCache]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRounds();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRounds();
    }, [fetchRounds]),
  );

  if (error) {
    return (
      <View style={RoundStyles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={RoundStyles.container}>
      <FlatList
        style={RoundStyles.scrollStyle}
        contentContainerStyle={RoundStyles.roundScrollStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]}
          />
        }
        data={Array.from(roundCache.values())}
        renderItem={({ item: round }) => {
          const { dayOfWeek, dayNumber, month } = parseRoundDate(round.date);

          const orderedPreferences = round.preferences
            .map((roundPref) => {
              if (!preferences) {
                // If no user preferences, show all round preferences with medium color
                return {
                  ...roundPref,
                  matchType: "no-preference",
                };
              }

              const userPref = preferences.find(
                (pref) => pref?.preference_id === roundPref.id,
              );

              const matchType = userPref
                ? classifyPreference(userPref.status, roundPref.status)
                : "no-preference";

              return {
                ...roundPref,
                matchType,
              };
            })
            .sort((a, b) => {
              const matchTypeOrder = {
                perfect: 1,
                partial: 2,
                "no-preference": 3,
                mismatch: 4,
              };

              return (
                matchTypeOrder[a.matchType as keyof typeof matchTypeOrder] -
                matchTypeOrder[b.matchType as keyof typeof matchTypeOrder]
              );
            });
          return (
            <TouchableOpacity
              key={round.id}
              style={RoundStyles.roundContainer}
              onPress={() =>
                router.push({
                  pathname: "/details",
                  params: { roundId: round.id },
                })
              }
            >
              <View style={RoundStyles.badgeContainer}>
                {console.log("round", round)}
                {/* If user is the host display a host badge, else if user is a member of the round display a member badge, else display nothing */}
                {round.host_id === user?.id ? (
                  <View style={RoundStyles.hostBadgeContainer}>
                    <Text style={GlobalStyles.body}>Host</Text>
                  </View>
                ) : round.golfers.find((golfer) => golfer.id === user?.id) ? (
                  <View style={RoundStyles.memberBadgeContainer}>
                    <Text style={GlobalStyles.body}>
                      {capitalizeWords(
                        round.golfers.find((golfer) => golfer.id === user?.id)
                          ?.status || "",
                      )}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={RoundStyles.infoContainer}>
                <View style={RoundStyles.whenConatiner}>
                  <TimeRangeIcon name={round.time_range} />
                  <Text style={GlobalStyles.h3}>
                    {`${dayOfWeek} ${dayNumber} ${month}`}
                  </Text>
                </View>
                <Text style={GlobalStyles.h2}>{round.course}</Text>
                <View style={RoundStyles.attributeContainer}>
                  {orderedPreferences.map((pref) => {
                    const color =
                      pref.matchType === "perfect"
                        ? colors.primary.default
                        : pref.matchType === "mismatch"
                          ? colors.alert.error
                          : colors.neutral.medium;

                    return (
                      <PreferenceIcon
                        name={pref.name}
                        key={pref.id}
                        backgroundColor={color}
                      />
                    );
                  })}
                </View>
                <View style={{ position: "absolute", right: 0, bottom: 0 }}>
                  <Text style={GlobalStyles.h4}>
                    {formatDistanceMetric(round.distance)}
                  </Text>
                </View>
                <View style={RoundStyles.memberContainer}>
                  {[...Array(round.group_size)].map((_, index) => {
                    const golfer = round.golfers[index];
                    if (golfer && golfer.status === "accepted") {
                      return (
                        <View style={RoundStyles.memberIconFilled} key={index}>
                          <MaterialIcons
                            name="person"
                            size={16}
                            color={
                              Appearance.getColorScheme() === "dark"
                                ? colors.neutral.dark
                                : colors.neutral.light
                            }
                          />
                        </View>
                      );
                    }
                    return (
                      <View
                        style={RoundStyles.memberIconEmpty}
                        key={index}
                      ></View>
                    );
                  })}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default RoundScreen;
