import { Badge, InlineGrid, Layout, Link, Page } from "@shopify/polaris";
import React, { useState } from "react";
import { CustomActionCard } from "../../components";
import { useNavigate } from "@shopify/app-bridge-react";

const DiscountTypes = () => {
  const navigate = useNavigate();

  return (
    <>
      <Page
        title="Choose your customization type "
        backAction={{
          content: "",
          onAction: () => navigate("/discounts"),
        }}
      >
        <Layout>
          <Layout.Section>
            <InlineGrid gap="400" alignItems="start" columns={2}>
              <CustomActionCard
                title="Product Discount"
                description="Boost sales and enhance customer satisfaction with our Product Discount feature. Apply targeted discounts to specific products, with flexible options for percentage or fixed amount reductions. Tailor promotions to make your best-selling items even more appealing and drive more conversions."
                action={
                  <>
                    <Link
                      onClick={() => {
                        navigate("/discount-types/product/create");
                      }}
                    >
                      Create Discount
                    </Link>
                  </>
                }
              />

              <CustomActionCard
                title="Order Discount"
                description="Encourage larger purchases and reward loyal customers with our Order Discount feature. Offer percentage or fixed amount discounts on the total order value, with customizable rules to drive higher cart values and boost overall sales."
                action={
                  <>
                    <>
                      <Link
                        onClick={() => {
                          navigate("/discount-types/order/create");
                        }}
                      >
                        Create Discount
                      </Link>
                    </>
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

export default DiscountTypes;
