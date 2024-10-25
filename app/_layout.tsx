import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { RoundCacheProvider } from "../contexts/RoundCacheContext";
export default function Root() {
  return (
    <AuthProvider>
      <RoundCacheProvider>
        <Slot />
      </RoundCacheProvider>
    </AuthProvider>
  );
}
