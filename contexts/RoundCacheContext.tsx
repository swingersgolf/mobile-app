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
  clearCache: () => void;
  resetRound: (roundId: string) => void;
  refreshCache: (fetchedRounds: RoundDetails[]) => void; // Add refreshCache
}

const RoundCacheContext = createContext<RoundCacheContextType | undefined>(
  undefined,
);

export const RoundCacheProvider = ({ children }: { children: ReactNode }) => {
  const [roundCache, setRoundCache] = useState<Map<string, RoundDetails>>(
    new Map(),
  );

  const clearCache = () => {
    setRoundCache(new Map());
  };

  const resetRound = (roundId: string) => {
    setRoundCache((prevCache) => {
      const updatedCache = new Map(prevCache);
      updatedCache.delete(roundId);
      return updatedCache;
    });
  };

  // Add refreshCache method to update only changed or new rounds
  const refreshCache = (fetchedRounds: RoundDetails[]) => {
    setRoundCache((prevCache) => {
      const updatedCache = new Map(prevCache);
      fetchedRounds.forEach((round) => {
        updatedCache.set(round.id.toString(), round);
      });
      return updatedCache;
    });
  };

  return (
    <RoundCacheContext.Provider
      value={{
        roundCache,
        setRoundCache,
        clearCache,
        resetRound,
        refreshCache,
      }}
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
