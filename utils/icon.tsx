import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { colors } from "@/constants/Colors";
import { View } from "react-native";
import { labelFromStatus } from "./text";

interface IconProps {
  preference: string;
  size?: number;
  color?: string;
  status?: string;
}

const PreferenceIcon: React.FC<IconProps> = ({
  preference,
  status,
  size = 16,
  color = "black",
}) => {
  const getIcon = (preference: string) => {
    preference = preference.toLowerCase();
    switch (preference) {
      case "drinking":
        return <MaterialIcons name="local-bar" size={size} color={color} />;
      case "smoking":
        return <MaterialIcons name="smoking-rooms" size={size} color={color} />;
      case "betting":
        return <MaterialIcons name="casino" size={size} color={color} />;
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
      {getIcon(preference)}
      {status && (
        <Text style={{ fontSize: 14, color: colors.neutral.light }}>
          {labelFromStatus(status)}
        </Text>
      )}
    </View>
  );
};

export default PreferenceIcon;
