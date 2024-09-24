import Spinner from "@/components/Spinner";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import Round, { User, Attribute } from "@/types/roundTypes";
import { parseRoundDate } from "@/utils/date";
import { Feather } from "@expo/vector-icons";

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
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <ScrollView style={styles.scrollStyle}>
          {rounds.map((round, index) => {
            const { dayOfWeek, dayNumber, month } = parseRoundDate(round.when);

            return (
              <View key={index} style={styles.roundContainer}>
                <View style={styles.whenConatiner}>
                  <Text style={styles.roundDay}>{dayOfWeek}</Text>
                  <Text style={styles.roundDayNumber}>{dayNumber}</Text>
                  <Text style={styles.roundMonth}>{month}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <View style={styles.roundCreatedTime}>
                    <Text>1s*</Text>
                  </View>
                  <Text style={styles.roundTitle}>{round.course}</Text>
                  <View style={styles.memberContainer}>
                    {round.users.map((user: User) => (
                      <Feather
                        name="user"
                        size={24}
                        color={colors.primary.default}
                        key={user.id}
                      />
                    ))}
                  </View>
                  <View style={styles.attributeContainer}>
                    {round.attributes.map((attribute: Attribute) => (
                      <View key={attribute.id} style={styles.attribute}>
                        <Text style={styles.attributeText}>
                          {attribute.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  spinnerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  roundContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    columnGap: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    borderBottomColor: colors.neutral.light,
    borderBottomWidth: 5,
  },
  whenConatiner: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    rowGap: 10,
    flex: 1,
  },
  memberContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    columnGap: 10,
  },
  attributeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    columnGap: 10,
  },
  attribute: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.primary.default,
    borderRadius: 5,
  },
  attributeText: {
    color: colors.neutral.light,
  },
  scrollStyle: {
    width: "100%",
    backgroundColor: colors.background.primary,
  },
  roundCreatedTime: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  roundDay: {
    fontSize: 16,
  },
  roundDayNumber: {
    fontSize: 24,
  },
  roundMonth: {
    fontSize: 16,
  },
});

export default Home;
