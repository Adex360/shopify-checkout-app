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
  Spinner,
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
import { useAuthenticatedFetch } from "../../../hooks";
import { useNavigate, useToast } from "@shopify/app-bridge-react";

const ReName = () => {
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
    paymentMethodType: "contain",
    ruleType: "all",
    customizationRule: [
      {
        type: "country",
        rule: "equal-to",
        value: [],
      },
    ],
    paymentName: [
      {
        old: "Cash on Delivery (COD)",
        new: "Cash On Delivery test",
      },
      {
        old: "(for testing) Bogus Gateway",
        new: "bbbb",
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
        "https://princess-h-cluster-tutorials.trycloudflare.com/api/v1/payment-customization/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            type: "rename",
            rule_status: formData.status[0] === "active" ? true : false,
            payment_rule: formData.ruleType === "all" ? true : false,
            conditions: formData.customizationRule,
            payment_name: formData.paymentName,
          }),
        }
      );
      const data = await resp.json();
      if (resp.ok) {
        show("Added Successfully!", {
          duration: 2000,
        });
        navigate("/payment-customization");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addNewTitle = () => {
    setFormData((prev) => {
      const newArr = [...prev.paymentName];
      newArr.push({
        old: "",
        new: "",
      });
      return {
        ...prev,
        paymentName: newArr,
      };
    });
  };

  const handleDeleteTitle = (index) => {
    setFormData((prev) => {
      const newArr = [...prev.paymentName];
      return {
        ...prev,
        paymentName: newArr.filter((_, tempIndex) => tempIndex !== index),
      };
    });
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

  const handlePaymentRuleChange = (index, name, value) => {
    setFormData((prev) => {
      const newRules = [...prev.paymentName];
      console.log(newRules[index]);
      newRules[index][name] = value;
      return {
        ...prev,
        paymentName: newRules,
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
        title="Rename Payment Methods"
        primaryAction={{
          content: "Create",
          disabled: formData.title === "",
          onAction: handleCreateCustomization,
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
                  Customization Rules
                </Text>
              </BlockStack>
            </Box>

            <Card roundedAbove="sm">
              <BlockStack key="key1" gap="400">
                <Box width={smUp && "50%"}>
                  <InlineStack
                    align={smUp && "space-between"}
                    gap={!smUp && "1000"}
                  >
                    <ChoiceList
                      choices={[
                        {
                          value: "all",
                          label: "All Below",
                        },
                      ]}
                      selected={formData.ruleType}
                      onChange={(value) =>
                        handleFormDataChange("ruleType", value)
                      }
                    />
                    <ChoiceList
                      choices={[
                        {
                          value: "any",
                          label: "Any Below",
                        },
                      ]}
                      selected={formData.ruleType}
                      onChange={(value) =>
                        handleFormDataChange("ruleType", value)
                      }
                    />
                  </InlineStack>
                </Box>
                {formData.customizationRule.map((rule, index) => {
                  return (
                    <>
                      <Divider key={(index + 1) * 9} />

                      <Box key={index} paddingBlockEnd="1000">
                        <Card background="bg-fill-disabled">
                          <BlockStack gap="200">
                            <InlineGrid columns={2} gap="200">
                              <Select
                                placeholder="Select Option"
                                options={[
                                  {
                                    label: "Country",
                                    value: "country",
                                  },
                                  {
                                    label: "Shipping Title",
                                    value: "title",
                                  },
                                  {
                                    label: "Total Amount",
                                    value: "total-amount",
                                  },
                                ]}
                                value={rule.type}
                                onChange={(value) => {
                                  // resetting value to empty array on change of rule option
                                  handleCustomizationRuleChange(
                                    index,
                                    "value",
                                    []
                                  );
                                  //
                                  handleCustomizationRuleChange(
                                    index,
                                    "type",
                                    value
                                  );
                                }}
                              />
                              <Select
                                placeholder="Select Condition"
                                onChange={(value) => {
                                  handleCustomizationRuleChange(
                                    index,
                                    "rule",
                                    value
                                  );
                                }}
                                options={
                                  rule.type === "total-amount"
                                    ? customizationRuleForPayment
                                    : customizationRuleForCountry
                                }
                                value={rule.rule}
                              />
                            </InlineGrid>
                            {rule.type === "country" ? (
                              <>
                                {countries.length > 0 ? (
                                  <SearchAndSelect
                                    allowMultiple={true}
                                    selectedOptions={rule.value}
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
                                ) : (
                                  <BlockStack
                                    align="center"
                                    inlineAlign="center"
                                  >
                                    <Spinner size="small" />
                                  </BlockStack>
                                )}
                              </>
                            ) : (
                              // passing string into array due to server side validation
                              <TextField
                                value={rule.value[0]}
                                onChange={(value) => {
                                  console.log(formData);
                                  handleCustomizationRuleChange(
                                    index,
                                    "value",
                                    [value]
                                  );
                                }}
                              />
                            )}
                            <InlineStack align="end">
                              {index > 0 && (
                                <Button
                                  variant="primary"
                                  icon={DeleteIcon}
                                  onClick={() => {
                                    handleDeleCondition(index);
                                  }}
                                />
                              )}
                            </InlineStack>
                          </BlockStack>
                        </Card>
                      </Box>
                    </>
                  );
                })}
                <Divider />
                <InlineStack>
                  <Button
                    onClick={handleAddCondition}
                    variant="primary"
                    icon={PlusCircleIcon}
                  >
                    Add Condition
                  </Button>
                </InlineStack>
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
                {/* <ChoiceList
                    choices={[
                      {
                        label: "Contain",
                        value: "contain",
                      },
                    ]}
                    selected={formData.paymentName.match}
                    onChange={(value) => {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          paymentName: {
                            ...prev.paymentName,
                            match: value,
                          },
                        };
                      });
                    }}
                  /> */}

                <BlockStack gap="200">
                  {formData.paymentName.map((payment, index) => {
                    return (
                      <Card>
                        <InlineStack key={index} gap="400">
                          <Box
                            style={{
                              flexGrow: 1,
                            }}
                          >
                            <BlockStack gap="200">
                              <TextField
                                placeholder="Previous Method Name"
                                value={payment.old}
                                onChange={(value) => {
                                  handlePaymentRuleChange(index, "old", value);
                                }}
                              />
                              <TextField
                                placeholder="New Method Name"
                                value={payment.new}
                                onChange={(value) => {
                                  handlePaymentRuleChange(index, "new", value);
                                }}
                              />
                            </BlockStack>
                          </Box>
                          {index > 0 && (
                            <Button
                              icon={DeleteIcon}
                              onClick={() => handleDeleteTitle(index)}
                            />
                          )}
                        </InlineStack>
                      </Card>
                    );
                  })}
                  <Box paddingBlockStart="200">
                    <InlineStack align="end">
                      <Button
                        onClick={addNewTitle}
                        variant="primary"
                        icon={PlusCircleIcon}
                      >
                        Add condition
                      </Button>
                    </InlineStack>
                  </Box>
                </BlockStack>
              </BlockStack>
            </Card>
          </InlineGrid>
        </BlockStack>
      </Page>
    </>
  );
};

export default ReName;
