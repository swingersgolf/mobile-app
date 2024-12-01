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
} from "react-native";
import { classifyPreference } from "@/utils/preference";
import { RoundDetails } from "@/types/roundTypes";
import { parseRoundDate } from "@/utils/date";
import { MaterialIcons } from "@expo/vector-icons";
import { RoundStyles } from "@/styles/roundStyles";
import { router, useFocusEffect } from "expo-router";
import GlobalStyles from "@/styles/GlobalStyles";
import { useRoundCache } from "@/contexts/RoundCacheContext";
import { PreferenceIcon } from "@/utils/icon";

const RoundScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, preferences } = useAuth();
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]}
          />
        }
        data={Array.from(roundCache.values())}
        renderItem={({ item: round }) => {
          const { dayOfWeek, dayNumber, month, TimeIcon } = parseRoundDate(
            round.date,
          );

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
              <View style={RoundStyles.whenConatiner}>
                <TimeIcon />
                <Text style={GlobalStyles.h3}>{dayOfWeek}</Text>
                <Text style={GlobalStyles.h3}>{month}</Text>
                <Text style={GlobalStyles.h3}>{dayNumber}</Text>
              </View>
              <View style={RoundStyles.infoContainer}>
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
                      <View
                        key={pref.id}
                        style={[
                          RoundStyles.attribute,
                          { backgroundColor: color },
                        ]}
                      >
                        <PreferenceIcon
                          name={pref.name}
                          color={colors.neutral.light}
                        />
                      </View>
                    );
                  })}
                </View>
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
                          color={colors.neutral.light}
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
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default RoundScreen;
