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
}

const RoundCacheContext = createContext<RoundCacheContextType | undefined>(
  undefined,
);

export const RoundCacheProvider = ({ children }: { children: ReactNode }) => {
  const [roundCache, setRoundCache] = useState<Map<string, RoundDetails>>(
    new Map(),
  );

  return (
    <RoundCacheContext.Provider value={{ roundCache, setRoundCache }}>
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
