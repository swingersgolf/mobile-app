import { createContext, useContext, useState, ReactNode } from "react";

type RoundContextType = {
  isMember: boolean;
  messageGroupId: number | null; // New messageId property
  setIsMember: (status: boolean) => void;
  setMessageGroupId: (id: number | null) => void; // Function to set messageId
};

const RoundContext = createContext<RoundContextType | undefined>(undefined);

export const RoundProvider = ({ children }: { children: ReactNode }) => {
  const [isMember, setIsMember] = useState<boolean>(false); // Default to false
  const [messageGroupId, setMessageGroupId] = useState<number | null>(null); // New messageId state

  return (
    <RoundContext.Provider
      value={{
        isMember,
        messageGroupId,
        setIsMember,
        setMessageGroupId,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};

export const useRound = () => {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error("useRound must be used within a RoundProvider");
  }
  return context;
};
