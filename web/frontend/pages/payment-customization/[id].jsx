import React, { useState } from "react";
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
  OptionList,
  Page,
  RadioButton,
  Select,
  Text,
  TextField,
  useBreakpoints,
} from "@shopify/polaris";
import { SearchAndSelect } from "../../components";
import { PlusCircleIcon } from "@shopify/polaris-icons";
import {
  customizationRuleForCountry,
  customizationRuleForPayment,
} from "../../constants";
import { select } from "@shopify/app-bridge/actions/ResourcePicker";

const CreateCustomization = () => {
  const { id } = useParams();
  const { smUp } = useBreakpoints();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    title: "",
    status: "active",
    paymentMethod: "contain",
    paymentMethodText: "",
    customizationRule: [
      {
        ruleType: "all",
        ruleOptions: "country",
        ruleConditions: "equal-to",
      },
    ],
  });

  const handleAddCondition = () => {
    setFormData((prev) => {
      return {
        ...prev,
        customizationRule: [
          ...prev.customizationRule,
          {
            ruleType: "all",
            ruleOptions: "country",
            ruleConditions: "equal-to",
          },
        ],
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

  return (
    <>
      <Page
        title="Advance Payment rules (Hide/Delete)"
        subtitle="You can use payment customization to hide payment options that are
            available to buyers during checkout.With this app you'll hide all
            your payment options offered to customers at checkout , based on
            condition that you set in below."
        primaryAction={{
          content: "Create",
          onAction: () => {},
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
                <InlineStack align="space-between">
                  <ChoiceList
                    choices={[
                      {
                        label: "Contain",
                        value: "contain",
                      },
                    ]}
                    selected={formData.paymentMethod}
                    onChange={(value) =>
                      handleFormDataChange("paymentMethod", value)
                    }
                  />
                  <ChoiceList
                    choices={[
                      {
                        label: "Exact(Case Sensitive)",
                        value: "exact_case_sensitive",
                      },
                    ]}
                    selected={formData.paymentMethod}
                    onChange={(value) =>
                      handleFormDataChange("paymentMethod", value)
                    }
                  />
                  <ChoiceList
                    choices={[
                      {
                        label: "Exact(No Case)",
                        value: "exact_no_case",
                      },
                    ]}
                    selected={formData.paymentMethod}
                    onChange={(value) =>
                      handleFormDataChange("paymentMethod", value)
                    }
                  />
                </InlineStack>
                <Divider />
                <InlineStack gap="200">
                  <Box
                    style={{
                      flexGrow: 1,
                    }}
                  >
                    <TextField
                      placeholder="Ex. Standard"
                      value={formData.paymentMethodText}
                      onChange={(value) =>
                        handleFormDataChange("paymentMethodText", value)
                      }
                    />
                  </Box>
                  <Button variant="secondary">Add</Button>
                </InlineStack>
              </BlockStack>
              <Text>
                payment Method name that you have set up on the store's settings
              </Text>
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
                {formData.customizationRule.map((rule, index) => {
                  console.log(rule);
                  return (
                    <>
                      <Box key={index} width={smUp && "50%"}>
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
                            selected={rule.ruleType}
                            onChange={(value) =>
                              handleCustomizationRuleChange(
                                index,
                                "ruleType",
                                value
                              )
                            }
                          />
                          <ChoiceList
                            choices={[
                              {
                                value: "any",
                                label: "Any Below",
                              },
                            ]}
                            selected={rule.ruleType}
                            onChange={(value) =>
                              handleCustomizationRuleChange(
                                index,
                                "ruleType",
                                value
                              )
                            }
                          />
                        </InlineStack>
                      </Box>
                      <Divider />

                      <Box paddingBlockEnd="1000">
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
                                value={rule.ruleOptions}
                                onChange={(value) =>
                                  handleCustomizationRuleChange(
                                    index,
                                    "ruleOptions",
                                    value
                                  )
                                }
                              />
                              <Select
                                placeholder="Select Condition"
                                onChange={(value) =>
                                  handleFormDataChange("ruleCondition", value)
                                }
                                options={
                                  rule.ruleOptions === "total-amount"
                                    ? customizationRuleForPayment
                                    : customizationRuleForCountry
                                }
                                value={rule.ruleConditions}
                              />
                            </InlineGrid>
                            <SearchAndSelect placeholder="Search Tags" />
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
        </BlockStack>
      </Page>
    </>
  );
};

export default CreateCustomization;
