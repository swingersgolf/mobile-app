export const classifyPreference = (userStatus: string, roundStatus: string) => {
  if (
    (userStatus === "preferred" && roundStatus === "preferred") ||
    (userStatus === "disliked" && roundStatus === "disliked") ||
    (userStatus === "indifferent" && roundStatus === "indifferent")
  ) {
    return "perfect";
  }
  if (
    (userStatus === "preferred" && roundStatus === "disliked") ||
    (userStatus === "disliked" && roundStatus === "preferred")
  ) {
    return "mismatch";
  }
  return "partial";
};
