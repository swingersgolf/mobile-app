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

interface AccountType {
  name: string;
  age: number;
  email: string;
  handicap: number;
  postalCode: string;
}

interface AuthContextType {
  token: string | null;
  account: AccountType | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  createAccount: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  isLoading: boolean;
  fetchAccount: () => Promise<void>;
  updateAccount: (updatedAccount: AccountType) => Promise<void>;
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
  const [account, setAccount] = useState<AccountType | null>(null);

  useEffect(() => {
    const syncStorage = async () => {
      if (token) {
        await setStorageItemAsync("token", token);
        await fetchAccount();
      } else {
        await setStorageItemAsync("token", null);
        setAccount(null);
      }
    };
    syncStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, {
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
  ) => {
    try {
      await axios.post(`${apiUrl}/register`, {
        name,
        email,
        password,
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating account:", error);
      return Promise.reject(error);
    }
  };

  const fetchAccount = async () => {
    try {
      if (token) {
        const response = await axios.get(`${apiUrl}/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccount(response.data.data);
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error fetching user:", error);
      return Promise.reject(error);
    }
  };

  const updateAccount = async (updatedAccount: Record<string, any>) => {
    try {
      if (token) {
        await axios.patch(`${apiUrl}/v1/user`, updatedAccount, {
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
        account,
        signIn,
        signOut,
        createAccount,
        fetchAccount,
        updateAccount,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
