import { MaterialCommunityIcons } from "@expo/vector-icons";

export const isOver18 = (date: Date) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
};

export const formatDateYYYY_MM_DD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getAgeFromDateYYY_MM_DD = (dateString: string): number => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const parseRoundDate = (when: string) => {
  const date = new Date(when);

  // Get day of the week (3 characters)
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "short" });

  // Get day of the month
  const dayNumber = date.getDate();

  // Get month (3 characters)
  const month = date.toLocaleString("en-US", { month: "short" });

  // Get time (HH:MM)
  const time = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const TimeIcon = () => {
    const hours = date.getHours();

    if (hours >= 0 && hours < 10) {
      // Early AM (12:00 AM - 9:59 AM)
      return <MaterialCommunityIcons name="weather-sunset" size={20} />;
    } else if (hours >= 10 && hours < 16) {
      // Mid-afternoon (1:00 PM - 3:59 PM)
      return <MaterialCommunityIcons name="weather-sunny" size={20} />;
    } else if (hours >= 16) {
      // Twilight (4:00 PM - 11:59 PM)
      return <MaterialCommunityIcons name="weather-night" size={20} />;
    }
  };

  return {
    dayOfWeek, // E.g., "Mon"
    dayNumber: dayNumber.toString(), // E.g., "17"
    month, // E.g., "Oct"
    time, // E.g., "10:00"
    TimeIcon,
  };
};
