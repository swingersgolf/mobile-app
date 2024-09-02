import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/constants/Colors";

const Card = ({ children }: { children: ReactNode }) => {
  return <View style={styles.card}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    shadowColor: colors.neutral.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    rowGap: 30,
  },
});
