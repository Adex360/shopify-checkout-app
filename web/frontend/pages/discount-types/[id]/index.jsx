import React, { useEffect, useState } from "react";
import {
  ResourcePicker,
  useAppBridge,
  useNavigate,
  useToast,
} from "@shopify/app-bridge-react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuthenticatedFetch } from "../../../hooks";
import { useAppContext } from "../../../context";
import {
  customizationRuleForCountry,
  customizationRuleForPayment,
  discountOptions,
  discountPaymentOptions,
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
  Select,
  Spinner,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import { PlusCircleIcon, DeleteIcon, ImageIcon } from "@shopify/polaris-icons";
import {
  AddTag,
  RangeDateSelector,
  SearchAndSelect,
} from "../../../components";
import { getCorrectDate } from "../../../helpers";

const ProductDiscount = () => {
  const { loading, setLoading } = useAppContext();
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const discountClass = searchParams.get("type");

  const navigate = useNavigate();
  const { show } = useToast();
  const shopifyFetch = useAuthenticatedFetch();
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    enabled: true,
    title: "",
    discount_type: "fixed-amount",
    discount_value: "",
    discount_message: "",
    discount_rule: true,
    has_condition: true,
    conditions: [{ type: "total-amount", rule: "greater-than", value: [] }],
    discount_class: discountClass,
    startsAt: new Date().toISOString(),
    endsAt: null,
    variant_ids: [],
    product_ids: [],
  });

  console.log(formData.has_condition);

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
    const selectedProducts = resource.selection;
    const variants = selectedProducts.flatMap((product) => {
      return product.variants.map((variant) => {
        return variant.id;
      });
    });
    setFormData((prev) => {
      return {
        ...prev,
        variant_ids: variants,
      };
    });
    setFormData((prev) => {
      return {
        ...prev,
        product_ids: resource.selection,
      };
    });
    setOpen(false);
  };

  const handleDeleteResource = (index) => {
    setFormData((prev) => {
      const newVariantIds = [...prev.variant_ids];
      const newProducts = [...prev.product_ids];

      newProducts.splice(index, 1);
      newVariantIds.splice(index, 1);

      return {
        ...prev,
        variant_ids: newVariantIds,
        product_ids: newProducts,
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
      setBtnLoading(true);
      const resp = await shopifyFetch(`/api/v1/discount/${id}`, {
        method: id === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();

      if (resp.ok) {
        navigate("/discounts");
        show(data.message);
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
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
  const today = new Date();
  console.log(getCorrectDate(today));

  useEffect(() => {
    if (id === "create") {
    } else {
      getDiscount();
    }
  }, []);

  console.log(formData.endsAt);

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
            disabled: id === "create",
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

              <Box paddingBlock="300">
                <BlockStack gap="200">
                  <Text variant="headingMd" fontWeight="medium">
                    Discount Date (Start to End)
                  </Text>
                  <Card>
                    <RangeDateSelector
                      start={formData.startsAt}
                      end={formData.endsAt}
                      onChange={(start, end) => {
                        handleFormDataChange("startsAt", start);
                        handleFormDataChange("endsAt", end);
                      }}
                    />
                  </Card>
                </BlockStack>
              </Box>

              <Card background="bg">
                <Box paddingBlockEnd="200">
                  <Text variant="headingMd">Discount Settings</Text>
                </Box>
                <BlockStack gap="400">
                  <Box>
                    <InlineStack gap="800">
                      <RadioButton
                        label="Fixed Amount Discount"
                        onChange={() => {
                          handleFormDataChange("discount_type", "fixed-amount");
                        }}
                        checked={formData.discount_type === "fixed-amount"}
                      />
                      <RadioButton
                        onChange={() => {
                          handleFormDataChange("discount_type", "percentage");
                        }}
                        label="Percentage Discount"
                        checked={formData.discount_type === "percentage"}
                      />
                    </InlineStack>
                  </Box>
                  <Box></Box>

                  <Box>
                    <InlineGrid columns={2} gap="400">
                      <TextField
                        value={formData.discount_value}
                        onChange={(value) => {
                          handleFormDataChange("discount_value", value);
                        }}
                        prefix={
                          formData.discount_type === "percentage" ? "%" : ""
                        }
                        type="number"
                        helpText={
                          formData.discount_type === "percentage"
                            ? "Enter value between 1 and 100"
                            : "Enter Discount Amount"
                        }
                        placeholder="Number"
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
                        placeholder="E.g First Order Discount"
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
                          initialSelectionIds={formData.product_ids.map(
                            (variant) => {
                              return {
                                id: variant.id,
                                variants: variant.variants.map((varr) => {
                                  return {
                                    id: varr.id,
                                  };
                                }),
                              };
                            }
                          )}
                          resourceType="Product"
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
                        {formData.product_ids.length > 0 ? (
                          <BlockStack gap="200">
                            {formData.product_ids.map((resource, index) => {
                              return (
                                <Card key={index}>
                                  <InlineStack
                                    align="space-between"
                                    blockAlign="center"
                                  >
                                    <InlineStack gap="200" blockAlign="start">
                                      <Thumbnail
                                        source={
                                          resource.images[0]?.originalSrc ||
                                          ImageIcon
                                        }
                                        alt="img"
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
                                    condition.type === "sku" ? (
                                      // || condition.type === "payment-method-type"
                                      <AddTag
                                        tags={condition.value}
                                        setTags={(value) => {
                                          handleConditionChange(
                                            index,
                                            "value",
                                            value
                                          );
                                        }}
                                      />
                                    ) : condition.type ===
                                      "payment-method-type" ? (
                                      <SearchAndSelect
                                        allowMultiple={true}
                                        selectionOption={discountPaymentOptions}
                                        selectedOptions={condition.value}
                                        setSelectedOptions={(value) => {
                                          handleConditionChange(
                                            index,
                                            "value",
                                            value
                                          );
                                        }}
                                      />
                                    ) : (
                                      <TextField
                                        max={100}
                                        min={0}
                                        placeholder="Enter Value"
                                        value={condition.value[0]}
                                        type="number"
                                        onChange={(value) => {
                                          const newValue = value ? +value : "";
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
              <Button
                disabled={
                  formData.title === "" ||
                  formData.discount_value === "" ||
                  (!formData.discount_rule &&
                    formData.conditions.some(
                      (rule) =>
                        (Array.isArray(rule.value) &&
                          rule.value.length === 0) ||
                        rule.value.includes("")
                    ))
                }
                loading={btnLoading}
                onClick={() => handleCreateDiscount()}
                variant="primary"
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
