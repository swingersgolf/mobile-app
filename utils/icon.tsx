import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { colors } from "@/constants/Colors";
import { View } from "react-native";
import { labelFromStatus } from "@/utils/text";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  status?: string;
}

export const PreferenceIcon: React.FC<IconProps> = ({
  name,
  status,
  size = 16,
  color = colors.neutral.dark,
}) => {
  const getIcon = (preference: string) => {
    preference = preference.toLowerCase();
    switch (preference) {
      case "drinking":
        return <MaterialIcons name="local-bar" size={size} color={color} />;
      case "smoking":
        return <MaterialIcons name="smoking-rooms" size={size} color={color} />;
      case "betting":
        return <MaterialCommunityIcons name="cash" size={size} color={color} />;
      case "riding":
        return (
          <MaterialCommunityIcons name="golf-cart" size={size} color={color} />
        );
      case "music":
        return <MaterialIcons name="music-note" size={size} color={color} />;
      default:
        return <Text style={{ fontSize: size, color }}>{preference}</Text>;
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2.5,
      }}
    >
      {getIcon(name)}
      {status && (
        <Text style={{ fontSize: 14, color: colors.neutral.light }}>
          {labelFromStatus(status)}
        </Text>
      )}
    </View>
  );
};

export const TimeRangeIcon: React.FC<IconProps> = ({ name, size = 16 }) => {
  const getIcon = (timeRange: string) => {
    timeRange = timeRange.toLowerCase();
    switch (timeRange) {
      case "early_bird":
        return <MaterialCommunityIcons name="weather-sunset-up" size={size} />;
      case "morning":
        return <MaterialCommunityIcons name="weather-sunny" size={size} />;
      case "afternoon":
        return (
          <MaterialCommunityIcons name="weather-sunset-down" size={size} />
        );
      case "twilight":
        return <MaterialCommunityIcons name="weather-night" size={size} />;
      default:
        return <Text style={{ fontSize: size }}>{timeRange}</Text>;
    }
  };

  return getIcon(name);
};
