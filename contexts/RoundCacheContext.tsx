import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { RoundDetails } from "@/types/roundTypes";

interface RoundCacheContextType {
  roundCache: Map<string, RoundDetails>;
  setRoundCache: Dispatch<SetStateAction<Map<string, RoundDetails>>>;
  clearCache: () => void; // Method to clear the entire cache
  resetRound: (roundId: string) => void; // Method to reset a specific round
}

const RoundCacheContext = createContext<RoundCacheContextType | undefined>(
  undefined,
);

export const RoundCacheProvider = ({ children }: { children: ReactNode }) => {
  const [roundCache, setRoundCache] = useState<Map<string, RoundDetails>>(
    new Map(),
  );

  // Function to clear the entire cache
  const clearCache = () => {
    setRoundCache(new Map());
  };

  // Function to reset a specific round's cache
  const resetRound = (roundId: string) => {
    setRoundCache((prevCache) => {
      const updatedCache = new Map(prevCache);
      updatedCache.delete(roundId); // Remove specific round from cache
      return updatedCache;
    });
  };

  return (
    <RoundCacheContext.Provider
      value={{ roundCache, setRoundCache, clearCache, resetRound }}
    >
      {children}
    </RoundCacheContext.Provider>
  );
};

export const useRoundCache = (): RoundCacheContextType => {
  const context = useContext(RoundCacheContext);
  if (!context) {
    throw new Error("useRoundCache must be used within a RoundCacheProvider");
  }
  return context;
};
