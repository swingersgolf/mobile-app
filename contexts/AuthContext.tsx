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
import { User, Profile, Preference, Preferences } from "@/types/authTypes";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

interface AuthContextType {
  token: string | null;
  user: User | null;
  profile: Profile | null;
  preferences: Preference[] | null;
  expoPushToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  createAccount: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    birthdate: string,
  ) => Promise<void>;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchPreferences: () => Promise<void>;
  updateProfile: (updatedProfile: Profile) => Promise<void>;
  updatePreferences: (updatedPreferences: Preferences) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    password: string,
  ) => Promise<void>;
  requestPushNotificationPermission: (authToken: string) => Promise<void>;
  updateProfilePicture: (uri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a SessionProvider");
  }
  return context;
};

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error("Push notification permission not granted");
    }
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    return pushTokenString;
  } else {
    throw new Error("Must use a physical device for push notifications");
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [[isLoading, token], setToken] = useStorageState("token");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preference[] | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const updatePushTokenInBackend = useCallback(
    async (pushToken: string, authToken: string) => {
      if (!pushToken || !authToken) return;
      await axios.patch(
        `${apiUrl}/v1/user`,
        { expo_push_token: pushToken },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );
    },
    [apiUrl],
  );

  const requestPushNotificationPermission = useCallback(
    async (authToken: string) => {
      try {
        const pushToken = await registerForPushNotificationsAsync();
        setExpoPushToken(pushToken);
        await updatePushTokenInBackend(pushToken, authToken); // Update the backend
      } catch (error) {
        console.error("Error registering for push notifications:", error);
      }
    },
    [updatePushTokenInBackend],
  );

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
        setExpoPushToken(null);
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error logging in:", error);
      return Promise.reject(error);
    }
  }, [apiUrl, setToken, token]);

  useEffect(() => {
    const syncStorage = async () => {
      if (token) {
        await setStorageItemAsync("token", token);
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        if (existingStatus === "undetermined")
          await requestPushNotificationPermission(token); // Prompt for push notification on sign-in
      } else {
        await setStorageItemAsync("token", null);
      }
    };
    syncStorage();
  }, [requestPushNotificationPermission, token]);

  const createAccount = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    birthdate: string,
  ) => {
    try {
      await axios.post(`${apiUrl}/v1/register`, {
        firstname,
        lastname,
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

  const fetchPreferences = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(`${apiUrl}/v1/preference-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPreferences(response.data.data);
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error fetching profile:", error);
      return Promise.reject(error);
    }
  }, [apiUrl, token]);

  const updateProfile = async (updatedProfile: Profile) => {
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
      console.error("Error updating user profile:", error);
      return Promise.reject(error);
    }
  };

  const updatePreferences = async (updatedPreferences: Preferences) => {
    try {
      if (token) {
        await axios.patch(`${apiUrl}/v1/preference-user`, updatedPreferences, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        await fetchPreferences();
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return Promise.reject(error);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await axios.post(`${apiUrl}/v1/verify`, {
        email,
        code,
      });
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

  const updateProfilePicture = async (uri: string) => {
    try {
      // Step 1: Get the signed URL for upload
      const signedURLResponse = await axios.put(
        `${apiUrl}/v1/profile-photo`,
        {}, // Assuming the body is empty for fetching the signed URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const signedURL = signedURLResponse.data.url;

      // Step 2: Read the file as a base64 string using FileSystem
      const fileUri = uri;
      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Step 3: Convert the base64 string to a Uint8Array
      const binaryData = new Uint8Array(
        atob(fileData)
          .split("")
          .map((char) => char.charCodeAt(0)),
      );

      // Step 4: Perform the PUT request to the signed URL with binary data
      await axios.put(signedURL, binaryData, {
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Length": binaryData.length,
        },
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error setting profile picture:", error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    const syncStorage = async () => {
      if (token) {
        try {
          await setStorageItemAsync("token", token);
          await fetchUser();
        } catch {
          setToken(null);
          setUser(null);
        }
      } else {
        await setStorageItemAsync("token", null);
        setUser(null);
      }
    };

    const fetchInitialProfile = async () => {
      if (token) {
        try {
          await fetchProfile();
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    };

    const fetchInitialPreferences = async () => {
      if (token) {
        try {
          await fetchPreferences();
        } catch {
          setPreferences(null);
        }
      } else {
        setPreferences(null);
      }
    };

    syncStorage();
    fetchInitialProfile();
    fetchInitialPreferences();
  }, [fetchPreferences, fetchProfile, fetchUser, setToken, token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        preferences,
        expoPushToken,
        signIn,
        signOut,
        createAccount,
        fetchUser,
        fetchProfile,
        fetchPreferences,
        updateProfile,
        updatePreferences,
        verifyEmail,
        resendVerificationCode,
        forgotPassword,
        resetPassword,
        isLoading,
        requestPushNotificationPermission,
        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
