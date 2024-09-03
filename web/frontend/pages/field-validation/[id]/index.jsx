import React, { useState } from "react";
import {
  BlockStack,
  Box,
  Card,
  Collapsible,
  Page,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";
import { useNavigate } from "@shopify/app-bridge-react";
import { useAppContext } from "../../../context";
import { CustomAutoComplete, ValidationContainer } from "../../../components";
import { useAuthenticatedFetch } from "../../../hooks";

const CreateValidation = () => {
  const { loading, countries } = useAppContext();
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();

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
      if_block_selected: [],
    },
  });

  const handleCreateValidation = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

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
            <Box>
              <TextField
                label={
                  <Text variant="headingSm" fontWeight="medium">
                    Validation Title
                  </Text>
                }
                placeholder="title"
                value={formData.title}
                onChange={(value) => handleFormDataChange("title", value)}
              />
            </Box>
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
            <ValidationContainer
              title="First Name Validation"
              data={formData.first_name_validation}
              setData={(name, value) => {
                setFormData((prev) => {
                  return {
                    ...prev,
                    first_name_validation: {
                      ...prev.first_name_validation,
                      [name]: value,
                    },
                  };
                });
              }}
            />
            {/* <Card>
              <BlockStack>
                <Text variant="headingMd">First Name Validation</Text>
              </BlockStack>
            </Card> */}
          </BlockStack>
        </Card>
      </Page>
    </>
  );
};

export default CreateValidation;
