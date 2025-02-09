import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import { Key, useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GlobalStyles from "@/styles/GlobalStyles";
import { RoundStyles } from "@/styles/roundStyles";
import alertStyles from "@/styles/AlertStyles";
import { Golfer } from "@/types/roundTypes";
import TextButton from "@/components/TextButton";
import { useRouter } from "expo-router";
import { useRoundCache } from "@/contexts/RoundCacheContext";
import PlaceholderProfilePicture from "@/assets/images/profile-picture-placeholder.png";
import { colors } from "@/constants/Colors";

const EditRoundScreen = () => {
  const { roundId, golfers } = useLocalSearchParams();
  const [parsedGolfers, setParsedGolfers] = useState<Golfer[]>(
    JSON.parse(golfers as string),
  );
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const [error, setError] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);

  const router = useRouter();
  const { setRoundCache } = useRoundCache();

  const handleImageError = () => {
    setImageError(true);
  };

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
              setRoundCache((prevCache) => {
                const updatedCache = new Map(prevCache);
                updatedCache.delete(roundId as string); // Remove the round from the cache
                return updatedCache;
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

  const removeGolfer = (golfer: Golfer) => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to remove ${golfer.firstname} from your round?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${apiUrl}/v1/round-user/${roundId}`, {
                data: { user_id: golfer.id },
                headers: { Authorization: `Bearer ${token}` },
              });

              // Update state by filtering out the removed golfer
              setParsedGolfers((prevGolfers) =>
                prevGolfers.filter(
                  (updatedGolfer) => updatedGolfer.id !== golfer.id,
                ),
              );

              // Update the round cache to reflect the changes in golfers
              setRoundCache((prevCache) => {
                const updatedCache = new Map(prevCache);
                const roundDetails = updatedCache.get(roundId as string);
                if (roundDetails) {
                  updatedCache.set(roundId as string, {
                    ...roundDetails,
                    golfers: parsedGolfers.filter(
                      (updatedGolfer) => updatedGolfer.id !== golfer.id,
                    ),
                  });
                }

                return updatedCache;
              });
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
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={[RoundStyles.container, RoundStyles.roundEditContainer]}>
      {parsedGolfers.length > 0 && (
        <>
          <Text style={GlobalStyles.h1}>Golfers</Text>
          {error ? <Text style={alertStyles.errorText}>{error}</Text> : null}
          <View style={RoundStyles.memberList}>
            {parsedGolfers.map(
              (golfer: Golfer, index: Key | null | undefined) => (
                <TouchableOpacity
                  key={index}
                  style={RoundStyles.memberListItem}
                  onPress={() =>
                    router.push({
                      pathname: "/public-account",
                      params: { userId: golfer.id },
                    })
                  }
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
                    <Text style={GlobalStyles.h3}>{golfer.firstname}</Text>
                  </View>
                  <View style={RoundStyles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        RoundStyles.choiceButton,
                        { backgroundColor: colors.alert.error },
                      ]}
                      onPress={() => removeGolfer(golfer)}
                    >
                      <Text style={{ color: colors.neutral.dark }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
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
