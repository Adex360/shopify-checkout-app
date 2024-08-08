import React from "react";
import { Banner, Button, Layout, Link, Page } from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";

const PaymentCustomization = () => {
  return (
    <>
      <Page>
        <Layout>
          <Layout.Section>
            <PlanUpgradeWarning />
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default PaymentCustomization;
