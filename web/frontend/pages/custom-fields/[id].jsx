import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { PlanUpgradeWarning } from "../../components";
import {
  ActionList,
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  ChoiceList,
  Collapsible,
  Divider,
  InlineGrid,
  InlineStack,
  Page,
  Popover,
  Select,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";

import { v4 } from "uuid";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../../hooks";
import { useParams } from "react-router-dom";

const CreateCustomFields = () => {
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { id } = useParams();

  const isSubscribed = true;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [formName, setFormName] = useState("");
  const [customFields, setCustomFields] = useState([]);

  const exampleField = {
    Text: {
      label: "",
      placeholder: "",
      width: "",
    },
    Number: {
      label: "",
      placeholder: "",
      width: "",
    },
    Checkbox: {
      label: "",
    },
    Divider: {
      size: "",
      width: "",
      color: "",
    },
    Select: {
      label: "",
      options: "",
    },
    Radio: {
      label: "",
      options: "",
    },
    Date: {
      label: "",
    },
  };

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
  const addCustomField = (fieldType) => {
    setCustomFields((prev) => {
      return [
        ...prev,
        { name: v4(), type: fieldType, ...exampleField[fieldType] },
      ];
    });

    togglePopoverActive(false);
    showFiledEditor(customFields.length);
  };

  const handleFieldDelete = (index) => {
    setCustomFields((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const customFieldsOptions = [
    { content: "Checkbox", onAction: () => addCustomField("Checkbox") },
    { content: "Text", onAction: () => addCustomField("Text") },
    { content: "Number", onAction: () => addCustomField("Number") },
    { content: "Divider", onAction: () => addCustomField("Divider") },
    { content: "Select", onAction: () => addCustomField("Select") },
    { content: "Radio", onAction: () => addCustomField("Radio") },
    { content: "Date", onAction: () => addCustomField("Date") },
  ];

  const handleSettingFieldsChange = (name, value, index) => {
    if (name === "options") {
      const newValue = value.split(",").map((item) => item);
      console.log(newValue);
      setCustomFields((prev) => {
        const tempArr = [...prev];
        tempArr[index][name] = newValue;
        return tempArr;
        // prev[index][name] = value
      });
    }

    setCustomFields((prev) => {
      const tempArr = [...prev];
      tempArr[index][name] = value;
      return tempArr;
      // prev[index][name] = value
    });
  };

  const getFieldSettings = (typeName, index) => {
    return Object.keys(customFields[index]).map((key) => {
      if (key === "fieldType") return;

      if (key === "label" || key === "placeholder" || key === "options") {
        return (
          <TextField
            size="slim"
            helpText={
              key === "options" && 'Enter multiple options with comma ","'
            }
            value={customFields[index][key]}
            label={<Text variant="headingSm">{key}</Text>}
            onChange={(value) => handleSettingFieldsChange(key, value, index)}
          />
        );
      } else if (key === "width" || key === "size") {
        const options = {
          width: ["half", "full"],
          size: ["small", "base", "large", "extraLarge"],
        };
        return (
          <>
            <Select
              label={<Text variant="headingSm">{key}</Text>}
              options={options[key]}
              value={customFields[index][key]}
              onChange={(value) => {
                console.log(value);
                handleSettingFieldsChange(key, value, index);
              }}
            />
          </>
        );
      }
    });
  };

  const fieldsPreviewMarkup = customFields.map((field) => {
    switch (field.type) {
      case "Text":
        return (
          <TextField
            label={<Text variant="headingSm">{field.label}</Text>}
            placeholder={field.placeholder}
            type="number"
            width={field.width}
          />
        );
      case "Number":
        return (
          <TextField
            label={<Text variant="headingSm">{field.label}</Text>}
            placeholder={field.placeholder}
            type="number"
            width={field.width}
          />
        );

      case "Checkbox":
        return (
          <Checkbox label={<Text variant="headingSm">{field.label}</Text>} />
        );

      case "Divider":
        return <Divider />;

      case "Select":
        return (
          <Select
            options={field.options.split(",").map((item) => ({
              label: item.trim(),
              value: item.trim(),
            }))}
            label={<Text variant="headingSm">{field.label}</Text>}
          />
        );

      case "Radio":
        console.log(field, "optionlist................................");
        return (
          <>
            <ChoiceList
              selected=""
              title={<Text variant="headingSm">{field.label}</Text>}
              choices={field.options.split(",").map((item) => ({
                label: item.trim(),
                value: item.trim(),
              }))}
              // options={field?.options?.split(",")?.map((item) => item.trim())}
            />
          </>
        );

      case "Date":
        return <TextField label={field.label} type="date" />;

      default:
        return null;
    }
  });

  const { show } = useToast();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("/api/v1/custom-fields/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formName,
          fields: customFields,
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        console.log(data);
        show(data.message);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getCustomFieldData = async () => {
    try {
      setPageLoading(true);
      const resp = await shopifyFetch(`/api/v1/custom-fields/${id}`);
      const data = await resp.json();
      if (resp.ok) {
        console.log(data);
        const { getByID } = data;
        setFormName(getByID.title);
        setCustomFields(getByID.fields);
        setPageLoading(false);
      } else {
        show(data.error, {
          isError: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCustomField = async () => {
    try {
      setLoading(true);

      const resp = await shopifyFetch(`/api/v1/custom-fields/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formName,
          fields: customFields,
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        console.log(data);
        show(data.message);
        setLoading(false);
        navigate("/custom-fields");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (id !== "create") {
      getCustomFieldData();
    }
  }, []);
  return (
    <>
      {!isSubscribed ? (
        <Page>
          <PlanUpgradeWarning />
        </Page>
      ) : (
        <>
          {pageLoading ? (
            <div className="loading">
              <Spinner />
            </div>
          ) : (
            <Page
              title="Custom Fields"
              backAction={{
                onAction: () => {
                  navigate("/custom-fields");
                },
              }}
              primaryAction={{
                disabled: !formName,
                content: id !== "" ? "Update" : "Save",
                onAction: () =>
                  id !== "" ? updateCustomField() : handleSubmit(),
                loading: loading,
              }}
            >
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <BlockStack gap="400">
                  <Card>
                    <TextField
                      value={formName}
                      onChange={(value) => setFormName(value)}
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
                                    <Text variant="headingMd">
                                      {field.type}
                                    </Text>
                                    <InlineStack gap="200">
                                      <Button
                                        variant="tertiary"
                                        icon={EditIcon}
                                        onClick={() => {
                                          showFiledEditor(index);
                                        }}
                                      />

                                      <Button
                                        variant="tertiary"
                                        icon={DeleteIcon}
                                        onClick={() => handleFieldDelete(index)}
                                      />
                                    </InlineStack>
                                  </InlineStack>

                                  <Collapsible
                                    open={collapsibleIndex === index}
                                  >
                                    <Box paddingBlockStart="200">
                                      <BlockStack gap="100">
                                        {getFieldSettings(field.type, index)}
                                      </BlockStack>
                                    </Box>
                                  </Collapsible>
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
                    <BlockStack gap="200">{fieldsPreviewMarkup}</BlockStack>
                  </BlockStack>
                </Card>
              </InlineGrid>
            </Page>
          )}
        </>
      )}
    </>
  );
};

export default CreateCustomFields;
