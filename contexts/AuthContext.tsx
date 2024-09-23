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
import { UserType, ProfileType } from "@/types/authTypes";

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
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    password: string,
  ) => Promise<void>;
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

  const signOut = useCallback(async () => {
    try {
      console.log("Signing out user with token:", token);
      if (token) {
        await axios.post(
          `${apiUrl}/v1/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setToken(null);
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error logging in:", error);
      return Promise.reject(error);
    }
  }, [apiUrl, setToken, token]);

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

  const fetchUser = useCallback(async () => {
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
  }, [apiUrl, token]);

  const fetchProfile = useCallback(async () => {
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
  }, [apiUrl, token]);

  const updateProfile = async (updatedProfile: ProfileType) => {
    try {
      if (token) {
        await axios.patch(`${apiUrl}/v1/user-profile`, updatedProfile, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set Content-Type header
          },
        });
        await fetchProfile();
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating user:", error);
      return Promise.reject(error);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await axios.post(`${apiUrl}/v1/verify`, {
        email,
        code,
      });
      console.log(response);
      setToken(response.data.token);
      return Promise.resolve();
    } catch (error) {
      console.error("Error logging in:", error);
      return Promise.reject(error);
    }
  };

  const resendVerificationCode = async (email: string) => {
    try {
      await axios.post(`${apiUrl}/v1/resend`, {
        email,
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error resending verification code:", error);
      return Promise.reject(error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${apiUrl}/v1/forgot`, {
        email,
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      return Promise.reject(error);
    }
  };

  const resetPassword = async (
    email: string,
    code: string,
    password: string,
  ) => {
    try {
      await axios.post(`${apiUrl}/v1/reset`, {
        email,
        code,
        password,
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error resetting password:", error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    const syncStorage = async () => {
      if (token) {
        try {
          await setStorageItemAsync("token", token);
          await fetchUser();
          await fetchProfile();
        } catch {
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      } else {
        await setStorageItemAsync("token", null);
        setUser(null);
        setProfile(null);
      }
    };
    syncStorage();
  }, [fetchProfile, fetchUser, setToken, token]);

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
        verifyEmail,
        resendVerificationCode,
        forgotPassword,
        resetPassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
