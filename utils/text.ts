export const convertCamelCaseToLabel = (key: string) => {
  // Split camel case key into words
  const formattedKey = key
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

  return formattedKey;
};

export const getFirstName = (fullName: string): string => {
  // Trim any extra spaces and split the name by spaces
  const nameParts = fullName.trim().split(" ");

  // Return the first part of the name or the full name if it's only one part
  return nameParts[0];
};

export const capitalizeWords = (text: string) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const labelFromStatus = (status: string) => {
  switch (status) {
    case "disliked":
      return "No";
    case "preferred":
      return "Yes";
    case "indifferent":
      return "Don't care";
    default:
      return status;
  }
};

export const formatDistanceMetric = (distance: number): string | null => {
  if (distance === null) {
    return null;
  } else if (distance < 1) {
    // Convert to meters if less than 1 km
    return `${Math.round(distance * 1000)} M`;
  } else if (distance < 10) {
    // Between 1 km and 10 km: X.XX KM
    return `${distance.toFixed(2)} KM`;
  } else if (distance < 100) {
    // Between 10 km and 100 km: XX.X KM
    return `${distance.toFixed(1)} KM`;
  } else {
    // Greater than 100 km: XXXYYY KM (rounded to nearest integer)
    return `${Math.round(distance)} KM`;
  }
};
