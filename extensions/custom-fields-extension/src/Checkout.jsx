// import {
//   reactExtension,
//   Banner,
//   BlockStack,
//   Checkbox,
//   Text,
//   useApi,
//   useApplyAttributeChange,
//   useInstructions,
//   useTranslate,
// } from "@shopify/ui-extensions-react/checkout";

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
  Divider,
  ChoiceList,
  DateField,
  Choice,
  useApplyAttributeChange,
  useAttributeValues,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from "@shopify/ui-extensions-react/checkout";
import { useDeliveryGroupListTarget } from "@shopify/ui-extensions-react/checkout";

// // 1. Choose an extension target
// export default reactExtension("purchase.checkout.block.render", () => (
//   // <CustomBanner />
//   <CitydownCountryName />
// ));
// export const beforedeliveryAddress = reactExtension(
//   "purchase.checkout.delivery-address.render-before",
//   // () => <CitydownCountryName />
//   // () => <CustomField />
//   // () => <CustomFieldsExtension />
//   // () => <CustomFieldWithAttributeDynamic />
//   () => <CustomFieldWIthDateSelect />
// );

// export const afterdeliveryAddress = reactExtension(
//   "purchase.checkout.delivery-address.render-after",
//   () => <CustomFieldWIthDateSelect />
// );

// export const contactAfter = reactExtension(
//   "purchase.checkout.contact.render-after",
//   () => <CitydownCountryName />
// );

// new code
// Main extension for 'at-top'
export default reactExtension("purchase.checkout.block.render", () => (
  <CustomFieldsExtension target="at-top" />
));

// Extension for rendering before the delivery address form
export const beforeDeliveryAddress = reactExtension(
  "purchase.checkout.delivery-address.render-before",
  () => <CustomFieldsExtension target="before-address" />
);

// Extension for rendering after the delivery address form
export const afterDeliveryAddress = reactExtension(
  "purchase.checkout.delivery-address.render-after",
  () => <CustomFieldsExtension target="after-address" />
);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();

  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <Banner title="custom-fields-extension" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Render a UI
  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      <Banner title="custom-fields-extension">
        {translate("welcome", {
          target: <Text emphasis="italic">{extension.target}</Text>,
        })}
      </Banner>
      <Checkbox onChange={onCheckboxChange}>
        {translate("iWouldLikeAFreeGiftWithMyOrder")}
      </Checkbox>
    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    // 4. Call the API to modify checkout
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result);
  }
}

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

// function CustomField() {
//   const [checked, setChecked] = useState(false);

//   const attributeKey = "deliveryInstructions";

//   const attributeValues = useAttributeValues([attributeKey]);

//   console.log("attribute values ", attributeValues);
//   const deliveryInstructions =
//     attributeValues[attributeKey] || "delivery instructions ";

//   // Function to update the attribute
//   const applyAttributeChange = useApplyAttributeChange();

//   // Guard against duplicate rendering of `shipping-option-list.render-after` target for one-time purchase and subscription sections
//   // const deliveryGroupList = useDeliveryGroupListTarget();
//   // if (!deliveryGroupList || deliveryGroupList.groupType !== "oneTimePurchase") {
//   //   return null;
//   // }

//   const handleChange = () => {
//     setChecked(!checked);
//   };

//   const CUSTOM_FIELDS_END_POINT =
//     "https://understood-madagascar-nissan-concluded.trycloudflare.com/api/v1/custom-fields/all";
//   const requestHeader = {
//     "Content-Type": "application/json",
//   };
//   const fetchCustomFields = async () => {
//     try {
//       const response = await fetch(`${CUSTOM_FIELDS_END_POINT}`, {
//         method: "GET",
//         headers: requestHeader,
//       });
//       const data = await response.json();
//       console.log("custom fields  data ", data);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       // setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchCustomFields();
//   }, []);

//   return (
//     <BlockStack>
//       <Checkbox checked={checked} onChange={handleChange}>
//         Provide delivery instructions
//       </Checkbox>
//       {checked && (
//         <TextField
//           label="Delivery instructions"
//           multiline={3}
//           onChange={(value) => {
//             applyAttributeChange({
//               key: attributeKey,
//               type: "updateAttribute",
//               value: value,
//             });
//           }}
//           value={deliveryInstructions}
//         />

//       )}
//     </BlockStack>
//   );
// }

// working here

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

function CustomFieldWIthDateSelect() {
  const [checked, setChecked] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const attributeKeys = customFields.flatMap((field) =>
    field.fields.map((f) => f.name)
  );
  const attributeValues = useAttributeValues(attributeKeys);
  const applyAttributeChange = useApplyAttributeChange();

  const handleChange = () => {
    setChecked(!checked);
  };

  const CUSTOM_FIELDS_END_POINT =
    "https://quizzes-century-developing-sister.trycloudflare.com/api/v1/custom-fields/all";
  const requestHeader = {
    "Content-Type": "application/json",
  };

  const fetchCustomFields = async () => {
    try {
      const response = await fetch(`${CUSTOM_FIELDS_END_POINT}`, {
        method: "GET",
        headers: requestHeader,
      });
      const data = await response.json();
      setCustomFields(Array.isArray(data.getAll) ? data.getAll : []);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  console.log("custom fields :", customFields);
  useEffect(() => {
    fetchCustomFields();
  }, []);

  const renderField = (field) => {
    const handleChange = (value) => {
      applyAttributeChange({
        key: field.name,
        type: "updateAttribute",
        value: value,
      });
    };

    switch (field.type) {
      case "text":
        return (
          <TextField
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            onChange={handleChange}
            value={attributeValues[field.name] || ""}
            multiline={3}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            key={field.name}
            checked={attributeValues[field.name] === "true"}
            onChange={(checked) => handleChange(checked ? "true" : "false")}
          >
            {field.label}
          </Checkbox>
        );
      case "divider":
        return (
          <Divider
            key={field.name}
            size={field.field_size}
            alignment={field.field_width === "half" ? "start" : "center"}
            direction="inline"
          />
        );
      case "number":
        return (
          <TextField
            key={field.name}
            type="number"
            label={field.label}
            onChange={handleChange}
            value={attributeValues[field.name] || ""}
          />
        );
      case "select":
        return (
          <Select
            key={field.name}
            label={field.label}
            options={field.options.map((option, index) => ({
              value: option,
              label: option,
            }))}
            onChange={handleChange}
            value={attributeValues[field.name] || field.options[0]}
          />
        );

      case "radio":
        return (
          <ChoiceList
            key={field.name}
            name={field.name}
            variant="group"
            value={attributeValues[field.name] || ""}
            onChange={(value) => handleChange(value)}
          >
            {field.options.map((option) => (
              <Choice id={option} key={option}>
                {option}
              </Choice>
            ))}
          </ChoiceList>
        );
      case "date":
        return (
          <DateField
            key={field.name}
            label={field.label}
            value={attributeValues[field.name] || ""}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
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
              key: "deliveryInstructions",
              type: "updateAttribute",
              value: value,
            });
          }}
          value={attributeValues["deliveryInstructions"] || ""}
        />
      )}

      {customFields.map((customField) =>
        customField.fields.map((field) => renderField(field))
      )}
    </BlockStack>
  );
}

function CustomFieldsExtension({ target }) {
  console.log("target@@@@@", target);
  const [customFields, setCustomFields] = useState([]);
  const attributeKeys = customFields.flatMap((form) =>
    form.fields.map((f) => f.name)
  );
  const attributeValues = useAttributeValues(attributeKeys);
  const applyAttributeChange = useApplyAttributeChange();

  const CUSTOM_FIELDS_END_POINT =
    "https://quizzes-century-developing-sister.trycloudflare.com/api/v1/custom-fields/all";
  const requestHeader = {
    "Content-Type": "application/json",
  };

  const fetchCustomFields = async () => {
    try {
      const response = await fetch(`${CUSTOM_FIELDS_END_POINT}`, {
        method: "GET",
        headers: requestHeader,
      });
      const data = await response.json();
      setCustomFields(Array.isArray(data.getAll) ? data.getAll : []);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  console.log("customfields", customFields);
  console.log("Attribute Values:", attributeValues); // Debugging line
  useEffect(() => {
    fetchCustomFields();
  }, []);

  const renderField = (field) => {
    const handleChange = (value) => {
      console.log("Selected value:", value); // Debugging line
      applyAttributeChange({
        key: field.name,
        type: "updateAttribute",
        value: value,
      });
    };

    switch (field.type) {
      case "text":
        return (
          <TextField
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            onChange={handleChange}
            value={attributeValues[field.name] || ""}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            key={field.name}
            checked={attributeValues[field.name] === "true"}
            onChange={(checked) => handleChange(checked ? "true" : "false")}
          >
            {field.label}
          </Checkbox>
        );
      case "divider":
        return (
          <Divider
            key={field.name}
            size={field.field_size}
            alignment={field.field_width === "half" ? "start" : "center"}
            direction="inline"
          />
        );
      case "number":
        return (
          <TextField
            key={field.name}
            type="number"
            label={field.label}
            onChange={handleChange}
            value={attributeValues[field.name] || ""}
          />
        );
      case "select":
        return (
          <Select
            key={field.name}
            label={field.label}
            options={field.options.map((option) => ({
              value: option,
              label: option,
            }))}
            onChange={handleChange}
            value={attributeValues[field.name] || field.options[0]}
          />
        );
      case "radio":
        return (
          <ChoiceList
            key={field.name}
            name={field.name}
            variant="group"
            value={attributeValues[field.name] || ""}
            onChange={(value) => handleChange(value)}
          >
            {field.options.map((option) => (
              <Choice id={option} key={option}>
                {option}
              </Choice>
            ))}
          </ChoiceList>
        );
      case "date":
        return (
          <DateField
            key={field.name}
            label={field.label}
            value={attributeValues[field.name] || ""}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BlockStack>
      {customFields
        .filter((form) => form.target === target)
        .map((customField) =>
          customField.fields.map((field) => renderField(field))
        )}
    </BlockStack>
  );
}
