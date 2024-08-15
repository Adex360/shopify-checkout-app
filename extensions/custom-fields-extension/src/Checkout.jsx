import React, { useState, useEffect } from "react";
import {
  reactExtension,
  useSettings,
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
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <CustomFieldsExtension />
));

function CustomFieldsExtension() {
  // function CustomFieldsExtension({ target }) {
  const { form_name } = useSettings();
  // console.log("use settings ## ", useSettings());
  // console.log("target@@@@@", target);
  const [customFields, setCustomFields] = useState([]);
  const attributeKeys = customFields.flatMap((form) =>
    form.fields.map((f) => f.name)
  );
  const attributeValues = useAttributeValues(attributeKeys);
  const applyAttributeChange = useApplyAttributeChange();

  const CUSTOM_FIELDS_END_POINT =
    "https://seo-services-liver-accident.trycloudflare.com/api/v1/custom-fields/all";
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
  // console.log("customfields", customFields);
  // console.log("Attribute Values:", attributeValues);
  useEffect(() => {
    fetchCustomFields();
  }, []);

  const renderField = (field) => {
    const handleChange = (value) => {
      // console.log("Selected value:", value);
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
        .filter((form) => form.name === form_name)
        // .filter((form) => form.target === target)
        .map((customField) =>
          customField.fields.map((field) => renderField(field))
        )}
    </BlockStack>
  );
}
