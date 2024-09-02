import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Page,
  Select,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { CustomAutoComplete, SearchAndSelect } from "../../../components";
import { useAuthenticatedFetch } from "../../../hooks";

const CreateCity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const [countries, setCountries] = useState([]);
  const [rawCities, setRawCites] = useState("");

  const [formData, setFormData] = useState({
    enabled: true,
    country_name: "",
    country_code: "",
    city_list: [],
  });

  const handleFormDataChange = (name, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getCountryNameByValue = (value) => {
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].value === value) {
        return countries[i].label;
      }
    }
    return;
  };

  const getCountries = async () => {
    try {
      const resp = await fetch("https://countriesnow.space/api/v0.1/countries");
      const data = await resp.json();
      if (resp.ok) {
        const countryArr = [];
        data.data?.forEach((country) => {
          countryArr.push({
            label: country.country,
            value: country.iso2,
          });
        });
        console.log(countryArr);
        setCountries(countryArr);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateList = async () => {
    try {
      const resp = await shopifyFetch("/api/v1/city-list/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();
      if (resp.ok) {
        show(data.message);
        navigate("/checkout-city");
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateList = async () => {};

  useEffect(() => {
    getCountries();
  }, []);
  return (
    <>
      <Page
        title="Add Cities"
        backAction={{
          onAction: () => navigate("/checkout-city"),
        }}
        primaryAction={{
          content: formData.enabled ? "Turn off" : "Turn On",
          destructive: formData.enabled,
          onAction: () => handleFormDataChange("enabled", !formData.enabled),
        }}
      >
        <Card>
          <BlockStack gap="400">
            {countries.length > 0 ? (
              <CustomAutoComplete
                label={<Text variant="headingMd">Select Country</Text>}
                placeholder="Search Country "
                selectionOptions={countries}
                selectedOptions={formData.country_name || []}
                setSelectedOptions={(value) => {
                  console.log(value);
                  console.log(formData.country_name);
                  handleFormDataChange("country_code", value[0]);
                  handleFormDataChange(
                    "country_name",
                    getCountryNameByValue(value[0])
                  );
                }}
              />
            ) : (
              <Spinner size="small" />
            )}
            <TextField
              label={<Text variant="headingMd">Enter Cities</Text>}
              helpText="Please enter a comma-separated list of cities, for example: City 1, City 2, City 3."
              placeholder="City1, City2 , City3 .... "
              multiline={8}
              onChange={(value) => {
                setRawCites(value);
              }}
              onBlur={() => {
                const newCities = rawCities
                  .split(",")
                  .map((item) => item.trim());
                console.log(newCities);
                handleFormDataChange("city_list", newCities);
              }}
              value={rawCities || formData.city_list.join(", ")}
            />
          </BlockStack>
        </Card>
        <Box paddingBlock="400">
          <InlineStack align="end">
            <Button
              disabled={!formData.country_name}
              variant="primary"
              onClick={() => {
                id === "create" ? handleCreateList() : handleUpdateList();
              }}
            >
              {id === "create" ? "Create" : "Update"}
            </Button>
          </InlineStack>
        </Box>
      </Page>
    </>
  );
};

export default CreateCity;
