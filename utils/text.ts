export const convertCamelCaseToLabel = (key: string) => {
  // Split camel case key into words
  const formattedKey = key
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

  return formattedKey;
};
