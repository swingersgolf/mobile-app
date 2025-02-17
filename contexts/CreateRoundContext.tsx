import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import {
  useForm,
  FieldErrors,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import { capitalizeWords } from "@/utils/text";

interface RoundFormData {
  golfCourse?: string;
  date?: string;
  time_range?: "early_bird" | "morning" | "afternoon" | "twilight";
  slots?: string;
  preferences?: Record<string, "preferred" | "disliked" | "indifferent">;
}

interface CreateRoundContextType {
  formData: RoundFormData;
  setFormData: (data: Partial<RoundFormData>) => void;
  isDetailsFilled: () => boolean;
  isPreferencesFilled: () => boolean;
  preferencesList: { id: string; label: string }[]; // Added preferencesList to the context
  preferences:
    | Record<string, "preferred" | "disliked" | "indifferent">
    | undefined; // Added preferences to the context
  createRound: () => Promise<void>;
  resetForm: () => void;
  reset: () => void;
  setValue: UseFormSetValue<RoundFormData>;
  handleSubmit: (callback: (data: RoundFormData) => void) => void;
  control: Control<RoundFormData>; // React Hook Form control
  errors: FieldErrors; // React Hook Form errors
  fetchPreferences: () => void; // Exposing fetchPreferences for manual call
}

const CreateRoundContext = createContext<CreateRoundContextType | undefined>(
  undefined,
);

export const CreateRoundProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const [formData, setFormDataState] = useState<RoundFormData>({});
  const [preferencesList, setPreferencesList] = useState<
    { id: string; label: string }[]
  >([]);

  const fetchPreferences = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/preference`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedPreferences = response.data.data.map(
        (preference: { id: string; name: string }) => ({
          id: preference.id.toString(),
          label: capitalizeWords(preference.name),
        }),
      );
      setPreferencesList(formattedPreferences);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          error.response.data.message || "Failed to fetch preferences.",
        );
      } else {
        console.error("An unexpected error occurred. Please try again.");
      }
    }
  }, [apiUrl, token]);

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  const setFormData = (data: Partial<RoundFormData>) => {
    setFormDataState((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });
  };

  const isDetailsFilled = () => {
    return (
      !!formData.golfCourse &&
      !!formData.date &&
      !!formData.time_range &&
      !!formData.slots
    );
  };

  const isPreferencesFilled = () => {
    return preferencesList.every(
      (preference) => formData.preferences?.[preference.id] !== undefined,
    );
  };

  const createRound = async () => {
    if (!isDetailsFilled() || !isPreferencesFilled()) {
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/v1/round`,
        {
          date: formData.date,
          time_range: formData.time_range,
          group_size: formData.slots,
          course_id: formData.golfCourse,
          preferences: formData.preferences,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      resetForm();
      if (router.canDismiss()) router.dismissAll();
      router.replace({
        pathname: "/(home)/(round)/details",
        params: { roundId: response.data.data.id },
      });
    } catch (error) {
      console.error("Error creating round", error);
    }
  };

  const resetForm = useMemo(() => {
    return () => {
      setFormDataState({});
      reset();
    };
  }, [reset]);

  return (
    <CreateRoundContext.Provider
      value={{
        formData,
        setFormData,
        isDetailsFilled,
        isPreferencesFilled,
        preferencesList,
        preferences: formData.preferences,
        createRound,
        resetForm,
        reset,
        setValue,
        handleSubmit,
        control,
        errors,
        fetchPreferences, // Exposing fetchPreferences in the context
      }}
    >
      {children}
    </CreateRoundContext.Provider>
  );
};

export const useCreateRound = () => {
  const context = useContext(CreateRoundContext);
  if (!context) {
    throw new Error("useCreateRound must be used within a CreateRoundProvider");
  }
  return context;
};
