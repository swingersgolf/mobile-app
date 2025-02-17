import { useAuth } from "@/contexts/AuthContext";
import { RoundStyles } from "@/styles/roundStyles";
import axios, { isAxiosError } from "axios";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  RefreshControl,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Golfer, RoundDetails } from "@/types/roundTypes";
import { colors } from "@/constants/Colors";
import GlobalStyles from "@/styles/GlobalStyles";
import { parseRoundDate } from "@/utils/date";
import TextButton from "@/components/TextButton";
import { useRoundCache } from "@/contexts/RoundCacheContext";
import { MaterialIcons } from "@expo/vector-icons";
import { PreferenceIcon, TimeRangeIcon } from "@/utils/icon";
import { classifyPreference } from "@/utils/preference";
import { getTimeRange, getTimeRangeLabelFromId } from "@/utils/timeRange";
import { formatDistanceMetric } from "@/utils/text";
import PlaceholderProfilePicture from "@/assets/images/profile-picture-placeholder.png";
import { useRound } from "@/contexts/RoundContext";

const RoundDetailsScreen: React.FC = () => {
  const { roundId } = useLocalSearchParams();
  const { setIsMember, setMessageGroupId, isMember } = useRound();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, user, preferences } = useAuth();

  const { setRoundCache } = useRoundCache();

  const [roundDetails, setRoundDetails] = useState<RoundDetails | null>(null);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Inside your component
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true); // Set to true when image fails to load
  };

  const fetchRoundDetails = useCallback(async () => {
    setError("");

    // // Check if the details are already in cache
    // if (roundCache.has(roundId as string)) {
    //   setRoundDetails(roundCache.get(roundId as string)!);
    //   return;
    // }

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

      // Check if the user is a member of the round
      const userIsMember = fetchedRoundDetails.golfers.some(
        (golfer: Golfer) =>
          golfer.id === user?.id && golfer.status === "accepted",
      );

      setIsMember(userIsMember);
      setMessageGroupId(response.data.data.message_group_id);
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
  }, [
    apiUrl,
    roundId,
    token,
    setRoundCache,
    setIsMember,
    setMessageGroupId,
    user?.id,
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoundDetails();
    setRoundCache((prevCache) => {
      const updatedCache = new Map(prevCache);
      updatedCache.delete(roundId as string);
      return updatedCache;
    });
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoundDetails();
    }, [fetchRoundDetails]),
  );

  if (error) {
    return (
      <View style={RoundStyles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  const renderRoundDate = () => {
    if (roundDetails) {
      const { dayOfWeek, dayNumber, month, year } = parseRoundDate(
        roundDetails.date,
        true,
      );
      return (
        <Text style={GlobalStyles.h2}>
          {`${dayOfWeek} ${dayNumber} ${month} ${year}`}
        </Text>
      );
    }
    return null;
  };

  const countRequests = ({
    status,
  }: {
    status: "pending" | "accepted" | "rejected";
  }) => {
    if (!roundDetails) return 0;
    return roundDetails.golfers.filter((golfer) => golfer.status === status)
      .length;
  };

  const getGolfers = ({
    status,
  }: {
    status: "pending" | "accepted" | "rejected";
  }) => {
    if (!roundDetails) return [];
    return roundDetails.golfers
      .filter(
        (golfer) =>
          golfer.status === status && golfer.id !== roundDetails.host_id,
      )
      .map((golfer) => ({ id: golfer.id, firstname: golfer.firstname }));
  };

  const requestToJoinRound = async () => {
    try {
      await axios.post(
        `${apiUrl}/v1/round/${roundId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRefreshing(true);
      await fetchRoundDetails();
      setRoundCache((prevCache) => {
        const updatedCache = new Map(prevCache);
        updatedCache.delete(roundId as string);
        return updatedCache;
      });
      setRefreshing(false);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to join round. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const deleteRequest = async () => {
    try {
      await axios.delete(`${apiUrl}/v1/round/${roundId}/leave`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRefreshing(true);
      await fetchRoundDetails();
      setRoundCache((prevCache) => {
        const updatedCache = new Map(prevCache);
        updatedCache.delete(roundId as string);
        return updatedCache;
      });
      setRefreshing(false);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to cancel join request. Please try again.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const hasUserRequestedToJoin = () => {
    if (!roundDetails) return false;
    return roundDetails.golfers.some(
      (golfer) => golfer.id === user?.id && golfer.status === "pending",
    );
  };

  const handleMemberPress = ({ memberId }: { memberId: string }) => {
    router.push({
      pathname: "/public-account",
      params: { userId: memberId },
    });
  };

  return (
    <View style={RoundStyles.container}>
      <ScrollView
        style={RoundStyles.scrollStyleDetails}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]}
          />
        }
      >
        {roundDetails && (
          <View style={RoundStyles.roundDetailsContainer}>
            {roundDetails.host_id === user?.id && (
              <TouchableOpacity
                onPress={() => {
                  if (countRequests({ status: "accepted" }) > 0) {
                    const acceptedGolfers = JSON.stringify(
                      getGolfers({ status: "accepted" }),
                    );
                    router.push({
                      pathname: "/edit",
                      params: {
                        roundId: roundId,
                        golfers: acceptedGolfers,
                      },
                    });
                  }
                }}
                style={{ position: "absolute", top: 20, right: 20 }}
              >
                <MaterialIcons
                  name="edit"
                  size={24}
                  color={colors.neutral.dark}
                />
              </TouchableOpacity>
            )}

            <View style={RoundStyles.roundDetails}>
              {renderRoundDate()}
              <Text style={GlobalStyles.h1}>{roundDetails.course}</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                  alignItems: "center",
                }}
              >
                <Text style={GlobalStyles.h3}>
                  {getTimeRangeLabelFromId(roundDetails.time_range)}
                </Text>
                <TimeRangeIcon name={roundDetails.time_range} />
                <Text style={GlobalStyles.h3}>
                  {getTimeRange(roundDetails.time_range)}
                </Text>
              </View>
              {roundDetails.distance && (
                <Text style={GlobalStyles.h4}>
                  {formatDistanceMetric(roundDetails.distance)}
                </Text>
              )}
            </View>
            <View style={RoundStyles.attributeContainer}>
              {roundDetails?.preferences
                .map((roundPref) => {
                  const userPref = preferences?.find(
                    (pref) => pref?.preference_id === roundPref.id,
                  );

                  const matchType = userPref
                    ? classifyPreference(userPref.status, roundPref.status)
                    : "no-preference";

                  const backgroundColor =
                    matchType === "perfect"
                      ? colors.primary.default
                      : matchType === "mismatch"
                        ? colors.alert.error
                        : colors.neutral.medium;

                  return {
                    ...roundPref,
                    matchType,
                    backgroundColor,
                  };
                })
                .filter((pref) => pref !== null)
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
                })
                .map((sortedPref) => (
                  <View
                    key={sortedPref.id}
                    style={[
                      RoundStyles.attribute,
                      { backgroundColor: sortedPref.backgroundColor },
                    ]}
                  >
                    <PreferenceIcon
                      name={sortedPref.name}
                      status={sortedPref.status}
                      backgroundColor={sortedPref.backgroundColor}
                    />
                  </View>
                ))}
            </View>

            <View style={RoundStyles.memberList}>
              {/* Sort golfers first */}
              {roundDetails.golfers
                .filter((golfer) => golfer.status === "accepted")
                .slice()
                .sort((a, b) => {
                  if (a.id === roundDetails.host_id) return -1;
                  if (b.id === roundDetails.host_id) return 1;
                  return 0;
                })
                .concat(
                  Array.from({
                    length:
                      roundDetails.group_size -
                      roundDetails.golfers.filter(
                        (golfer) => golfer.status === "accepted",
                      ).length,
                  }).fill(undefined) as Golfer[],
                )
                .map((golfer, index) => (
                  <View key={index} style={{ width: "100%" }}>
                    {golfer ? (
                      <TouchableOpacity
                        onPress={() =>
                          handleMemberPress({ memberId: golfer.id })
                        }
                        style={RoundStyles.memberListItem}
                      >
                        <View style={RoundStyles.memberListItemContent}>
                          <Image
                            style={RoundStyles.memberProfilePicture}
                            source={
                              imageError || !golfer.photo
                                ? PlaceholderProfilePicture
                                : { uri: golfer.photo }
                            }
                            onError={handleImageError} // Error handler for image loading
                          />
                          <Text style={GlobalStyles.h3}>
                            {golfer.firstname}&nbsp;{golfer.lastname}
                          </Text>
                        </View>
                        {golfer.id === roundDetails.host_id && (
                          <Text style={GlobalStyles.body}>Host</Text>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <View style={RoundStyles.memberListItem}>
                        <Text style={[GlobalStyles.h4]}>
                          Waiting for member to join
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
      {roundDetails && roundDetails.host_id === user?.id ? (
        <View style={RoundStyles.actionButtonContainer}>
          <TextButton
            text={
              countRequests({ status: "pending" }) > 0
                ? "View requests"
                : "No requests"
            }
            onPress={
              countRequests({ status: "pending" }) > 0
                ? () => {
                    const pendingGolfers = JSON.stringify(
                      getGolfers({ status: "pending" }),
                    );
                    router.push({
                      pathname: "/requests",
                      params: { roundId: roundId, requests: pendingGolfers },
                    });
                  }
                : undefined
            }
            textColor={colors.button.primary.text}
            backgroundColor={colors.button.primary.background}
            disabled={countRequests({ status: "pending" }) === 0}
          />
        </View>
      ) : (
        roundDetails && (
          <View style={RoundStyles.actionButtonContainer}>
            <TextButton
              text={
                countRequests({ status: "accepted" }) ===
                roundDetails?.group_size
                  ? hasUserRequestedToJoin()
                    ? "Leave waitlist"
                    : "Join waitlist"
                  : isMember
                    ? "Leave round"
                    : hasUserRequestedToJoin()
                      ? "Cancel request"
                      : "Request to join"
              }
              onPress={
                isMember
                  ? deleteRequest
                  : hasUserRequestedToJoin()
                    ? deleteRequest
                    : requestToJoinRound
              }
              textColor={colors.button.primary.text}
              backgroundColor={colors.button.primary.background}
            />
          </View>
        )
      )}
    </View>
  );
};

export default RoundDetailsScreen;
