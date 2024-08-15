import React, { useEffect } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { CustomActionCard } from "../../components";
import { Badge, Card, InlineGrid, Layout, Link, Page } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../../hooks";

const PaymentCustomization = () => {
  const navigate = useNavigate();
  // const fetch = useAuthenticatedFetch();
  // const apitest = async () => {
  //   try {
  //     const resp = await fetch("api/v1/payment-customization");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   apitest();
  // }, []);
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
                title="Advance Payment rules(Hide/Delete)"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              nulla doloremque sapiente repudiandae suscipit tenetur sequi harum
              aperiam alias. Praesentium harum labrum obcaecati similique
              molestias dolorem asperiores unde atque ut?"
                action={
                  <>
                    <Link
                      onClick={() => {
                        navigate("/payment-customization/create/?type=hide");
                      }}
                    >
                      Create Customization
                    </Link>
                  </>
                }
              />

              <CustomActionCard
                title="Sort/Re-order"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              molestias dolorem asperiores unde atque ut?"
                action={
                  <>
                    <>
                      <Link
                        onClick={() => {
                          navigate(
                            "/payment-customization/create/?type=re-order"
                          );
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
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              molestias dolorem asperiores unde atque ut?"
                action={
                  <>
                    <Link
                      onClick={() => {
                        navigate("/payment-customization/create/?type=rename");
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
