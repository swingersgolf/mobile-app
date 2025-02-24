export const getTimeRange = (id: string): string => {
  switch (id) {
    case "early_bird":
      return "Open - 9:00 AM";
    case "morning":
      return "9:00 AM - 12:00 PM";
    case "afternoon":
      return "12:00 PM - 4:00 PM";
    case "twilight":
      return "4:00 PM - Close";
    default:
      return "Open - Close";
  }
};

export const getTimeRangeLabelFromId = (id: string): string => {
  switch (id) {
    case "early_bird":
      return "Early Bird";
    case "morning":
      return "Morning";
    case "afternoon":
      return "Afternoon";
    case "twilight":
      return "Twilight";
    default:
      return "All Day";
  }
};
