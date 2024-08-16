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
  TextBlock,
  Heading,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <CustomFieldsExtension />
));

function CustomFieldsExtension() {
  const { form_name } = useSettings();
  const [customFields, setCustomFields] = useState([]);
  const attributeKeys = customFields.flatMap((form) =>
    form.fields.map((f) => f.name)
  );
  const attributeValues = useAttributeValues(attributeKeys);
  const applyAttributeChange = useApplyAttributeChange();

  const CUSTOM_FIELDS_END_POINT =
    "https://scientist-negotiation-instrumentation-guidance.trycloudflare.com/api/v1/custom-fields/all";
  const requestHeader = {
    "Content-Type": "application/json",
  };
  const sizeToLevel = {
    large: 1,
    medium: 2,
    small: 3,
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
      console.error("Error Fetching Custom Fields:", error);
    }
  };
  // console.log("attributeValues[field.name]aaa", attributeValues);

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
    const fieldWidth = field.field_width === "half" ? "50%" : "100%";
    switch (field.type) {
      case "text":
        return (
          <BlockStack key={field.name} maxInlineSize={fieldWidth}>
            <TextField
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              onChange={handleChange}
              value={attributeValues[field.name] || ""}
            />
          </BlockStack>
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
          <BlockStack key={field.name} maxInlineSize={fieldWidth}>
            <Divider
              key={field.name}
              size={field.field_size}
              alignment={field.field_width === "half" ? "start" : "center"}
              direction="inline"
            />
          </BlockStack>
        );
      case "number":
        return (
          <BlockStack key={field.name} maxInlineSize={fieldWidth}>
            <TextField
              key={field.name}
              type="number"
              label={field.label}
              onChange={handleChange}
              value={attributeValues[field.name] || ""}
            />
          </BlockStack>
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
            onChange={(value) => handleChange(value)}
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
          <BlockStack key={field.name} maxInlineSize={fieldWidth}>
            <DateField
              key={field.name}
              label={field.label}
              value={attributeValues[field.name] || ""}
              onChange={(value) => handleChange(value)}
            />
          </BlockStack>
        );
      case "textBlock":
        return (
          <TextBlock
            key={field.name}
            size={field.size}
            emphasis={field.font_style || "normal"}
            inlineAlignment={field.text_alignment}
            appearance={field.color}
          >
            {field.content}
          </TextBlock>
        );
      case "heading":
        return (
          <Heading
            key={field.name}
            content={field.content}
            level={sizeToLevel[field.size] || 1}
            inlineAlignment={field.text_alignment}
          >
            {field.content}
          </Heading>
        );

      default:
        return null;
    }
  };

  return (
    <BlockStack>
      {customFields
        .filter((form) => form.title === form_name)
        .map((customField) =>
          customField.fields.map((field) => renderField(field))
        )}
    </BlockStack>
  );
}
