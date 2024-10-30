import { Slot } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoundCacheProvider } from "@/contexts/RoundCacheContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Root() {
  return (
    <AuthProvider>
      <RoundCacheProvider>
        <Slot />
      </RoundCacheProvider>
    </AuthProvider>
  );
}
