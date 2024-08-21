import { API_URL } from "./config/index.js";
import React, { useState, useEffect, useCallback } from "react";
import {
  useShop,
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
  ToggleButton,
  ToggleButtonGroup,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <CityDropdown />
));

export function CityDropdown2() {
  // only text field
  const { myshopifyDomain } = useShop();
  const CUSTOM_FIELDS_END_POINT = `${API_URL}/${myshopifyDomain}`;
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
      console.log("Fetched City List Data:", data);
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
            country.country_code === shippingAddress.current.countryCode
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
  const { myshopifyDomain } = useShop();
  const CUSTOM_FIELDS_END_POINT = `${API_URL}/${myshopifyDomain}`;
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
      console.log("Fetched City List Data:", data);
      setCityList(Array.isArray(data.getAll) ? data.getAll : []);
    } catch (error) {
      console.error("Error fetching City list:", error);
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
            country.country_code === shippingAddress.current.countryCode
        )?.city_list || [];
      console.log("filteredCitiesValue", filteredCitiesValue);
      setFilteredCities(filteredCitiesValue);
    }
  }, [shippingAddress, cityList]);
  console.log("filteredkk", filteredCities, isDropdownVisible);
  const handleInputChange = (value) => {
    setInputValue(value);
    setDropdownVisible(true);
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
        label="city search"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setDropdownVisible(true)}
        // onBlur={() => setDropdownVisible(false)}
      />
      {isDropdownVisible && filteredCities.length > 0 && (
        <ScrollView
          maxBlockSize={200}
          border="base"
          cornerRadius="base"
          padding="base"
          background="transparent"
          direction="block"
          display="auto"
          hint="innerShadow"
          onScroll={() => console.log("Scrolling...")}
          onScrolledToEdge={(event) => console.log("Reached edge@kk:", event)}
        >
          <ToggleButtonGroup
            value={selectedCity}
            onChange={(value) => {
              console.log("togglebutton clicked", value);
              handleCitySelect(value);
            }}
          >
            {filteredCities.map((city, index) => (
              <BlockStack>
                <ToggleButton id={city} key={city}>
                  <Text>{city}</Text>
                </ToggleButton>
              </BlockStack>
            ))}
          </ToggleButtonGroup>
        </ScrollView>
      )}
    </BlockStack>
  );
  // return (
  //   <BlockStack>
  //     <TextField
  //       label="city search"
  //       value={inputValue}
  //       onChange={handleInputChange}
  //       onFocus={() => setDropdownVisible(true)}
  //       // onBlur={() => setDropdownVisible(false)}
  //     />
  //     {isDropdownVisible && filteredCities.length > 0 && (
  //       <ScrollView
  //         maxBlockSize="200px"
  //         border="base"
  //         cornerRadius="base"
  //         padding="base"
  //         background="transparent"
  //         direction="block"
  //         display="auto"
  //         hint="innerShadow"
  //         onScroll={() => console.log("Scrolling...")}
  //         onScrolledToEdge={(event) => console.log("Reached edge@kk:", event)}
  //       >
  //         <BlockStack>
  //           {filteredCities.map((city) => (
  //             // <Pressable
  //             //   key={city}
  //             //   onPress={
  //             //     // () => console.log("Pressable clicked")
  //             //     handlePress
  //             //     //  handleCitySelect(city)
  //             //   }
  //             // >
  //             //   <ListItem value={city}>{city}</ListItem>
  //             // </Pressable>
  //             <Button
  //               key={city}
  //               onClick={() => {
  //                 console.log("Button clicked", city);
  //                 handleCitySelect(city);
  //               }}
  //               style={{ padding: 10, borderBottom: "1px solid #ccc" }}
  //             >
  //               {city}
  //             </Button>
  //           ))}
  //         </BlockStack>
  //       </ScrollView>
  //     )}
  //   </BlockStack>
  // );
}
