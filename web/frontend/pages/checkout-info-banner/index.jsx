import React from "react";
import { Banner, Box, Button, Card, Page, Text } from "@shopify/polaris";
import { useAppContext } from "../../context";

const InfoBanner = () => {
  const { shop } = useAppContext();
  return (
    <>
      <Page>
        <Card>
          <Banner>
            <Text variant="headingMd">Custom Checkout Information Banner</Text>
            <Text>
              Enhance your checkout experience by displaying custom messages,
              promotions, or important information to your customers. Easily
              configure and manage banners that appear during the checkout
              process, ensuring your customers are informed every step of the
              way.
            </Text>
            <Box paddingBlockStart="400">
              <Button
                url={`https://admin.shopify.com/store/${shop.name.toLowerCase()}/settings/checkout`}
              >
                Go to Checkout Settings
              </Button>
            </Box>
          </Banner>
        </Card>
      </Page>
    </>
  );
};

export default InfoBanner;
