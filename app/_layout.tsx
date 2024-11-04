import { Slot } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoundCacheProvider } from "@/contexts/RoundCacheContext";
import { NotificationCacheProvider } from "@/contexts/NotificationCacheContext";

export default function Root() {
  return (
    <AuthProvider>
      <RoundCacheProvider>
        <NotificationCacheProvider>
          <Slot />
        </NotificationCacheProvider>
      </RoundCacheProvider>
    </AuthProvider>
  );
}
