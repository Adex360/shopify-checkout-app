import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { PlanUpgradeWarning } from "../../../components";
import {
  ActionList,
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  ChoiceList,
  Collapsible,
  ColorPicker,
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
import { useAuthenticatedFetch } from "../../../hooks";
import { useParams } from "react-router-dom";

const CreateCustomFields = () => {
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { id } = useParams();
  const { show } = useToast();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [formName, setFormName] = useState("");
  const [customFields, setCustomFields] = useState([]);

  const exampleField = {
    Text: {
      label: "add label here",
      placeholder: "add placeholder here",
      width: "full",
    },
    Number: {
      label: "add label here",
      placeholder: "add placeholder here",
      width: "full",
    },
    Checkbox: {
      label: "add label here",
    },
    Divider: {
      size: "small",
      width: "full",
      color: "#b5b5b5",
    },
    Select: {
      label: "add label here",
      options: ["option1", "option2"],
    },
    Radio: {
      label: "add label here",
      options: ["option1", "option2"],
    },
    Date: {
      label: "add label here",
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
        { name: fieldType + v4(), type: fieldType, ...exampleField[fieldType] },
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
      setCustomFields((prev) => {
        const tempArr = [...prev];
        tempArr[index][name] = newValue;
        return tempArr;
      });
    } else {
      setCustomFields((prev) => {
        const tempArr = [...prev];
        tempArr[index][name] = value;
        return tempArr;
      });
    }
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
                handleSettingFieldsChange(key, value, index);
              }}
            />
          </>
        );
      } else if (key === "color") {
        return (
          <>
            <BlockStack gap="100">
              <Text variant="headingSm">{key}</Text>
              <ColorPicker
                color={customFields[index][key]}
                onChange={(value) => {
                  handleSettingFieldsChange(key, value, index);
                }}
              />
            </BlockStack>
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
        return (
          <hr
            style={{
              height: "1px",
              width: "100%",
              color: field.color,
              margin: "0",
            }}
          />
        );

      case "Select":
        console.log(typeof field.options);
        console.log(field.options, "selecett...........");
        const selectOptions = field.options.map((item) => ({
          label: item.trim(),
          value: item.trim(),
        }));
        return (
          <Select
            options={selectOptions}
            label={<Text variant="headingSm">{field.label}</Text>}
          />
        );

      case "Radio":
        console.log(typeof field.options);
        console.log(field.options, "radio..............123");
        const options = field.options.map((item) => ({
          label: item.trim(),
          value: item.trim(),
        }));
        return (
          <>
            <ChoiceList
              selected=""
              title={<Text variant="headingSm">{field.label}</Text>}
              choices={options}
              // options={field?.options?.split(",")?.map((item) => item.trim())}
            />
          </>
        );

      case "Date":
        return (
          <TextField
            label={<Text variant="headingSm">{field.label}</Text>}
            type="date"
          />
        );

      default:
        return null;
    }
  });

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
        show(data.message);
        setLoading(false);
        navigate("/custom-fields");
      } else {
        show(data.error, { isError: true });
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
            content: id !== "create" ? "Update" : "Save",
            onAction: () =>
              id === "create" ? handleSubmit() : updateCustomField(),
            loading: loading,
          }}
        >
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <BlockStack gap="400">
              <Card>
                <TextField
                  value={formName}
                  onChange={(value) => setFormName(value)}
                  onBlur={() => {
                    setFormName((prev) => prev.trim());
                  }}
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
                                <Text variant="headingMd">{field.type}</Text>
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

                              <Collapsible open={collapsibleIndex === index}>
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
                      onClose={() => setPopoverActive(false)}
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
  );
};

export default CreateCustomFields;
