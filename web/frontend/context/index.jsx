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
  const [disabledCountriesPhone, setDisabledCountriesPhone] = useState([]);
  const [disabledCountriesField, setDisabledCountriesField] = useState([]);
  const [disabledCountriesCityList, setDisabledCountriesCityList] = useState(
    []
  );

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

  const getShopCountries = async () => {
    setLoading(true);
    try {
      const resp = await shopifyFetch("/api/v1/shop/countries");
      const data = await resp.json();
      if (resp.ok) {
        setCountries(data.enabledCountries);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getShop();
    getShopCountries();
  }, []);

  const contextValues = {
    shop,
    loading,
    setLoading,
    isSubscribed,
    countries,
    disabledCountriesField,
    disabledCountriesPhone,
    disabledCountriesCityList,
    setDisabledCountriesField,
    setDisabledCountriesPhone,
    setDisabledCountriesCityList,
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
