import React, { useContext, createContext, PropsWithChildren } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { setStorageItemAsync, useStorageState } from "@/useStorageState";

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => false,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post("https://example.com/api/login", {
        email,
        password,
      });
      const token = response.data.token; // Adjust according to your API response structure
      await setStorageItemAsync("session", token);
      setSession(token);
      Alert.alert("Success", "Login successful");
      return true;
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while logging in");
      return false;
    }
  };

  const signOut = () => {
    setSession(null);
    setStorageItemAsync("session", null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
