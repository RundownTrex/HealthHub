import { createContext, useContext, useState } from 'react';

const BottomSheetContext = createContext();

export const useBottomSheet = () => useContext(BottomSheetContext);

export const BottomSheetProvider = ({ children }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const toggleBottomSheet = (isOpen) => {
    setIsBottomSheetOpen(isOpen);
  };

  return (
    <BottomSheetContext.Provider value={{ isBottomSheetOpen, toggleBottomSheet }}>
      {children}
    </BottomSheetContext.Provider>
  );
};
