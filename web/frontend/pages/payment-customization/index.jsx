import React from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { CustomActionCard } from "../../components";
import { Badge, Card, InlineGrid, Layout, Link, Page } from "@shopify/polaris";

const PaymentCustomization = () => {
  const navigate = useNavigate();

  return (
    <>
      <Page
        title="Choose your customization type "
        backAction={{
          content: "adasd",
          onAction: () => navigate("/payment"),
        }}
      >
        <Layout>
          <Layout.Section>
            <InlineGrid gap="400" alignItems="start" columns={2}>
              <CustomActionCard
                status={<Badge tone="attention">New</Badge>}
                title="Advance Payment rules(Hide/Delete)"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              nulla doloremque sapiente repudiandae suscipit tenetur sequi harum
              aperiam alias. Praesentium harum labrum obcaecati similique
              molestias dolorem asperiores unde atque ut?"
                action={
                  <>
                    <Link
                      onClick={() => {
                        navigate(
                          "/payment-customization/create/?type=payment-customization"
                        );
                      }}
                    >
                      Create Customization
                    </Link>
                  </>
                }
              />
              <CustomActionCard
                status={<Badge tone="critical">Legacy</Badge>}
                title="Hide/Delete - Rule Set 1 - Single"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              nulla doloremque sapiente repudiandae suscipit tenetur sequi harum
              aperiam alias. Praesentium harum laborum obcaecati similique
              molestias dolorem asperiores unde atque ut?"
                action={
                  <>
                    <Link>Create Customization</Link>
                  </>
                }
              />

              <CustomActionCard
                status={<Badge tone="critical">Legacy</Badge>}
                title="Hide/Delete - Rule Set 2 - Multiple"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              nulla doloremque sapiente repudiandae suscipit tenetur sequi harum
              aperiam alias. Praesentium harum laborum obcaecati similique
              molestias dolorem asperiores unde atque ut?"
                action={
                  <>
                    <Link>Create Customization</Link>
                  </>
                }
              />
              <CustomActionCard
                title="Sort/Re-order"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              molestias dolorem asperiores unde atque ut?"
                action={
                  <>
                    <Link>Create Customization</Link>
                  </>
                }
              />
              <CustomActionCard
                title="Translate/Re-name"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              molestias dolorem asperiores unde atque ut?"
                action={
                  <>
                    <Link>Create Customization</Link>
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
