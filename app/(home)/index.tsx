import Spinner from "@/components/Spinner";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import Round, { User, Atrribute } from "@/types/roundTypes";
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
                  <Text>{dayOfWeek}</Text>
                  <Text>{dayNumber}</Text>
                  <Text>{month}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text>{round.course}</Text>
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
                    {round.attributes.map((attribute: Atrribute) => (
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
    padding: 5,
    backgroundColor: colors.primary.default,
  },
  attributeText: {
    color: colors.neutral.light,
  },
  scrollStyle: {
    width: "100%",
  },
});

export default Home;
