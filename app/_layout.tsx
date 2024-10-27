import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { RoundCacheProvider } from "../contexts/RoundCacheContext";

export default function Root() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RoundCacheProvider>
          <Slot />
        </RoundCacheProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
