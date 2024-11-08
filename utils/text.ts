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
