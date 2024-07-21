import { Slot } from "expo-router";
import { SafeAreaView, StyleSheet, View } from "react-native";
import BackButton from "@/components/BackButton";
import Icon from "@/assets/branding/Icon.svg";

export default function UnauthorizedLayout() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackButton style={styles.backButton} />
        <View style={styles.iconContainer}>
          <Icon height={50} width={50} />
        </View>
      </SafeAreaView>
      <Slot />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
