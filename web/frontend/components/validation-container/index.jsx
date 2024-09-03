import React, { useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  Collapsible,
  InlineStack,
  RadioButton,
  Text,
  TextField,
  useBreakpoints,
} from "@shopify/polaris";

const ValidationContainer = ({ title, data, setData, enable, setEnable }) => {
  const { smUp } = useBreakpoints();
  return (
    <Card background="bg">
      <Box paddingBlock="200">
        <InlineStack align="space-between">
          <Text variant="headingMd">{title}</Text>
          <Button
            onClick={() => setEnable()}
            variant="primary"
            tone={enable ? "critical" : "success"}
          >
            {" "}
            {enable ? "Disable" : "Enable"}
          </Button>
        </InlineStack>
      </Box>
      <Collapsible open={enable}>
        {data && (
          <BlockStack gap="400">
            <Box width={smUp ? "50%" : "100%"}>
              <InlineStack align="space-between">
                <RadioButton
                  label="Limit on Words"
                  checked={data.limit_type}
                  onChange={(value) => {
                    setData("limit_type", value);
                  }}
                />
                <RadioButton
                  label="Limit on Characters"
                  checked={!data.limit_type}
                  onChange={(value) => {
                    setData("limit_type", !value);
                  }}
                />
              </InlineStack>
            </Box>
            <Box>
              <InlineStack gap="400">
                <TextField
                  helpText="Enter the FirstName Minimum length"
                  type="number"
                  label={
                    <Text variant="headingSm" fontWeight="medium">
                      Minimum Length
                    </Text>
                  }
                  value={data.min_length}
                  onChange={(value) => {
                    setData("min_length", value);
                  }}
                />
                <TextField
                  helpText="Enter the FirstName Maximum length"
                  type="number"
                  label={
                    <Text variant="headingSm" fontWeight="medium">
                      Maximum Length
                    </Text>
                  }
                  value={data.max_length}
                  onChange={(value) => {
                    setData("max_length", value);
                  }}
                />
              </InlineStack>
            </Box>

            <Box width={smUp ? "50%" : "100%"}>
              <InlineStack align="space-between">
                <Checkbox
                  checked={data.block_digits}
                  label={
                    <Text variant="headingSm" fontWeight="medium">
                      Block Digits
                    </Text>
                  }
                  onChange={(value) => {
                    setData("block_digits", value);
                  }}
                />
                <Checkbox
                  checked={data.block_sequential_character}
                  label={
                    <Text variant="headingSm" fontWeight="medium">
                      Block Sequential Character
                    </Text>
                  }
                  onChange={(value) => {
                    setData("block_sequential_character", value);
                  }}
                />
              </InlineStack>
            </Box>
            <Box width={smUp ? "50%" : "100%"}>
              <BlockStack gap="100">
                <Text variant="headingMd">Special Characters</Text>
                <InlineStack align="space-between" gap="400">
                  <RadioButton
                    label="Don't block"
                    checked={data.special_character === "dont-block"}
                    onChange={() => {
                      setData("special_character", "dont-block");
                      setData("if_block_selected", []);
                    }}
                  />
                  <RadioButton
                    label="Block All"
                    checked={data.special_character === "block-all"}
                    onChange={() => {
                      setData("special_character", "block-all");
                      setData("if_block_selected", []);
                    }}
                  />
                  <RadioButton
                    label="Block Selective"
                    checked={data.special_character === "block-selective"}
                    onChange={() => {
                      setData("special_character", "block-selective");
                      setData("if_block_selected", []);
                    }}
                  />
                </InlineStack>
              </BlockStack>
            </Box>
            {data.special_character === "block-selective" && (
              <Box>
                <TextField
                  helpText="Enter all special characters you want to block separated by comma.(e.g $&},!)"
                  label={
                    <Text variant="headingSm" fontWeight="medium">
                      Block special characters
                    </Text>
                  }
                  value={data.if_block_selected.join(",")}
                  onChange={(value) => {
                    console.log(data);
                    setData(
                      "if_block_selected",
                      value.split(",").map((item) => item.trim())
                    );
                  }}
                />
              </Box>
            )}
          </BlockStack>
        )}
      </Collapsible>
    </Card>
  );
};

export default ValidationContainer;
