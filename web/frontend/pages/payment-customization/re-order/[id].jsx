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
import {} from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../../../hooks";
import { useNavigate, useToast } from "@shopify/app-bridge-react";

const ReOrder = () => {
  const shopifyFetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { show } = useToast();

  const { smUp } = useBreakpoints();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [countries, setCountries] = useState("");
  const [formError, setFormError] = useState({
    title: false,
    paymentMethodTitles: false,
  });
  const [formData, setFormData] = useState({
    title: "",
    type: "re-order",
    status: ["active"],
    paymentRule: ["always"],
    paymentRuleConditions: [
      {
        type: "country",
        rule: "contains",
        value: [],
      },
    ],
    paymentName: {
      match: "contain",
      title: [""],
    },
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
          rule_status: formData.status[0] === "active" ? true : false,
          payment_rule: formData.paymentRule[0] === "condition" ? true : false,
          conditions: formData.paymentRuleConditions,
          payment_name: formData.paymentName,
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        show("Added Successfully!", {
          duration: 2000,
        });
        navigate("/payment-customization");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addNewTitle = () => {
    setFormData((prev) => {
      const newArr = [...prev.paymentName.title];
      newArr.push("");
      return {
        ...prev,
        paymentName: {
          ...prev.paymentName,
          title: newArr,
        },
      };
    });
  };

  const handleDeleteTitle = (index) => {
    setFormData((prev) => {
      const newArr = [...prev.paymentName.title];
      return {
        ...prev,
        paymentName: {
          ...prev.paymentName,
          title: newArr.filter((_, tempIndex) => tempIndex !== index),
        },
      };
    });
  };

  const handleSortingRuleChange = (index, name, value) => {
    setFormData((prev) => {
      const newRules = prev.paymentRuleConditions;
      newRules[index] = {
        ...newRules[index],
        [name]: value,
      };
      return {
        ...prev,
        paymentRuleConditions: newRules,
      };
    });
  };

  const handlePaymentRuleChange = (index, name, value) => {
    setFormData((prev) => {
      const newRules = { ...prev.paymentName };
      newRules[name][index] = value;
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

  const getCustomizationData = async () => {
    try {
      setPageLoading(true);
      const resp = await shopifyFetch(`/api/v1/payment-customization/${id}`);
      const data = await resp.json();
      if (resp.ok) {
        const { getByID } = data;
        console.log(getByID);
        setFormData({
          title: getByID.title,
          type: getByID.type,
          status: getByID.rule_status ? ["active"] : ["inactive"],
          paymentRule: getByID.payment_rule ? ["condition"] : ["always"],
          paymentRuleConditions: getByID.conditions,
          paymentName: getByID.payment_name,
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
        rule_status: formData.status[0] === "active" ? true : false,
        payment_rule: formData.paymentRule[0] === "condition" ? true : false,
        conditions: formData.paymentRuleConditions,
        payment_name: formData.paymentName,
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
      console.log("editing.....");
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
            onAction: () => navigate("/payment-customization"),
          }}
          title="Re-order Payment Methods"
          primaryAction={{
            loading: loading,
            disabled:
              formData.paymentName?.title?.includes("") ||
              formData.title === "",
            content: id !== "create" ? "Update" : "Create",
            onAction: () => {
              id !== "create"
                ? updateCustomizationData()
                : handleCreateCustomization();
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
                      onChange={(value) =>
                        handleFormDataChange("status", value)
                      }
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
                        onChange={(value) => {
                          console.log(value);
                          handleFormDataChange("paymentRule", value);
                        }}
                      />
                      <ChoiceList
                        choices={[
                          {
                            label: " Conditionally",
                            value: "condition",
                          },
                        ]}
                        selected={formData.paymentRule}
                        onChange={(value) => {
                          console.log(value);
                          handleFormDataChange("paymentRule", value);
                        }}
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

                      {formData.paymentRuleConditions.map(
                        (condition, index) => {
                          console.log(condition.type);
                          console.log(condition.rule);
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
                                onChange={(value) => {
                                  handleSortingRuleChange(index, "type", value);
                                }}
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
                                onChange={(value) => {
                                  handleSortingRuleChange(index, "rule", value);
                                }}
                              />
                              {condition.type === "title" ? (
                                <AddTag
                                  setTags={(value) =>
                                    handleSortingRuleChange(
                                      index,
                                      "value",
                                      value
                                    )
                                  }
                                  tags={condition.value}
                                />
                              ) : (
                                <>
                                  {countries.length > 0 ? (
                                    <SearchAndSelect
                                      allowMultiple={true}
                                      selectedOptions={condition.value}
                                      setSelectedOptions={(value) => {
                                        handleSortingRuleChange(
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
                              )}
                            </>
                          );
                        }
                      )}
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
                    />
                    <ChoiceList
                      choices={[
                        {
                          label: "Exact(Case Sensitive)",
                          value: "exact_case_sensitive",
                        },
                      ]}
                      selected={formData?.paymentName.match}
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
                    />
                    <ChoiceList
                      choices={[
                        {
                          label: "Exact(No Case)",
                          value: "exact_no_case",
                        },
                      ]}
                      selected={formData?.paymentName.match}
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

                      // onChange={(value) =>
                      //   handleFormDataChange("paymentName", value)
                      // }
                    />
                  </InlineStack>
                  <BlockStack gap="200">
                    {formData.paymentName.title.map((payment, index) => {
                      return (
                        <InlineStack key={index} gap="400">
                          <Box
                            style={{
                              flexGrow: 1,
                            }}
                          >
                            <TextField
                              value={payment}
                              onChange={(value) => {
                                handlePaymentRuleChange(index, "title", value);
                              }}
                            />
                          </Box>
                          {index > 0 && (
                            <Button
                              icon={DeleteIcon}
                              onClick={() => handleDeleteTitle(index)}
                            />
                          )}
                        </InlineStack>
                      );
                    })}
                    <Box paddingBlockStart="200">
                      <InlineStack align="end">
                        <Button
                          disabled={formData.paymentName.title.includes("")}
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
      )}
    </>
  );
};

export default ReOrder;
