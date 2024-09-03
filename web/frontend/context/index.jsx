import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { useNavigate } from "@shopify/app-bridge-react";

const AppContext = createContext();
const AppContextProvider = ({ children }) => {
  const shopifyFetch = useAuthenticatedFetch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [shop, setShop] = useState({});
  const [countries, setCountries] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const getShop = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("/api/v1/shop");
      const data = await resp.json();
      if (resp.ok) {
        setShop(data);
        setLoading(false);
        data.plan_status === "active"
          ? setIsSubscribed(true)
          : navigate("/plans");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCountries = async () => {
    try {
      setLoading(true);
      const resp = await fetch("https://countriesnow.space/api/v0.1/countries");
      const data = await resp.json();
      if (resp.ok) {
        setLoading(false);
        const countryArr = [];
        data.data?.forEach((country) => {
          countryArr.push({
            label: country.country,
            value: country.iso2,
          });
        });
        console.log(countryArr);
        setCountries(countryArr);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getShop();
    getCountries();
  }, []);

  const contextValues = {
    shop,
    loading,
    setLoading,
    isSubscribed,
    countries,
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
