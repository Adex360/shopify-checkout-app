import React, { useState, useEffect, useCallback } from "react";
import {
  reactExtension,
  Select,
  TextField,
  Popover,
  ChoiceList,
  ListItem,
  Banner,
  BlockStack,
  Button,
  Checkbox,
  Text,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  useCustomer,
  usePurchasingCompany,
  useExtensionApi,
  useAttributeValues,
  ScrollView,
  View,
  Pressable,
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <CityDropdown />
));

export function CityDropdown2() {
  console.log("ok city dropdown ");
  const CUSTOM_FIELDS_END_POINT =
<<<<<<< HEAD
    "https://4774-39-58-100-72.ngrok-free.app/api/v1/city-list/all";
=======
    "https://seo-services-liver-accident.trycloudflare.com/api/v1/city-list/all";
>>>>>>> b61bc853d4c39b267f5c947473cc18f0b2c79efe
  const requestHeader = {
    "Content-Type": "application/json",
  };

  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const attributeValues = useAttributeValues(["selectedCity"]);
  const applyAttributeChange = useApplyAttributeChange();
  const { shippingAddress, applyShippingAddressChange } = useExtensionApi();

  const fetchCustomFields = async () => {
    try {
      const response = await fetch(CUSTOM_FIELDS_END_POINT, {
        method: "GET",
        headers: requestHeader,
      });
      const data = await response.json();
      console.log("data???", data);
      setCityList(Array.isArray(data.getAll) ? data.getAll : []);
    } catch (error) {
      console.error("Error fetching city list:", error);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  const handleChange = async (value) => {
    const update = {
      type: "updateShippingAddress",
      address: {
        city: value,
      },
    };

    try {
      await applyShippingAddressChange(update);
      setSelectedCity(value);
      applyAttributeChange({
        key: "selectedCity",
        type: "updateAttribute",
        value: value,
      });
    } catch (error) {
      console.error("Error updating shipping address:", error);
    }
  };

  const filteredCities =
    shippingAddress?.current.countryCode && cityList.length > 0
      ? cityList.find(
          (country) =>
            country.country_name === shippingAddress.current.countryCode
        )?.city_list || []
      : [];
  console.log("filteredCities", filteredCities);

  return (
    <Select
      label="Select your city aaa"
      options={filteredCities.map((city) => ({ label: city, value: city }))}
      onChange={handleChange}
      value={selectedCity}
    />
  );
}

export function CityDropdown() {
  const CUSTOM_FIELDS_END_POINT =
<<<<<<< HEAD
    "https://4774-39-58-100-72.ngrok-free.app/api/v1/city-list/all";
=======
    "https://seo-services-liver-accident.trycloudflare.com/api/v1/city-list/all";
>>>>>>> b61bc853d4c39b267f5c947473cc18f0b2c79efe
  const requestHeader = { "Content-Type": "application/json" };

  const [cityList, setCityList] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const attributeValues = useAttributeValues(["selectedCity"]);
  const applyAttributeChange = useApplyAttributeChange();
  const { shippingAddress, applyShippingAddressChange } = useExtensionApi();

  const fetchCustomFields = async () => {
    try {
      const response = await fetch(CUSTOM_FIELDS_END_POINT, {
        method: "GET",
        headers: requestHeader,
      });
      const data = await response.json();
<<<<<<< HEAD
      console.log("data222222", data);
=======
      console.log("data", data);
>>>>>>> b61bc853d4c39b267f5c947473cc18f0b2c79efe
      setCityList(Array.isArray(data.getAll) ? data.getAll : []);
    } catch (error) {
      console.error("Error fetching city list:", error);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  useEffect(() => {
    if (shippingAddress?.current?.countryCode && cityList.length > 0) {
      const filteredCitiesValue =
        cityList.find(
          (country) =>
            country.country_name === shippingAddress.current.countryCode
        )?.city_list || [];

      setFilteredCities(filteredCitiesValue);
    }
  }, [shippingAddress, cityList]);
  console.log("filtered", filteredCities, isDropdownVisible);
  const handleInputChange = (value) => {
    setInputValue(value);
    setDropdownVisible(true);
  };

  const handlePress = () => {
    console.log("Pressable clicked");
  };
  const handleCitySelect = async (city) => {
    console.log("selectedd@@@", city);
    setInputValue(city);
    setDropdownVisible(false);
    try {
      await applyShippingAddressChange({
        type: "updateShippingAddress",
        address: { city: city },
      });
      applyAttributeChange({
        key: "selectedCity",
        type: "updateAttribute",
        value: city,
      });
    } catch (error) {
      console.error("Error updating shipping address:", error);
    }
  };

  return (
    <BlockStack>
      <TextField
        label="city ma"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setDropdownVisible(true)}
        // onBlur={() => setDropdownVisible(false)}
      />
      {isDropdownVisible && filteredCities.length > 0 && (
        // <ScrollView
        //   maxBlockSize="200px"
        //   border="base"
        //   cornerRadius="base"
        //   padding="base"
        //   background="light"
        //   onScroll={() => console.log("Scrolling...")}
        //   onScrolledToEdge={(event) => console.log("Reached edge@kk:", event)}
        // >
        <BlockStack>
          {filteredCities.map((city) => (
            // <Pressable
            //   key={city}
            //   onPress={
            //     // () => console.log("Pressable clicked")
            //     handlePress
            //     //  handleCitySelect(city)
            //   }
            // >
            //   <ListItem value={city}>{city}</ListItem>
            // </Pressable>
            <Button
              key={city}
              onClick={() => {
                console.log("Button clicked", city);
                handleCitySelect(city);
              }}
              style={{ padding: 10, borderBottom: "1px solid #ccc" }}
            >
              {city}
            </Button>
          ))}
        </BlockStack>
        // </ScrollView>
      )}
    </BlockStack>
  );
}
