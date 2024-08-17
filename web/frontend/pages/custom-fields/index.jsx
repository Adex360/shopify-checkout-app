import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { PlanUpgradeWarning } from "../../components";
import {
  ActionList,
  BlockStack,
  Box,
  Button,
  Card,
  Collapsible,
  InlineGrid,
  InlineStack,
  Page,
  Popover,
  Text,
  TextField,
} from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";

const CustomsFields = () => {
  const navigate = useNavigate();
  const isSubscribed = true;

  const [customFields, setCustomFields] = useState([]);

  const [collapsibleIndex, setCollapsibleIndex] = useState("");
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const showFiledEditor = (index) => {
    index === collapsibleIndex
      ? setCollapsibleIndex("")
      : setCollapsibleIndex(index);
  };

  const addCustomField = (name) => {
    setCustomFields((prev) => {
      return [...prev, name];
    });
    togglePopoverActive(false);
    showFiledEditor(customFields.length);
  };

  const handleFieldDelete = (index) => {
    setCustomFields((prev) => {
      return prev.filter((_, i) => i !== index);
    });
    console.log(customFields);
  };

  const customFieldsOptions = [
    {
      content: "Text",
      onAction: () => {
        addCustomField("Text");
      },
    },
    { content: "Checkbox", onAction: () => addCustomField("Checkbox") },
    { content: "Divider", onAction: () => addCustomField("Divider") },
    { content: "Number", onAction: () => addCustomField("Number") },
    { content: "Select", onAction: () => addCustomField("Select") },
    { content: "Radio", onAction: () => addCustomField("Radio") },
    { content: "Date", onAction: () => addCustomField("Date") },
  ];

  const fieldsMarkup = customFields.map((field) => {
    if (field === "Text") {
      return <TextField>abcd</TextField>;
    }
  });

  console.log(fieldsMarkup);
  useEffect(() => {}, []);

  return (
    <>
      {!isSubscribed ? (
        <Page>
          <PlanUpgradeWarning />
        </Page>
      ) : (
        <Page
          title="Custom Fields"
          backAction={{
            onAction: () => {
              navigate("/");
            },
          }}
          primaryAction={{
            disabled: true,
            content: "Save",
          }}
        >
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <BlockStack gap="400">
              <Card>
                <TextField
                  label={<Text variant="headingMd">Form Name</Text>}
                  helpText="Unique form name to use it"
                  placeholder="e.g Form 1"
                />
              </Card>
              <Card>
                <Text variant="headingMd">Form Fields</Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "200px",
                  }}
                >
                  <Box paddingBlock="400">
                    <BlockStack gap="200">
                      {customFields &&
                        customFields?.map((field, index) => {
                          return (
                            <Card padding="200" key={index}>
                              <InlineStack
                                align="space-between"
                                blockAlign="center"
                              >
                                {field}
                                <InlineStack gap="200">
                                  {field === "Divider" ? (
                                    ""
                                  ) : (
                                    <Button
                                      variant="tertiary"
                                      icon={EditIcon}
                                      onClick={() => {
                                        showFiledEditor(index);
                                      }}
                                    />
                                  )}
                                  <Button
                                    variant="tertiary"
                                    icon={DeleteIcon}
                                    onClick={() => handleFieldDelete(index)}
                                  />
                                </InlineStack>
                              </InlineStack>
                              {field === "Divider" ? (
                                ""
                              ) : (
                                <Collapsible open={collapsibleIndex === index}>
                                  settings here
                                </Collapsible>
                              )}
                            </Card>
                          );
                        })}
                    </BlockStack>
                  </Box>
                  <div
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    <Popover
                      activator={
                        <Button
                          variant="primary"
                          icon={PlusIcon}
                          onClick={togglePopoverActive}
                        >
                          Add Field
                        </Button>
                      }
                      active={popoverActive}
                    >
                      <ActionList
                        actionRole="menuitem"
                        items={customFieldsOptions}
                      />
                    </Popover>
                  </div>
                </div>
              </Card>
            </BlockStack>
            <Card>
              <BlockStack gap="300">
                <Text variant="headingLg">Preview</Text>
                <BlockStack gap="200">{fieldsMarkup}</BlockStack>
              </BlockStack>
            </Card>
          </InlineGrid>
        </Page>
      )}
    </>
  );
};

export default CustomsFields;
