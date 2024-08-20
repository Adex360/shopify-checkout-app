import React from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { Banner, Link, List, Text } from "@shopify/polaris";

const PlanUpgradeWarning = ({ shopifyPlusRequired }) => {
  const navigate = useNavigate();
  return (
    <>
      <Banner tone="warning" title="Feature unavailable">
        <List>
          <List.Item>
            This Feature is not available on your current plan.
            <Link onClick={() => navigate("/plans")}>Upgrade your plan</Link>
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
