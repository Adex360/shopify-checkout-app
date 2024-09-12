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
  useApi,
  useShippingAddress,
  useInstructions,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <CityDropdown />
));

export function CityDropdown() {
  const instructions = useInstructions();
  const { myshopifyDomain } = useShop();
  const CUSTOM_FIELDS_END_POINT = `${API_URL}/${myshopifyDomain}`;
  const requestHeader = { "Content-Type": "application/json" };

  const [cityList, setCityList] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const applyAttributeChange = useApplyAttributeChange();
  const shippingAddressValue = useShippingAddress();
  const { applyShippingAddressChange } = useApi();
  const fetchCityList = async () => {
    try {
      let url = CUSTOM_FIELDS_END_POINT;
      const response = await fetch(url, {
        method: "GET",
        headers: requestHeader,
      });
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
    if (shippingAddressValue?.countryCode && cityList.length > 0) {
      const selectedCountry = cityList.find(
        (country) => country.country_code === shippingAddressValue?.countryCode
      );
      if (selectedCountry) {
        const filteredCitiesValue = selectedCountry.city_list.map(
          (city) => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
        );
        setFilteredCities(filteredCitiesValue);
      } else {
        setFilteredCities([]);
      }
    }
  }, [shippingAddressValue, cityList]);

  const handleInputChange = (value) => {
    setInputValue(value);
    setDropdownVisible(true);
    const selectedCountry = cityList.find(
      (country) => country.country_code === shippingAddressValue?.countryCode
    );
    if (selectedCountry) {
      const filteredCities = selectedCountry.city_list.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(
        filteredCities.length > 0 ? filteredCities : selectedCountry.city_list
      );
    }
  };

  const handleCitySelect = async (city) => {
    setInputValue(city);
    setDropdownVisible(false);
    try {
      if (
        instructions.delivery.canSelectCustomAddress &&
        instructions.attributes.canUpdateAttributes
      ) {
        await applyShippingAddressChange({
          type: "updateShippingAddress",
          address: { city },
        });
        applyAttributeChange({
          key: "selectedCity",
          type: "updateAttribute",
          value: city,
        });
      }
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
