import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const shopifyFetch = useAuthenticatedFetch();
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState({});

  const getShop = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("/api/v1/shop");
      const data = await resp.json();
      if (resp.ok) {
        setShop(data);
        setLoading(false);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getShop();
  }, []);

  const contextValues = {
    shop,
    loading,
    setLoading,
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
