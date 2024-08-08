import React from "react";
import { Banner, Button, Layout, Link, Page } from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";

const CheckoutCityList = () => {
  return (
    <>
      <Page>
        <Layout>
          <Layout.Section>
            <PlanUpgradeWarning shopifyPlusRequired={true} />
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default CheckoutCityList;
