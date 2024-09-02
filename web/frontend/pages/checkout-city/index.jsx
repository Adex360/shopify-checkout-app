import React from "react";
import {
  Banner,
  Button,
  Card,
  EmptyState,
  Layout,
  Link,
  Page,
  Spinner,
} from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";
import { useAppContext } from "../../context";
import { useNavigate } from "@shopify/app-bridge-react";

const CheckoutCityList = () => {
  const { isSubscribed, loading } = useAppContext();
  const navigate = useNavigate();
  return (
    <>
      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
        <>
          {!isSubscribed ? (
            <Page>
              <PlanUpgradeWarning />
            </Page>
          ) : (
            <Page
              title="Checkout City Lists"
              primaryAction={{
                content: "Add City Lists",
                onAction: () => navigate("/checkout-city/create"),
              }}
            >
              <Layout>
                <Layout.Section>
                  <>
                    <Card>
                      <EmptyState
                        heading="Add a payment customizations to get started"
                        action={{
                          content: "Add City List",
                          onAction: () => navigate("/checkout-city/create"),
                        }}
                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                      >
                        <p>
                          It looks like you haven't added any city list yet.
                          Click the "Add City List" button to create your own
                          city list.
                        </p>
                      </EmptyState>
                    </Card>
                  </>
                </Layout.Section>
              </Layout>
            </Page>
          )}
        </>
      )}
    </>
  );
};

export default CheckoutCityList;
