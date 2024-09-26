import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const RoundDetails = () => {
  const { roundId } = useLocalSearchParams();

  return (
    <View>
      <Text>Round Details</Text>
      <Text>Round ID: {roundId}</Text>
    </View>
  );
};

export default RoundDetails;
