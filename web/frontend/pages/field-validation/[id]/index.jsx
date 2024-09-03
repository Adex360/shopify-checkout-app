import React, { useState } from "react";
import {
  BlockStack,
  Card,
  Collapsible,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { useNavigate } from "@shopify/app-bridge-react";
import { useAppContext } from "../../../context";
import { CustomAutoComplete } from "../../../components";

const CreateValidation = () => {
  const { loading, countries } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "all",
    country_name: "US",
    enabled: true,
    first_name_validation: {
      type: "first-name-validation",
      limit_type: true,
      min_length: 2,
      max_length: 10,
      block_digits: true,
      block_sequential_character: true,
      special_character: "dont-block",
    },
    last_name_validation: {
      type: "last-name-validation",
      limit_type: true,
      min_length: 1,
      max_length: 10,
      block_digits: true,
      block_sequential_character: true,
      special_character: "block-all",
    },
    address_validation: {
      type: "address-name-validation",
      limit_type: true,
      min_length: 1,
      max_length: 5,
      block_digits: true,
      block_sequential_character: true,
      special_character: "block-selective",
      if_block_selectective: ["@"],
    },
  });

  const handleFormDataChange = (name, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <>
      <Page
        title="Add Field Validations"
        backAction={{
          onAction: () => navigate("/field-validation"),
        }}
        primaryAction={{
          content: formData.enabled === true ? "Turn off" : "Turn on",
          destructive: formData.enabled === true,
          onAction: () => {
            handleFormDataChange("enabled", !formData.enabled);
          },
        }}
      >
        <Card>
          <BlockStack gap="400">
            {loading ? (
              <Spinner size="small" />
            ) : (
              <CustomAutoComplete
                label={<Text variant="headingMd">Select Country</Text>}
                placeholder="Search Country "
                selectionOptions={countries}
                selectedOptions={[formData.country_name] || []}
                setSelectedOptions={(value) => {
                  console.log(value);
                  handleFormDataChange("country_name", value[0]);
                  console.log(formData);
                }}
              />
            )}
            <Card>
              <BlockStack>
                <Text variant="headingMd">First Name Validation</Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </Card>
      </Page>
    </>
  );
};

export default CreateValidation;
