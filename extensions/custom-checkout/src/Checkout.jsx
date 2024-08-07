import React, { useState, useEffect } from "react";
import {
  reactExtension,
  Banner,
  useSettings,
  useApi,
  TextField,
  BlockStack,
  Checkbox,
  Select,
  useApplyAttributeChange,
  useAttributeValues,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from "@shopify/ui-extensions-react/checkout";
import { useDeliveryGroupListTarget } from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <CustomBanner />
));

export const deliveryAddress = reactExtension(
  "purchase.checkout.delivery-address.render-before",
  () => <CustomBanner />
);
export const footerAfter = reactExtension(
  "purchase.checkout.footer.render-after",
  () => <CustomBanner />
);
export const shippingOptionAfter = reactExtension(
  "purchase.checkout.shipping-option-list.render-after",
  () => <CustomField />
);
export const contactAfter = reactExtension(
  "purchase.checkout.contact.render-after",
  () => <CitydownCountryName />
);

function CustomBanner() {
  const {
    title: merchantTitle,
    description,
    collapsible,
    status: merchantStatus,
  } = useSettings();

  const status = merchantStatus ?? "info";
  const title = merchantTitle ?? "Custom Banner";

  return (
    <Banner title={title} status={status} collapsible={collapsible}>
      {description}
    </Banner>
  );
}
function CustomField() {
  const [checked, setChecked] = useState(false);

  const attributeKey = "deliveryInstructions";

  const attributeValues = useAttributeValues([attributeKey]);

  console.log("attribute values ", attributeValues);
  const deliveryInstructions =
    attributeValues[attributeKey] || "delivery instructions ";

  // Function to update the attribute
  const applyAttributeChange = useApplyAttributeChange();

  // Guard against duplicate rendering of `shipping-option-list.render-after` target for one-time purchase and subscription sections
  // const deliveryGroupList = useDeliveryGroupListTarget();
  // if (!deliveryGroupList || deliveryGroupList.groupType !== "oneTimePurchase") {
  //   return null;
  // }

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
        Provide delivery instructions
      </Checkbox>
      {checked && (
        <TextField
          label="Delivery instructions"
          multiline={3}
          onChange={(value) => {
            applyAttributeChange({
              key: attributeKey,
              type: "updateAttribute",
              value: value,
            });
          }}
          value={deliveryInstructions}
        />
      )}
    </BlockStack>
  );
}

function Validation() {
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [validationErrors, setValidationErrors] = useState({});

  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  const canBlockProgress = useExtensionCapability("block_progress");

  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    const errors = validateFields();

    if (canBlockProgress && Object.keys(errors).length > 0) {
      return {
        behavior: "block",
        reason: "Validation errors",
        errors: Object.values(errors).map((error) => ({
          message: error,
        })),
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        setValidationErrors({});
      },
    };
  });

  function validateFields() {
    const errors = {};
    if (!isValidPhone(phone)) errors.phone = "Enter a valid phone number";
    if (!firstName) errors.firstName = "Enter your first name";
    if (!lastName) errors.lastName = "Enter your last name";
    if (!isValidZipCode(zipCode)) errors.zipCode = "Enter a valid zip code";

    setValidationErrors(errors);
    return errors;
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/; // Simple regex for a 10-digit phone number
    return phoneRegex.test(phone);
  }

  function isValidZipCode(zipCode) {
    const zipCodeRegex = /^[0-9]{5}$/; // Simple regex for a 5-digit US zip code
    return zipCodeRegex.test(zipCode);
  }

  return (
    <>
      <TextField
        label="Phone Number"
        type="text"
        value={phone}
        onChange={setPhone}
        onInput={() => setValidationErrors({ ...validationErrors, phone: "" })}
        required={canBlockProgress}
        error={validationErrors.phone}
      />
      <TextField
        label="First Name"
        type="text"
        value={firstName}
        onChange={setFirstName}
        onInput={() =>
          setValidationErrors({ ...validationErrors, firstName: "" })
        }
        required={canBlockProgress}
        error={validationErrors.firstName}
      />
      <TextField
        label="Last Name"
        type="text"
        value={lastName}
        onChange={setLastName}
        onInput={() =>
          setValidationErrors({ ...validationErrors, lastName: "" })
        }
        required={canBlockProgress}
        error={validationErrors.lastName}
      />
      <TextField
        label="Zip Code"
        type="text"
        value={zipCode}
        onChange={setZipCode}
        onInput={() =>
          setValidationErrors({ ...validationErrors, zipCode: "" })
        }
        required={canBlockProgress}
        error={validationErrors.zipCode}
      />
    </>
  );
}

function CitydownCountryName() {
  const CITY_END_POINT = "https://countriesnow.space/api/v0.1/countries/cities";
  const requestHeader = {
    "Content-Type": "application/json",
  };
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCities = async (countryCode) => {
    if (countryCode) {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${CITY_END_POINT}`, {
          method: "POST",
          headers: requestHeader,
          body: JSON.stringify({ country: countryCode }),
        });
        const data = await response.json();
        setCities(data.data || []);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load cities");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const countryCode = "pakistan";

    // const countryCodeElement = document.querySelector(
    //   'select[name="countryCode"]',
    // );
    // if (countryCodeElement) {
    // setSelectedCountryCode(countryCodeElement.value);
    // fetchCities(countryCodeElement.value);
    setSelectedCountryCode(countryCode);
    fetchCities(countryCode);
    // }
  }, []);

  // Handle city selection change
  const handleCityChange = (value) => {
    console.log("Selected city:", value);
  };

  return (
    <>
      <Select
        label="City"
        options={cities.map((city) => ({ label: city, value: city }))}
        onChange={handleCityChange}
        disabled={loading}
      />
    </>
  );
}
