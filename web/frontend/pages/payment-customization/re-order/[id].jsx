import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  BlockStack,
  Box,
  Button,
  Card,
  ChoiceList,
  Divider,
  InlineGrid,
  InlineStack,
  labelID,
  Page,
  Select,
  Text,
  TextField,
  useBreakpoints,
} from "@shopify/polaris";
import { AddTag, SearchAndSelect } from "../../../components";
import { PlusCircleIcon, DeleteIcon } from "@shopify/polaris-icons";
import {
  customizationRuleForCountry,
  customizationRuleForPayment,
} from "../../../constants";
import {} from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../../../hooks";
import { useNavigate, useToast } from "@shopify/app-bridge-react";

const ReOrder = () => {
  const shopifyFetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { show } = useToast();

  const { smUp } = useBreakpoints();
  const [countries, setCountries] = useState("");
  const [formError, setFormError] = useState({
    title: false,
    paymentMethodTitles: false,
  });
  const [formData, setFormData] = useState({
    title: "",
    status: "active",
    paymentRule: "always",
    paymentRuleConditions: [
      {
        type: "title",
        rule: "contains",
        value: ["Standard"],
      },
    ],
    paymentName: {
      match: "exact-case-sensitive",
      title: ["Cash On Delivery (COD)"],
    },
    paymentMethodTitles: [],
    ruleType: "all",
    customizationRule: [
      {
        type: "country",
        rule: "equal-to",
        value: [],
      },
    ],
  });

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
        setCountries(countryArr);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCustomization = async () => {
    try {
      const resp = await shopifyFetch(
        "https://threshold-package-take-enhancements.trycloudflare.com/api/v1/payment-customization/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            type: "hide",
            rule_status: formData.status[0] === "active" ? true : false,
            payment_rule: formData.ruleType === "all" ? true : false,
            conditions: formData.customizationRule,
            payment_name: {
              match: formData.paymentRule,
              title: formData.paymentMethodTitles,
            },
          }),
        }
      );
      const data = await resp.json();
      if (resp.ok) {
        show("Added Successfully!", {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCondition = () => {
    setFormData((prev) => {
      return {
        ...prev,
        customizationRule: [
          ...prev.customizationRule,
          {
            type: "country",
            rule: "equal-to",
            value: [],
          },
        ],
      };
    });
  };

  const handleDeleCondition = (index) => {
    console.log(index, formData.customizationRule.length);
    const newConditions = [...formData.customizationRule];
    console.log(newConditions, "before");
    newConditions?.splice(index, 1);
    console.log(newConditions, formData.customizationRule.length, "after");
    setFormData((prev) => {
      return {
        ...prev,
        customizationRule: newConditions,
      };
    });
  };

  const handleCustomizationRuleChange = (index, name, value) => {
    setFormData((prev) => {
      const newRules = prev.customizationRule;
      newRules[index] = {
        ...newRules[index],
        [name]: value,
      };
      return {
        ...prev,
        customizationRule: newRules,
      };
    });
  };
  const handleFormDataChange = (name, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <>
      <Page
        backAction={{
          content: "",
          onAction: () => navigate("/payment-customization"),
        }}
        title="Re-order Payment Methods"
        primaryAction={{
          content: "Create",
          onAction: handleCreateCustomization,
          disabled:
            !formData.title || formData.paymentMethodTitles.length === 0,
        }}
      >
        <BlockStack gap={{ xs: "800", sm: "400" }}>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="100">
                <Text as="h3" variant="headingMd">
                  Customization rules
                </Text>
                <Text as="p" variant="bodyMd">
                  Shopify Payment Customization title (For internal use only )
                </Text>
              </BlockStack>
            </Box>
            <Card padding="400" roundedAbove="sm">
              <Box>
                <TextField
                  onBlur={() =>
                    !formData.title
                      ? setFormError((prev) => {
                          return {
                            ...prev,
                            title: true,
                          };
                        })
                      : null
                  }
                  onFocus={() => {
                    setFormError((prev) => {
                      return {
                        ...prev,
                        title: false,
                      };
                    });
                  }}
                  error={formError.title && "This field is required"}
                  value={formData.title}
                  onChange={(value) => handleFormDataChange("title", value)}
                  placeholder="Ex. Hide COD when total cart price is 1000$ "
                />
              </Box>
            </Card>
          </InlineGrid>
          {smUp ? <Divider /> : null}
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="100">
                <Text as="h3" variant="headingMd">
                  Customization Rule Status
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <Box>
                  <ChoiceList
                    choices={[
                      {
                        label: "Active",
                        helpText:
                          "Rule will be enabled on your store, this will affect checkout for all customers",
                        value: "active",
                      },
                      {
                        label: "Inactive",
                        helpText:
                          "Disable this rule without deleting it. Deactivating rules will not affect checkout for your customers",
                        value: "inactive",
                      },
                    ]}
                    onChange={(value) => handleFormDataChange("status", value)}
                    selected={formData.status}
                  />
                </Box>
              </BlockStack>
            </Card>
          </InlineGrid>

          {smUp ? <Divider /> : null}
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="100">
                <Text as="h3" variant="headingMd">
                  Enter Payment method
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <Box width="50%">
                  <InlineStack align="space-between">
                    <ChoiceList
                      choices={[
                        {
                          label: "Sort Always",
                          value: "always",
                        },
                      ]}
                      selected={formData.paymentRule}
                      onChange={(value) =>
                        handleFormDataChange("paymentRule", value)
                      }
                    />
                    <ChoiceList
                      choices={[
                        {
                          label: " Conditionally",
                          value: "condition",
                        },
                      ]}
                      selected={formData.paymentRule}
                      onChange={(value) =>
                        handleFormDataChange("paymentRule", value)
                      }
                    />
                  </InlineStack>
                </Box>
                {formData.paymentRule[0] === "condition" && (
                  <BlockStack gap="200">
                    {/* {
        type: "title",
        rule: "contains",
        value: ["Standard"],
      }, */}

                    {formData.paymentRuleConditions.map((condition, index) => {
                      return (
                        <>
                          <Select
                            value={condition.type}
                            options={[
                              {
                                label: "title",
                                value: "title",
                              },
                              {
                                label: "country",
                                value: "country",
                              },
                            ]}
                          />
                          <Select
                            value={condition.rule}
                            options={[
                              {
                                label: "Contain",
                                value: "contain",
                              },
                              {
                                label: "Does not contain",
                                value: "does-not-contains",
                              },
                            ]}
                          />
                          {condition.type === "title" ? (
                            <AddTag />
                          ) : (
                            <SearchAndSelect
                              allowMultiple={true}
                              selectedOptions={[]}
                              setSelectedOptions={(value) => {
                                handleCustomizationRuleChange(
                                  index,
                                  "value",
                                  value
                                );
                              }}
                              placeholder="Search Tags"
                              selectionOption={countries}
                            />
                          )}
                        </>
                      );
                    })}
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </InlineGrid>

          {smUp ? <Divider /> : null}
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="100">
                <Text as="h3" variant="headingMd">
                  Customization Rules
                </Text>
              </BlockStack>
            </Box>

            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <ChoiceList
                    choices={[
                      {
                        label: "Contain",
                        value: "contain",
                      },
                    ]}
                    selected={formData.paymentName}
                    onChange={(value) =>
                      handleFormDataChange("paymentName", value)
                    }
                  />
                  <ChoiceList
                    choices={[
                      {
                        label: "Exact(Case Sensitive)",
                        value: "exact_case_sensitive",
                      },
                    ]}
                    selected={formData.paymentName}
                    onChange={(value) =>
                      handleFormDataChange("paymentName", value)
                    }
                  />
                  <ChoiceList
                    choices={[
                      {
                        label: "Exact(No Case)",
                        value: "exact_no_case",
                      },
                    ]}
                    selected={formData.paymentName}
                    onChange={(value) =>
                      handleFormDataChange("paymentName", value)
                    }
                  />
                </InlineStack>
                <BlockStack gap="200">
                  {}
                  <TextField />
                </BlockStack>
              </BlockStack>
            </Card>
          </InlineGrid>
        </BlockStack>
      </Page>
    </>
  );
};

export default ReOrder;
