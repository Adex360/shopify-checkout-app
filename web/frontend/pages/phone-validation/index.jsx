import React from "react";
import { Banner, Button, Layout, Link, Page } from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";

const PhoneValidation = () => {
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

export default PhoneValidation;
