import React, { useEffect, useState } from "react";
import SearchAndSelect from "../search-and-select";
import { useAuthenticatedFetch } from "../../hooks";
import { useToast } from "@shopify/app-bridge-react";
import {
  Banner,
  BlockStack,
  Box,
  TextField,
  Modal,
  Checkbox,
} from "@shopify/polaris";

const PhoneValidationModal = ({
  open,
  onClose,
  onSuccess,
  onEditSuccess,
  editingID,
}) => {
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const [loading, setLoading] = useState({
    modalLoading: false,
    btnLoading: false,
  });

  const [countries, setCountries] = useState([]);
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
    setLoading((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getCountries = async () => {
    try {
      changeLoading("modalLoading", true);
      const resp = await shopifyFetch(
        "https://countriesnow.space/api/v0.1/countries"
      );
      const data = await resp.json();
      if (resp.ok) {
        const countryArr = [];
        data.data?.forEach((country) => {
          countryArr.push({
            label: country.country,
            value: country.iso2,
          });
        });
        setCountries(countryArr);
        changeLoading("modalLoading", false);
      }
    } catch (e) {
      console.error(e);
    } finally {
    }
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

  const handleClose = () => {
    setFormData({
      title: "",
      enable: true,
      country: [],
      countryCode: "",
      networkCodeLength: "",
      phoneLength: "",
      errorMessage: "",
    });
    onClose();
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
      const resp = await shopifyFetch("api/v1/validation/create", {
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
        handleClose();
        onSuccess(data.createValidation);
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
      changeLoading("modalLoading", true);
      const resp = await shopifyFetch(`/api/v1/validation/${editingID}`);
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
        changeLoading("modalLoading", false);
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

    const resp = await shopifyFetch(`/api/v1/validation/${editingID}`, {
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
      handleClose();
      onEditSuccess(data.updatedValidation);
    } else {
      show(data.error, { isError: true });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editingID !== "") {
      getValidationData();
    }
  }, [open]);

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
        }}
        loading={loading.modalLoading}
        // size="medium"
        primaryAction={{
          content: editingID !== "" ? "Update" : "Add",
          onAction: () =>
            editingID !== "" ? updateValidationData() : setPhoneValidation(),
          disabled: !isFormDataValid(),
          loading: loading.btnLoading,
        }}
        title="Add Phone Validation"
      >
        <div
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
                selectionOption={countries}
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
                onChange={(value) => handleFormDataChange("countryCode", value)}
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
                onChange={(value) => handleFormDataChange("phoneLength", value)}
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
        </div>
      </Modal>
    </>
  );
};

export default PhoneValidationModal;
