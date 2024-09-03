import {
  createContext,
  useContext,
  PropsWithChildren,
  useEffect,
  useCallback,
  useState,
} from "react";
import axios from "axios";
import {
  setStorageItemAsync,
  useStorageState,
} from "@/storage/useStorageState";
import { UserType, ProfileType } from "@/utils/types";

interface AuthContextType {
  token: string | null;
  user: UserType | null;
  profile: ProfileType | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  createAccount: (
    name: string,
    email: string,
    password: string,
    birthdate: string,
  ) => Promise<void>;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updatedProfile: ProfileType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a SessionProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [[isLoading, token], setToken] = useStorageState("token");
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    const syncStorage = async () => {
      if (token) {
        await setStorageItemAsync("token", token);
        await fetchUser();
        await fetchProfile();
      } else {
        await setStorageItemAsync("token", null);
        setUser(null);
        setProfile(null);
      }
    };
    syncStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${apiUrl}/v1/login`, {
        email,
        password,
      });
      setToken(response.data.token);
      return Promise.resolve();
    } catch (error) {
      console.error("Error logging in:", error);
      return Promise.reject(error);
    }
  };

  const signOut = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const createAccount = async (
    name: string,
    email: string,
    password: string,
    birthdate: string,
  ) => {
    try {
      await axios.post(`${apiUrl}/v1/register`, {
        name,
        email,
        password,
        birthdate,
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating account:", error);
      return Promise.reject(error);
    }
  };

  const fetchUser = async () => {
    try {
      if (token) {
        const response = await axios.get(`${apiUrl}/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error fetching user:", error);
      return Promise.reject(error);
    }
  };

  const fetchProfile = async () => {
    try {
      if (token) {
        const response = await axios.get(`${apiUrl}/v1/user-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.data);
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error fetching profile:", error);
      return Promise.reject(error);
    }
  };

  const updateProfile = async (updatedProfile: ProfileType) => {
    try {
      if (token) {
        await axios.patch(`${apiUrl}/v1/user-profile`, updateProfile, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set Content-Type header
          },
        });
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating user:", error);
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        signIn,
        signOut,
        createAccount,
        fetchUser,
        fetchProfile,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
