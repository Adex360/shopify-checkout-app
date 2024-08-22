import { API_URL } from "./config/index.js";
import React, { useState, useEffect } from "react";
import {
  useShop,
  reactExtension,
  TextField,
  BlockStack,
  Text,
  useApplyAttributeChange,
  ScrollView,
  ToggleButton,
  ToggleButtonGroup,
  useBillingAddress,
  useApi,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <CityDropdown />
));

export function CityDropdown() {
  const billing = useBillingAddress();
  const { myshopifyDomain } = useShop();
  const CUSTOM_FIELDS_END_POINT = `${API_URL}/${myshopifyDomain}`;
  const requestHeader = { "Content-Type": "application/json" };

  const [cityList, setCityList] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const applyAttributeChange = useApplyAttributeChange();
  const { shippingAddress, applyShippingAddressChange } = useApi();

  const fetchCityList = async () => {
    try {
      const response = await fetch(
        `/apps/api/v1/city-list/all/${myshopifyDomain}`,
        {
          method: "GET",
          headers: requestHeader,
        }
      );
      const data = await response.json();
      setCityList(Array.isArray(data.getAll) ? data.getAll : []);
    } catch (error) {
      console.error("Error fetching City list:", error);
    }
  };

  useEffect(() => {
    fetchCityList();
  }, []);

  useEffect(() => {
    if (shippingAddress?.current?.countryCode && cityList.length > 0) {
      const selectedCountry = cityList.find(
        (country) => country.country_code === billing.countryCode
      );

      if (selectedCountry) {
        const filteredCitiesValue = selectedCountry.city_list || [];
        setFilteredCities(filteredCitiesValue);
      } else {
        setFilteredCities([]);
      }
    }
  }, [billing.countryCode, cityList, shippingAddress]);

  const handleInputChange = (value) => {
    setInputValue(value);
    setDropdownVisible(true);
    setFilteredCities((prevCities) =>
      prevCities.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleCitySelect = async (city) => {
    setInputValue(city);
    setDropdownVisible(false);
    try {
      await applyShippingAddressChange({
        type: "updateShippingAddress",
        address: { city },
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
      {filteredCities.length > 0 && (
        <>
          <TextField
            label="City Search"
            value={inputValue}
            onInput={handleInputChange}
            onChange={handleInputChange}
            onFocus={() => setDropdownVisible(true)}
          />
          {isDropdownVisible && (
            <ScrollView
              maxBlockSize={200}
              border="base"
              cornerRadius="base"
              padding="base"
              background="transparent"
              direction="block"
              display="auto"
            >
              <ToggleButtonGroup
                value={selectedCity}
                onChange={handleCitySelect}
              >
                {filteredCities.map((city, index) => (
                  <BlockStack key={index}>
                    <ToggleButton id={city}>
                      <Text>{city}</Text>
                    </ToggleButton>
                  </BlockStack>
                ))}
              </ToggleButtonGroup>
            </ScrollView>
          )}
        </>
      )}
    </BlockStack>
  );
}
