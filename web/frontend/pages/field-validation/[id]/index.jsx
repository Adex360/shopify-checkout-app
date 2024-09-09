import React, { useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Page,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { useAppContext } from "../../../context";
import { CustomAutoComplete, ValidationContainer } from "../../../components";
import { useAuthenticatedFetch } from "../../../hooks";
import { useParams } from "react-router-dom";

const CreateValidation = () => {
  const { loading, countries, setLoading } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const [btnLoading, setBtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    country_name: "",
    enabled: true,
    first_name_validation: null,
    last_name_validation: null,
    address_validation: null,
  });
  const [enableValidation, setEnableValidation] = useState({
    first_name_validation: false,
    last_name_validation: false,
    address_validation: false,
  });

  const handleFormDataChange = (name, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const toggleEnableValidation = (name) => {
    const validationTypes = {
      first_name_validation: "first-name-validation",
      last_name_validation: "last-name-validation",
      address_validation: "address-name-validation",
    };
    setEnableValidation((prev) => {
      const value = prev[name];
      return {
        ...prev,
        [name]: !value,
      };
    });

    setFormData((prev) => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: null,
        };
      } else {
        return {
          ...prev,
          [name]: {
            type: validationTypes[name],
            limit_type: true,
            min_length: 1,
            max_length: 20,
            block_digits: true,
            block_sequential_character: false,
            special_character: "dont-block",
            if_block_selected: [],
          },
        };
      }
    });
  };

  const handleCreateValidation = async () => {
    try {
      setBtnLoading(true);
      const resp = await shopifyFetch(`/api/v1/validation/${id}`, {
        method: id === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();
      if (resp.ok) {
        setBtnLoading(false);
        show(data.message);
        navigate("/field-validation");
      } else {
        show(data.error.message, { isError: true });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const getFieldValidation = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch(`/api/v1/validation/${id}`);
      const data = await resp.json();
      if (resp.ok) {
        setFormData(data.getByID);
        setEnableValidation({
          first_name_validation: formData.first_name_validation ? true : false,
          last_name_validation: formData.last_name_validation ? true : false,
          address_validation: formData.address_validation ? true : false,
        });
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    id !== "create" && getFieldValidation();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
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
                  placeholder="Title"
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
                    handleFormDataChange("country_name", value[0]);
                  }}
                />
              )}
              <ValidationContainer
                enable={
                  enableValidation.first_name_validation ||
                  formData.first_name_validation
                }
                setEnable={() =>
                  toggleEnableValidation("first_name_validation")
                }
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
              <ValidationContainer
                title="Last Name Validation"
                enable={
                  enableValidation.last_name_validation ||
                  formData.last_name_validation
                }
                setEnable={() => toggleEnableValidation("last_name_validation")}
                data={formData.last_name_validation}
                setData={(name, value) => {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      last_name_validation: {
                        ...prev.last_name_validation,
                        [name]: value,
                      },
                    };
                  });
                }}
              />
              <ValidationContainer
                enable={
                  enableValidation.address_validation ||
                  formData.address_validation
                }
                setEnable={() => toggleEnableValidation("address_validation")}
                title="Address Validation"
                data={formData.address_validation}
                setData={(name, value) => {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      address_validation: {
                        ...prev.address_validation,
                        [name]: value,
                      },
                    };
                  });
                }}
              />
            </BlockStack>
          </Card>
          <Box paddingBlock="200">
            <InlineStack align="end">
              <Button
                onClick={() => {
                  handleCreateValidation(id);
                }}
                variant="primary"
                loading={btnLoading}
                disabled={!formData.title || !formData.country_name}
              >
                {id === "create" ? "Create" : "Update"}
              </Button>
            </InlineStack>
          </Box>
        </Page>
      )}
    </>
  );
};

export default CreateValidation;
