import React from "react";
import {
  Banner,
  Button,
  Card,
  EmptyState,
  Layout,
  Link,
  Page,
} from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";
import { useNavigate } from "@shopify/app-bridge-react";

const PaymentCustomization = () => {
  const navigate = useNavigate();
  //  /////////////////////// States

  const isSubscribed = true;
  const customizationRules = null;

  /////////////////////

  return (
    <>
      {!isSubscribed ? (
        <Page>
          <PlanUpgradeWarning />
        </Page>
      ) : (
        <Page
          title="All Payment Customizations"
          primaryAction={{
            content: "Create payment customizations",
            onAction: () => navigate("/create-payment-customization"),
          }}
        >
          <Layout>
            <Layout.Section>
              {customizationRules ? (
                <>Table of Rules</>
              ) : (
                <>
                  <Card>
                    <EmptyState
                      heading="Add a payment customizations to get started"
                      action={{
                        content: "Create payment customizations",
                        onAction: () =>
                          navigate("/create-payment-customization"),
                      }}
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                      <p>
                        It looks like you haven't created any customization yet.
                        Click the "Create payment customizations" button to
                        create your own customization
                      </p>
                    </EmptyState>
                  </Card>
                </>
              )}
            </Layout.Section>
          </Layout>
        </Page>
      )}
    </>
  );
};

export default PaymentCustomization;
