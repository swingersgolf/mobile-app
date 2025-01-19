import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Appearance, Text } from "react-native";
import { colors } from "@/constants/Colors";
import { View } from "react-native";
import { labelFromStatus } from "@/utils/text";
import { RoundStyles } from "@/styles/roundStyles";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  status?: string;
  backgroundColor?: string;
}

export const PreferenceIcon: React.FC<IconProps> = ({
  name,
  status,
  size = 16,
  color = colors.neutral.dark,
  backgroundColor,
}) => {
  const iconColor = backgroundColor
    ? Appearance.getColorScheme() === "dark"
      ? colors.neutral.dark
      : colors.neutral.light
    : color;

  const iconMap: { [key: string]: JSX.Element } = {
    drinking: <MaterialIcons name="local-bar" size={size} color={iconColor} />,
    smoking: (
      <MaterialIcons name="smoking-rooms" size={size} color={iconColor} />
    ),
    betting: (
      <MaterialCommunityIcons name="cash" size={size} color={iconColor} />
    ),
    riding: (
      <MaterialCommunityIcons name="golf-cart" size={size} color={iconColor} />
    ),
    music: <MaterialIcons name="music-note" size={size} color={iconColor} />,
  };

  const getWrappedIcon = (icon: JSX.Element) =>
    backgroundColor ? (
      <View
        style={[
          !status && RoundStyles.attribute,
          { backgroundColor: backgroundColor },
        ]}
      >
        {icon}
      </View>
    ) : (
      icon
    );

  const getIcon = (preference: string) => {
    const icon = iconMap[preference.toLowerCase()];
    return icon ? (
      getWrappedIcon(icon)
    ) : (
      <Text style={{ fontSize: size, color }}>{preference}</Text>
    );
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
        <Text
          style={{
            fontSize: 14,
            color:
              Appearance.getColorScheme() === "dark"
                ? colors.neutral.dark
                : colors.neutral.light,
          }}
        >
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
        return (
          <MaterialCommunityIcons
            name="weather-sunset-up"
            size={size}
            color={colors.neutral.dark}
          />
        );
      case "morning":
        return (
          <MaterialCommunityIcons
            name="weather-sunny"
            size={size}
            color={colors.neutral.dark}
          />
        );
      case "afternoon":
        return (
          <MaterialCommunityIcons
            name="weather-sunset-down"
            size={size}
            color={colors.neutral.dark}
          />
        );
      case "twilight":
        return (
          <MaterialCommunityIcons
            name="weather-night"
            size={size}
            color={colors.neutral.dark}
          />
        );
      default:
        return (
          <Text style={{ fontSize: size, color: colors.neutral.light }}>
            {timeRange}
          </Text>
        );
    }
  };

  return getIcon(name);
};
