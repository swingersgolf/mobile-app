import {
  createContext,
  useContext,
  PropsWithChildren,
  useEffect,
  useCallback,
} from "react";
import { Alert } from "react-native";
import axios from "axios";
import {
  setStorageItemAsync,
  useStorageState,
} from "@/storage/useStorageState";

// Define the shape of your context
interface AuthContextType {
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  createAccount: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a SessionProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, token], setToken] = useStorageState("token");

  // Sync token with SecureStore or local storage
  useEffect(() => {
    const syncStorage = async () => {
      if (token) {
        await setStorageItemAsync("token", token);
      } else {
        await setStorageItemAsync("token", null);
      }
    };
    syncStorage();
  }, [token]);

  // Sign-in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Logging in...", email, password);
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      setToken(response.data.data.token);
      Alert.alert("Success", "Login successful");
      return Promise.resolve();
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Error", "An error occurred while logging in");
      return Promise.reject(error);
    }
  };

  // Sign-out function
  const signOut = useCallback(() => {
    setToken(null);
  }, [setToken]);

  // Create account function
  const createAccount = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
      });
      Alert.alert("Success", "Account created successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating account:", error);
      Alert.alert("Error", "An error occurred while creating the account");
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, signIn, signOut, createAccount, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
