import { createContext } from "react";

interface DashBoardContext {
  activeContronIds: string[];
  setActiveContronIds: (ids: string[]) => void;
}

const DashBoardContext = createContext<DashBoardContext>({
  activeContronIds: [],
  setActiveContronIds: () => {},
});

export default DashBoardContext;
