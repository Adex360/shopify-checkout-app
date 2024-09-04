import { Card, InlineStack, Badge, BlockStack, Text } from "@shopify/polaris";
import React from "react";

const CustomActionCard = ({
  title,
  description,
  action,
  status,
  activeNumbers,
}) => {
  return (
    <>
      <Card roundedAbove="sm">
        <BlockStack gap="100">
          <InlineStack blockAlign="center" align="space-between">
            <InlineStack blockAlign="center" gap="200">
              <Text variant="headingMd">{title}</Text>
              {status}
            </InlineStack>
            {/* <Text variant="headingMd"> {activeNumbers} / 5</Text> */}
          </InlineStack>
          <Text variant="bodyMd">{description}</Text>
          <InlineStack align="end">{action}</InlineStack>
        </BlockStack>
      </Card>
    </>
  );
};

export default CustomActionCard;
