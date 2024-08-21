import React, { useEffect } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { CustomActionCard } from "../../components";
import { Badge, Card, InlineGrid, Layout, Link, Page } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../../hooks";
import { useAppContext } from "../../context";

const PaymentCustomization = () => {
  const { shop } = useAppContext();
  const { count } = shop;
  const navigate = useNavigate();
  return (
    <>
      <Page
        title="Choose your customization type "
        backAction={{
          content: "",
          onAction: () => navigate("/payment"),
        }}
      >
        <Layout>
          <Layout.Section>
            <InlineGrid gap="400" alignItems="start" columns={2}>
              <CustomActionCard
                status={<Badge tone="attention">New</Badge>}
                activeNumbers={count.hide}
                title="Advance Payment rules(Hide/Delete)"
                description='The "Advance Payment Rules (Hide/Delete)" feature allows you to manage and enforce specific payment conditions during checkout. It enables the hiding or deletion of payment options based on predefined rules, ensuring that customers adhere to your advance payment requirements.'
                action={
                  <>
                    <Link
                      onClick={() => {
                        navigate("/payment-customization/hide/create");
                      }}
                    >
                      Create Customization
                    </Link>
                  </>
                }
              />

              <CustomActionCard
                activeNumbers={count["re-order"]}
                title="Sort/Re-order"
                description="Provides functionality to rearrange elements within the checkout process, allowing users to adjust the sequence of items or fields. This helps to optimize the order of operations and enhances the overall user experience by aligning the checkout flow with specific needs or preferences."
                action={
                  <>
                    <>
                      <Link
                        onClick={() => {
                          navigate("/payment-customization/re-order/create");
                        }}
                      >
                        Create Customization
                      </Link>
                    </>
                  </>
                }
              />
              <CustomActionCard
                title="Translate/Re-name"
                activeNumbers={count.rename}
                description="Allows users to modify the language and terminology used in the checkout process. This includes translating field labels, instructions, and other text elements into different languages or renaming them to better fit the brand's voice or specific regional preferences, ensuring clarity and consistency for all users."
                action={
                  <>
                    <Link
                      onClick={() => {
                        navigate("/payment-customization/rename/create");
                      }}
                    >
                      Create Customization
                    </Link>
                  </>
                }
              />
            </InlineGrid>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default PaymentCustomization;
