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

export const formatDateYYYY_MM_DD_HH_MM_MM = (date: Date): string => {
  // format date as yyyy-mm-dd hh:mm AM/PM
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${year}-${month}-${day} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const formatDateDayMonthTime = (date: Date): string => {
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "short" });
  const dayNumber = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${dayOfWeek} ${dayNumber} ${month} ${formattedHours}:${formattedMinutes} ${ampm}`;
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

export const parseRoundDate = (when: string, long?: boolean) => {
  const longForm = long ? "long" : "short";
  const date = new Date(when);

  // Get day of the week (3 characters)
  const dayOfWeek = date.toLocaleString("en-US", { weekday: longForm });

  // Get day of the month
  const dayNumber = date.getDate();

  // Get month (3 characters)
  const month = date.toLocaleString("en-US", { month: longForm });

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

export const getTimeElapsed = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 52) {
    return `${diffInWeeks}w`;
  }

  const diffInYears = Math.floor(diffInWeeks / 52);
  return `${diffInYears}y`;
};
