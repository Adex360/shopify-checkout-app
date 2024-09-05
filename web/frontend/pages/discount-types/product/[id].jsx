import React, { useEffect, useState } from "react";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { useParams } from "react-router-dom";
import { useAuthenticatedFetch } from "../../../hooks";
import { useAppContext } from "../../../context";
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
} from "@shopify/polaris";

const ProductDiscount = () => {
  const { loading, setLoading } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const shopifyFetch = useAuthenticatedFetch();

  const [formData, setFormData] = useState({
    enabled: true,
    title: "product discount",
    discount_type: "percentage",
    discount_value: "50.0",
    discount_message: "product discount",
    discount_rule: false,
    has_condition: false,
    conditions: [{ type: "total-amount", rule: "greater-than", value: 2000 }],
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
                  <Box width="50%">
                    <Card>
                      <InlineStack align="space-between">
                        <Text variant="headingMd">Variant Settings</Text>
                        <Button variant="primary">Add Product</Button>
                      </InlineStack>
                      <Box paddingBlock="400">
                        <Text>
                          Select products on which you want to apply the
                          discounts.
                        </Text>
                      </Box>
                    </Card>
                  </Box>

                  {!formData.discount_rule && (
                    <Box>
                      <Card>
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
                              <Card background="bg">
                                <BlockStack gap="200">
                                  <InlineGrid>
                                    <Select
                                      placeholder="Select Option"
                                      options={[
                                        {
                                          label: "Total Amount",
                                          value: "total-amount",
                                        },
                                        {
                                          label: "Sub Total Amount",
                                          value: "sub-total-amount",
                                        },
                                        {
                                          label: "SKU",
                                          value: "sku",
                                        },
                                        {
                                          label: "Cart Total Quantity",
                                          value: "cart-total-qty",
                                        },
                                        {
                                          label: "Single Line Quantity ",
                                          value: "single-line-qty",
                                        },
                                        {
                                          label: "All Line Quantity ",
                                          value: "all_line_qty",
                                        },
                                        {
                                          label: "Payment Method Type",
                                          value: "payment-method-type",
                                        },
                                        {
                                          label: "Payment Method Handle",
                                          value: "payment-method-handle",
                                        },
                                      ]}
                                    />
                                  </InlineGrid>
                                </BlockStack>
                              </Card>
                            </>
                          );
                        })}
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
