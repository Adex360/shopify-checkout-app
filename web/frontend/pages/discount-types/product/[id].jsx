import React, { useEffect, useState } from "react";
import {
  ResourcePicker,
  useAppBridge,
  useNavigate,
  useToast,
} from "@shopify/app-bridge-react";
import { useParams } from "react-router-dom";
import { useAuthenticatedFetch } from "../../../hooks";
import { useAppContext } from "../../../context";
import {
  customizationRuleForCountry,
  customizationRuleForPayment,
  discountOptions,
} from "../../../constants";
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineGrid,
  InlineStack,
  Page,
  RadioButton,
  ResourceList,
  Select,
  Spinner,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import { PlusCircleIcon, DeleteIcon } from "@shopify/polaris-icons";

const ProductDiscount = () => {
  const { loading, setLoading } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const shopifyFetch = useAuthenticatedFetch();
  const [open, setOpen] = useState(false);
  const [resources, setResources] = useState([]);

  const [formData, setFormData] = useState({
    enabled: true,
    title: "product discount",
    discount_type: "percentage",
    discount_value: "50.0",
    discount_message: "product discount",
    discount_rule: false,
    has_condition: false,
    conditions: [{ type: "total-amount", rule: "greater-than", value: [2000] }],
    discount_class: "PRODUCT",

    startsAt: "2024-08-26T10:59:28.768Z",
    endsAt: null,
    variant_ids: [
      "gid://shopify/ProductVariant/44428494864569",
      "gid://shopify/ProductVariant/44428495487161",
      "gid://shopify/ProductVariant/44428495257785",
    ],
  });

  const handleFormDataChange = (name, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleConditionChange = (index, name, value) => {
    setFormData((prev) => {
      const newRules = prev.conditions;
      newRules[index] = {
        ...newRules[index],
        [name]: value,
      };
      return {
        ...prev,
        conditions: newRules,
      };
    });
  };

  const handleSelection = (resource) => {
    console.log(resource.selection);
    setFormData((prev) => {
      return {
        ...prev,
        variant_ids: resource.selection.map((selected) => {
          return selected.id;
        }),
      };
    });
    console.log(formData.variant_ids);
    setOpen(false);
    setResources(resource.selection);
    console.log(resources);
  };

  const handleDeleteResource = (index) => {
    setResources((prev) => {
      const newArr = [...prev];
      console.log("deleted id form source", newArr[index].id);
      newArr.splice(index, 1);
      return newArr;
    });
    setFormData((prev) => {
      const newVariantIds = [...prev.variant_ids];
      console.log("deleted id form formData", newVariantIds[index]);
      newVariantIds.splice(index, 1);
      return {
        ...prev,
        variant_ids: newVariantIds,
      };
    });
  };

  const handleAddCondition = () => {
    setFormData((prev) => {
      return {
        ...prev,
        conditions: [
          ...prev.conditions,
          {
            type: "total-amount",
            rule: "equal-to",
            value: [],
          },
        ],
      };
    });
  };

  const handleDeleCondition = (index) => {
    const newConditions = [...formData.conditions];
    newConditions?.splice(index, 1);
    setFormData((prev) => {
      return {
        ...prev,
        conditions: newConditions,
      };
    });
  };

  const handleCreateDiscount = async () => {
    try {
      const resp = await shopifyFetch("/api/v1/discount/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();

      if (resp.ok) {
        show(data.message);
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDiscount = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch(`/api/v1/discount/${id}`);
      const data = await resp.json();
      if (resp.ok) {
        setFormData(data.getByID);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    id !== "create" && getDiscount();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
        <Page
          title="Create Product Discount "
          primaryAction={{
            content: formData.enabled === true ? "Turn off" : "Turn on",
            destructive: formData.enabled === true,
            onAction: () => {
              handleFormDataChange("enabled", !formData.enabled);
            },
          }}
          backAction={{
            onAction: () => navigate("/discounts"),
          }}
        >
          <Card>
            <BlockStack>
              <Box>
                <TextField
                  value={formData.title}
                  onChange={(value) => {
                    handleFormDataChange("title", value);
                  }}
                  helpText="Only visible to Admin"
                  label={<Text variant="headingMd">Discount Title</Text>}
                />
              </Box>
              <Card background="bg">
                <Box paddingBlockEnd="200">
                  <Text variant="headingMd">Discount Settings</Text>
                </Box>
                <BlockStack gap="400">
                  <Box>
                    <InlineGrid columns={2} gap="400">
                      <TextField
                        value={Math.floor(formData.discount_value)}
                        onChange={(value) => {
                          const newValue = Number(value);
                          console.log(newValue.toFixed(1));
                          handleFormDataChange(
                            "discount_value",
                            newValue.toFixed(1)
                          );
                        }}
                        type="number"
                        helpText="Enter value between 1 and 100"
                        label={
                          <Text variant="headingMd" fontWeight="medium">
                            Discount Value
                          </Text>
                        }
                      />

                      <TextField
                        value={formData.discount_message}
                        onChange={(value) => {
                          handleFormDataChange("discount_message", value);
                        }}
                        helpText="Shown to customers"
                        label={
                          <Text variant="headingMd" fontWeight="medium">
                            Discount Message
                          </Text>
                        }
                      />
                    </InlineGrid>
                  </Box>
                  <Box>
                    <InlineStack gap="800">
                      <RadioButton
                        label="Apply to all checkouts"
                        checked={formData.discount_rule}
                        onChange={(value) => {
                          handleFormDataChange("discount_rule", value);
                        }}
                      />
                      <RadioButton
                        label="Apply only when rule pass"
                        checked={!formData.discount_rule}
                        onChange={(value) => {
                          handleFormDataChange("discount_rule", !value);
                        }}
                      />
                    </InlineStack>
                  </Box>
                  <Box width="">
                    <Card>
                      <InlineStack align="space-between">
                        <Text variant="headingMd">Variant Settings</Text>
                        <Button variant="primary" onClick={() => setOpen(true)}>
                          Add Product Variants
                        </Button>

                        <ResourcePicker
                          initialSelectionIds={[]}
                          resourceType="ProductVariant"
                          open={open}
                          onSelection={(resource) => {
                            handleSelection(resource);
                          }}
                          onCancel={() => {
                            setOpen(false);
                          }}
                        />
                      </InlineStack>
                      <Box paddingBlock="400">
                        {resources.length > 0 ? (
                          <BlockStack gap="200">
                            {resources.map((resource, index) => {
                              return (
                                <Card key={index}>
                                  <InlineStack
                                    align="space-between"
                                    blockAlign="center"
                                  >
                                    <InlineStack gap="200" blockAlign="start">
                                      <Thumbnail
                                        source={resource.image.originalSrc}
                                      />
                                      <Box width="200px">
                                        <Text fontWeight="medium">
                                          {resource.title}
                                        </Text>
                                      </Box>
                                    </InlineStack>
                                    <Button
                                      icon={DeleteIcon}
                                      onClick={() =>
                                        handleDeleteResource(index)
                                      }
                                    />
                                  </InlineStack>
                                </Card>
                              );
                            })}
                          </BlockStack>
                        ) : (
                          <Text>
                            Select products on which you want to apply the
                            discounts.
                          </Text>
                        )}
                      </Box>
                    </Card>
                  </Box>

                  {!formData.discount_rule && (
                    <Box>
                      <Card>
                        <BlockStack gap="400">
                          <InlineStack gap="800">
                            <RadioButton
                              label="All below"
                              checked={formData.has_condition}
                              onChange={(value) => {
                                handleFormDataChange("has_condition", value);
                              }}
                            />
                            <RadioButton
                              label="Any Below"
                              checked={!formData.has_condition}
                              onChange={(value) => {
                                handleFormDataChange("has_condition", !value);
                              }}
                            />
                          </InlineStack>
                          {formData.conditions.map((condition, index) => {
                            return (
                              <>
                                <Card background="bg" key={index}>
                                  <BlockStack gap="200">
                                    <InlineGrid columns={2} gap="400">
                                      <Select
                                        placeholder="Select Option"
                                        options={discountOptions}
                                        value={condition.type}
                                        onChange={(value) => {
                                          handleConditionChange(
                                            index,
                                            "type",
                                            value
                                          );
                                          handleConditionChange(
                                            index,
                                            "value",
                                            []
                                          );
                                          handleConditionChange(
                                            index,
                                            "rule",
                                            value === "payment-method-handle" ||
                                              value === "sku" ||
                                              value === "payment-method-type"
                                              ? "contain"
                                              : "equal-to"
                                          );
                                        }}
                                      />
                                      <Select
                                        value={condition.rule}
                                        onChange={(value) => {
                                          handleConditionChange(
                                            index,
                                            "rule",
                                            value
                                          );
                                        }}
                                        placeholder="Select Condition"
                                        options={
                                          condition.type ===
                                            "payment-method-handle" ||
                                          condition.type === "sku" ||
                                          condition.type ===
                                            "payment-method-type"
                                            ? customizationRuleForCountry
                                            : customizationRuleForPayment
                                        }
                                      />
                                    </InlineGrid>
                                    {condition.type ===
                                      "payment-method-handle" ||
                                    condition.type === "sku" ||
                                    condition.type === "payment-method-type" ? (
                                      <TextField />
                                    ) : (
                                      <TextField
                                        max={100}
                                        min={0}
                                        placeholder="Enter Value"
                                        value={condition.value[0]}
                                        type="number"
                                        onChange={(value) => {
                                          const newValue = value ? +value : "";
                                          console.log(condition.value);
                                          handleConditionChange(
                                            index,
                                            "value",
                                            [newValue]
                                          );
                                        }}
                                      />
                                    )}
                                    {formData.conditions.length > 1 && (
                                      <InlineStack align="end">
                                        <Button
                                          onClick={() =>
                                            handleDeleCondition(index)
                                          }
                                          icon={DeleteIcon}
                                        />
                                      </InlineStack>
                                    )}
                                  </BlockStack>
                                </Card>
                              </>
                            );
                          })}

                          <InlineStack align="end">
                            <Button
                              disabled={formData.conditions.some(
                                (rule) =>
                                  (Array.isArray(rule.value) &&
                                    rule.value.length === 0) ||
                                  rule.value.includes("")
                              )}
                              onClick={handleAddCondition}
                              icon={PlusCircleIcon}
                              variant="primary"
                            >
                              Add More Rule
                            </Button>
                          </InlineStack>
                        </BlockStack>
                      </Card>
                    </Box>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Card>
          <Box paddingBlock="400">
            <InlineStack align="end">
              <Button onClick={() => handleCreateDiscount()} variant="primary">
                {id === "create" ? "Create" : "Update"}
              </Button>
            </InlineStack>
          </Box>
        </Page>
      )}
    </>
  );
};

export default ProductDiscount;

// const [formData, setFormData] = useState({
//   enabled: true,
//   title: "discount of 10% off?? ",
//   discount_type: "fixed-amount",
//   discount_value: "10.0",
//   discount_message: "10% off new one ",
//   discount_rule: true,
//   has_condition: false,

//   conditions: [
//     {
//       type: "all_line_qty",
//       rule: "equals-to",
//       value: 2,
//     },
//     {
//       type: "payment-method-handle",
//       rule: "contains",
//       value: ["creditCard-aadfghsdunvuf522199"],
//     },

//     {
//       type: "payment-method-type",
//       rule: "contains",
//       value: ["creditCard"],
//     },
//   ],
//   discount_class: "ORDER",

//   startsAt: "2024-08-26T10:59:28.768Z",
//   endsAt: "2024-08-27T10:59:28.768Z",
// });
