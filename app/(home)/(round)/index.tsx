import Spinner from "@/components/Spinner";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import Round, { User, Attribute } from "@/types/roundTypes";
import { parseRoundDate } from "@/utils/date";
import { Feather } from "@expo/vector-icons";
import { HomeStyles } from "@/styles/homeStyles";
import { router } from "expo-router";

const Home = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();

  const [rounds, setrounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchrounds = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${apiUrl}/v1/round`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setrounds(response.data.data);
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
        setLoading(false);
      }
    };

    fetchrounds();
  }, [apiUrl, token]);

  if (error) {
    return (
      <View style={HomeStyles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={HomeStyles.container}>
      {loading ? (
        <View style={HomeStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <ScrollView style={HomeStyles.scrollStyle}>
          {rounds.map((round, index) => {
            const { dayOfWeek, dayNumber, month } = parseRoundDate(round.when);
            return (
              <TouchableOpacity
                key={index}
                style={HomeStyles.roundContainer}
                onPress={() =>
                  router.push({
                    pathname: "./round-details/[id]",
                    params: { id: "1" },
                  })
                }
              >
                <View style={HomeStyles.whenConatiner}>
                  <Text style={HomeStyles.roundDay}>{dayOfWeek}</Text>
                  <Text style={HomeStyles.roundDayNumber}>{dayNumber}</Text>
                  <Text style={HomeStyles.roundMonth}>{month}</Text>
                </View>
                <View style={HomeStyles.infoContainer}>
                  <View style={HomeStyles.roundCreatedTime}>
                    <Text>1s*</Text>
                  </View>
                  <Text style={HomeStyles.roundTitle}>{round.course}</Text>
                  <View style={HomeStyles.memberContainer}>
                    {round.users.map((user: User) => (
                      <Feather
                        name="user"
                        size={24}
                        color={colors.primary.default}
                        key={user.id}
                      />
                    ))}
                  </View>
                  <View style={HomeStyles.attributeContainer}>
                    {round.attributes.map((attribute: Attribute) => (
                      <View key={attribute.id} style={HomeStyles.attribute}>
                        <Text style={HomeStyles.attributeText}>
                          {attribute.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default Home;
