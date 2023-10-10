// LayoutContext.js
import { createContext, useState, useCallback } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);

  const toggleHeader = useCallback(() => {
    setShowHeader(prevShowHeader => !prevShowHeader);
  }, []);

  return (
    <LayoutContext.Provider value={{ showHeader, toggleHeader }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
