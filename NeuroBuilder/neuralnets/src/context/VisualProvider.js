import { createContext, useContext, useState } from "react";

const visualContext = createContext();
function VisualProvider({ children }) {
  const [epo, setEpo] = useState(0);
  const [lay, setLay] = useState(0);
  const [type, setType] = useState("weights");
  return (
    <visualContext.Provider value={{ epo, setEpo, lay, setLay, type, setType }}>
      {children}
    </visualContext.Provider>
  );
}

function useVisualize() {
  const value = useContext(visualContext);
  if (!value) throw new Error("Using VisulContext outside");
  return value;
}
export { VisualProvider, useVisualize };
