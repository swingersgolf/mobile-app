import { Slot } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoundCacheProvider } from "@/contexts/RoundCacheContext";
import { RoundProvider } from "@/contexts/RoundContext";

export default function Root() {
  return (
    <AuthProvider>
      <RoundCacheProvider>
        <RoundProvider>
          <Slot />
        </RoundProvider>
      </RoundCacheProvider>
    </AuthProvider>
  );
}
