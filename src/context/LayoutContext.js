// LayoutContext.js
import { createContext, useState} from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [selectedListItem, setSelectedListItem] = useState("");
  return (
    <LayoutContext.Provider value={{ selectedListItem, setSelectedListItem }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
