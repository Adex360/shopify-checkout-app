import React, { useEffect, useState } from "react";
import { SearchAndSelect } from "../../../components";
import { useAuthenticatedFetch } from "../../../hooks";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import {
  Banner,
  BlockStack,
  Box,
  TextField,
  Modal,
  Checkbox,
  Page,
  Card,
  Button,
  InlineStack,
  Spinner,
} from "@shopify/polaris";
import { useAppContext } from "../../../context";
import { useParams } from "react-router-dom";

const CreatePhoneValidation = () => {
  const { countries, loading, setLoading, disabledCountriesPhone } =
    useAppContext();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageLoadings, setPageLoadings] = useState({
    modalLoading: false,
    btnLoading: false,
  });

  // const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    enable: true,
    country: [],
    countryCode: "",
    networkCodeLength: "",
    phoneLength: "",
    errorMessage: "",
  });

  const handleFormDataChange = (name, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const changeLoading = (name, value) => {
    setPageLoadings((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const isFormDataValid = () => {
    return Object.values(formData).every((value) => {
      if (typeof value === "boolean") {
        return true; // Ignore boolean values in validation
      } else if (Array.isArray(value)) {
        return value.length > 0;
      } else {
        return value.trim() !== "";
      }
    });
  };

  const setPhoneValidation = async () => {
    const reqData = {
      title: formData.title,
      country_name: formData.country[0],
      enabled: formData.enable,
      phone_validation: {
        type: "phone-validation",
        country_name: formData.country[0],
        country_code: formData.countryCode.split(","),
        network_code: formData.networkCodeLength,
        phone_no_length: formData.phoneLength,
        error_message: formData.errorMessage,
      },
    };
    try {
      changeLoading("btnLoading", true);
      const resp = await shopifyFetch("/api/v1/validation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      const data = await resp.json();
      if (resp.ok) {
        show(data.message, { duration: 2000 });
        changeLoading("btnLoading", false);
        navigate("/phone-validation");
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      changeLoading("btnLoading", false);
    }
  };

  const getValidationData = async () => {
    try {
      setLoading(true);

      const resp = await shopifyFetch(`/api/v1/validation/${id}`);
      const data = await resp.json();
      if (resp.ok) {
        const { getByID } = data;
        setFormData({
          title: getByID.title,
          enable: getByID.enabled,
          country: [getByID.phone_validation.country_name],
          countryCode: getByID.phone_validation.country_code.join(","),
          networkCodeLength: getByID.phone_validation.network_code,
          phoneLength: getByID.phone_validation.phone_no_length,
          errorMessage: getByID.phone_validation.error_message,
        });
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateValidationData = async () => {
    changeLoading("btnLoading", true);
    const reqData = {
      title: formData.title,
      country_name: formData.country[0],
      enabled: formData.enable,
      phone_validation: {
        type: "phone-validation",
        country_name: formData.country[0],
        country_code: formData.countryCode.split(","),
        network_code: formData.networkCodeLength,
        phone_no_length: formData.phoneLength,
        error_message: formData.errorMessage,
      },
    };

    const resp = await shopifyFetch(`/api/v1/validation/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });
    const data = await resp.json();
    if (resp.ok) {
      show("Updated Successfully!", {
        duration: 2000,
      });
      changeLoading("btnLoading", false);
      navigate("/phone-validation");
    } else {
      show(data.error, { isError: true });
      setPageLoadings(false);
    }
  };

  useEffect(() => {
    if (id !== "create") {
      getValidationData();
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
        <Page
          title={id === "create" ? "Add Phone Validation" : "Edit Validation"}
          backAction={{
            onAction: () => navigate("/phone-validation"),
          }}
        >
          <Card
            style={{
              maxHeight: "50vh",
            }}
          >
            <Box
              style={{
                backgroundColor: "white",
                padding: "1rem",
              }}
            >
              <BlockStack gap="200">
                <Checkbox
                  label="Enable Validation "
                  checked={formData.enable}
                  onChange={(value) => handleFormDataChange("enable", value)}
                />

                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={(value) => handleFormDataChange("title", value)}
                />
                <SearchAndSelect
                  allowMultiple={false}
                  selectedOptions={formData.country}
                  setSelectedOptions={(value) => {
                    handleFormDataChange("country", value);
                  }}
                  label="Select Country"
                  // selectionOption={countries.filter(
                  //   (country) => !disabledCountriesPhone.includes(country.value)
                  // )}
                  selectionOption={countries.map((country) => {
                    return disabledCountriesPhone.includes(country.value)
                      ? {
                          ...country,
                          disabled: true,
                        }
                      : country;
                  })}
                />

                <Banner
                  title="Provide the following details for validation rules:"
                  tone="info"
                >
                  Example Phone Number: +92 3xx XXXXXXX
                  <br />
                  This rule represents a phone number where the country code is
                  +92, the network code "3xx" has a length of 3, and the phone
                  number "XXXXXXX" has a length of 7.
                </Banner>
                <TextField
                  label="Country Code"
                  helpText="Enter multiple values comma separated (e.g., +32,11,+92)"
                  value={formData.countryCode}
                  onChange={(value) =>
                    handleFormDataChange("countryCode", value)
                  }
                />
                <TextField
                  label="Network Code Length"
                  type="number"
                  helpText="Specify the network code length (e.g 3,4)"
                  value={formData.networkCodeLength}
                  onChange={(value) =>
                    handleFormDataChange("networkCodeLength", value)
                  }
                />
                <TextField
                  label="Phone Number Length"
                  type="number"
                  helpText="Specify the phone number length (e.g 5,7)"
                  value={formData.phoneLength}
                  onChange={(value) =>
                    handleFormDataChange("phoneLength", value)
                  }
                />
                <TextField
                  label="Add Error message"
                  value={formData.errorMessage}
                  onChange={(value) =>
                    handleFormDataChange("errorMessage", value)
                  }
                />
              </BlockStack>
            </Box>
          </Card>
          <Box paddingBlock="400">
            <InlineStack align="end">
              <Button
                variant="primary"
                disabled={!isFormDataValid()}
                loading={pageLoadings.btnLoading}
                onClick={() => {
                  id !== "create"
                    ? updateValidationData()
                    : setPhoneValidation();
                }}
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

export default CreatePhoneValidation;
