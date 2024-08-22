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
  paymentMethods,
} from "../../../constants";
import {} from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../../../hooks";
import { useNavigate, useToast } from "@shopify/app-bridge-react";

const Hide = () => {
  const shopifyFetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { show } = useToast();

  const { smUp } = useBreakpoints();
  const [countries, setCountries] = useState([]);
  const [paymentTitles, setPaymentTitles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(false);
  const [formError, setFormError] = useState({
    title: false,
    paymentMethodTitles: false,
  });
  const [formData, setFormData] = useState({
    title: "",
    type: "hide",
    status: true,
    paymentMethodType: "contain",
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
      setLoading(true);
      const resp = await shopifyFetch("/api/v1/payment-customization/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          rule_status: formData.status,
          payment_rule: formData.ruleType === "all" ? true : false,
          conditions: formData.customizationRule,
          payment_name: {
            match: formData.paymentMethodType,
            title: paymentTitles,
          },
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        show("Added Successfully!", {
          duration: 2000,
        });
        setLoading(false);
        navigate("/payment");
      } else {
        show(data.error);
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
    const newConditions = [...formData.customizationRule];
    newConditions?.splice(index, 1);
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

  const getCustomizationData = async () => {
    try {
      setPageLoading(true);
      const resp = await shopifyFetch(`/api/v1/payment-customization/${id}`);
      const data = await resp.json();
      if (resp.ok) {
        const { getByID } = data;
        setFormData({
          title: getByID.title,
          type: getByID.type,
          ruleType: getByID.payment_rule ? "all" : "any",
          status: getByID.rule_status,
          paymentMethodTitles: setPaymentTitles(getByID.payment_name.title),
          paymentMethodType: getByID.payment_name.match,
          customizationRule: getByID.conditions,
        });
        setPageLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCustomizationData = async () => {
    setLoading(true);
    const resp = await shopifyFetch(`/api/v1/payment-customization/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        type: formData.type,
        rule_status: formData.status,
        payment_rule: formData.ruleType === "all" ? true : false,
        conditions: formData.customizationRule,
        payment_name: {
          match: formData.paymentMethodType,
          title: paymentTitles,
        },
      }),
    });

    const data = await resp.json();
    if (resp.ok) {
      show("Updated Successfully!", {
        duration: 2000,
      });
      setLoading(false);
      navigate("/payment");
    }
  };

  useEffect(() => {
    if (id !== "create") {
      getCustomizationData();
    }
    getCountries();
  }, []);

  return (
    <>
      {pageLoading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
        <Page
          backAction={{
            content: "",
            onAction: () => navigate("/payment"),
          }}
          title="Advance Payment rules (Hide/Delete)"
          primaryAction={{
            content: formData.status === true ? "Turn off" : "Turn on",
            destructive: formData.status === true,
            onAction: () => {
              handleFormDataChange("status", !formData.status);
            },
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
                    onChange={(value) => {
                      handleFormDataChange("title", value);
                    }}
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
                    Enter Payment method
                  </Text>
                </BlockStack>
              </Box>
              <Card roundedAbove="sm">
                <BlockStack gap="400">
                  {/* <InlineStack align="space-between">
                    <ChoiceList
                      choices={[
                        {
                          label: "Contain",
                          value: "contain",
                        },
                      ]}
                      selected={formData.paymentMethodType}
                      onChange={(value) =>
                        handleFormDataChange("paymentMethodType", value)
                      }
                    />
                    <ChoiceList
                      choices={[
                        {
                          label: "Exact(Case Sensitive)",
                          value: "exact_case_sensitive",
                        },
                      ]}
                      selected={formData.paymentMethodType}
                      onChange={(value) =>
                        handleFormDataChange("paymentMethodType", value)
                      }
                    />
                    <ChoiceList
                      choices={[
                        {
                          label: "Exact(No Case)",
                          value: "exact_no_case",
                        },
                      ]}
                      selected={formData.paymentMethodType}
                      onChange={(value) =>
                        handleFormDataChange("paymentMethodType", value)
                      }
                    />
                  </InlineStack> */}

                  <SearchAndSelect
                    allowMultiple={true}
                    selectedOptions={paymentTitles}
                    selectionOption={paymentMethods}
                    setSelectedOptions={(value) => {
                      setPaymentTitles(value);
                    }}
                    placeholder="Search Methods"
                  />
                </BlockStack>
                <Text>
                  payment Method name that you have set up on the store's
                  settings
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
                                    {
                                      label: "SKU",
                                      value: "sku",
                                    },
                                    {
                                      label: "City",
                                      value: "city",
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
                                    handleCustomizationRuleChange(
                                      index,
                                      "rule",
                                      value === "total-amount"
                                        ? "equal-to"
                                        : "contain"
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
                                    rule.type !== "total-amount"
                                      ? customizationRuleForCountry
                                      : customizationRuleForPayment
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
                                      placeholder={
                                        rule.type === "country"
                                          ? "Search Countries"
                                          : "Search Tags"
                                      }
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
                              ) : rule.type === "city" ||
                                rule.type === "sku" ? (
                                <>
                                  <AddTag
                                    tags={rule.value}
                                    setTags={(value) => {
                                      handleCustomizationRuleChange(
                                        index,
                                        "value",
                                        value
                                      );
                                    }}
                                    placeholder={
                                      rule.type === "city"
                                        ? "Enter Cities"
                                        : "Enter SKU"
                                    }
                                  />
                                </>
                              ) : (
                                <TextField
                                  value={rule.value[0]}
                                  type={
                                    rule.type === "title" ? "text" : "number"
                                  }
                                  placeholder={
                                    rule.type === "title"
                                      ? "Add shipping title"
                                      : "Add amount "
                                  }
                                  onChange={(value) => {
                                    handleCustomizationRuleChange(
                                      index,
                                      "value",
                                      [value]
                                    );
                                  }}
                                />
                              )}
                              <InlineStack align="end">
                                {formData.customizationRule.length > 1 && (
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
                      disabled={formData.customizationRule.some(
                        (rule) =>
                          (Array.isArray(rule.value) &&
                            rule.value.length === 0) ||
                          rule.value.includes("")
                      )}
                      onClick={handleAddCondition}
                      variant="primary"
                      icon={PlusCircleIcon}
                    >
                      Add New Condition
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Card>
            </InlineGrid>
            <Box
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Box paddingBlockEnd="800">
                <Button
                  loading={loading}
                  disabled={
                    !formData.title ||
                    paymentTitles.length === 0 ||
                    formData.customizationRule.some(
                      (rule) =>
                        (Array.isArray(rule.value) &&
                          rule.value.length === 0) ||
                        rule.value.includes("")
                    )
                  }
                  onClick={() => {
                    id !== "create"
                      ? updateCustomizationData()
                      : handleCreateCustomization();
                  }}
                >
                  {id !== "create" ? "Update" : "Create"}
                </Button>
              </Box>
            </Box>
          </BlockStack>
        </Page>
      )}
    </>
  );
};

export default Hide;
