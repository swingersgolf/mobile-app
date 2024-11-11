import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";

interface IconProps {
  preference: string;
  size?: number;
  color?: string;
}

const PreferenceIcon: React.FC<IconProps> = ({
  preference,
  size = 20,
  color = "black",
}) => {
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

export default PreferenceIcon;
