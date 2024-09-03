import React, { useState } from "react";
import {
  BlockStack,
  Box,
  Card,
  InlineStack,
  RadioButton,
  Text,
  TextField,
} from "@shopify/polaris";

const ValidationContainer = ({ title, data, setData }) => {
  // console.log(data);
  return (
    <Card>
      <BlockStack gap="400">
        <Box paddingBlock="200">
          <Text variant="headingMd">{title}</Text>
        </Box>
        <InlineStack gap="400">
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

        <InlineStack>
          <TextField
            type="number"
            label="Minimum Length"
            value={data.min_length}
            onChange={(value) => {
              setData("min_length", !value);
            }}
          />
        </InlineStack>
      </BlockStack>
    </Card>
  );
};

export default ValidationContainer;
