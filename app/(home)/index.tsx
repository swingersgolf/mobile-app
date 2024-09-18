import Spinner from "@/components/Spinner";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

interface Posting {
  id: string;
  title: string;
}

const Home = () => {
  const postings: Posting[] = [];
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      ) : // if postings list is empty show a message
      postings.length === 0 ? (
        <Text>No postings available</Text>
      ) : (
        // else show the postings
        postings.map((posting) => <Text key={posting.id}>{posting.title}</Text>)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default Home;
