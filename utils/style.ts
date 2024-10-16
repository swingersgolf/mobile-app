import { RoundStyles } from "@/styles/roundStyles";

type PreferenceType = "preferred" | "disliked" | "indifferent";

export const getPreferenceStyle = (type: PreferenceType) => {
  const styles = {
    preferred: RoundStyles.preferredAttribute,
    disliked: RoundStyles.dislikedAttribute,
    indifferent: RoundStyles.indifferentAttribute,
  };
  return styles[type] || RoundStyles.attribute;
};
