import { Banner, Link, List, Text } from "@shopify/polaris";
import React from "react";

const PlanUpgradeWarning = ({ shopifyPlusRequired }) => {
  return (
    <>
      <Banner tone="warning" title="Feature unavailable">
        <List>
          <List.Item>
            This Feature is not available on your current plan.
            <Link>Upgrade your plan</Link>
          </List.Item>
          {shopifyPlusRequired && (
            <List.Item>
              <Text tone="critical">
                This Feature is only available for Shopify Plus plans
              </Text>
            </List.Item>
          )}
        </List>
      </Banner>
    </>
  );
};

export default PlanUpgradeWarning;
