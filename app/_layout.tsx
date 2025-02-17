import { Slot } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoundCacheProvider } from "@/contexts/RoundCacheContext";
import { RoundProvider } from "@/contexts/RoundContext";
import { CreateRoundProvider } from "@/contexts/CreateRoundContext";

export default function Root() {
  return (
    <AuthProvider>
      <RoundCacheProvider>
        <RoundProvider>
          <CreateRoundProvider>
            <Slot />
          </CreateRoundProvider>
        </RoundProvider>
      </RoundCacheProvider>
    </AuthProvider>
  );
}
