import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState();
  const [shop, setShop] = useState({
    validations: [],
  });

  const contextValues = {
    validations,
    setValidations,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppContextProvider, useAppContext };
