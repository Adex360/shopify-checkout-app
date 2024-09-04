import React from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { useParams } from "react-router-dom";
import { useAuthenticatedFetch } from "../../../hooks";
import { useAppContext } from "../../../context";
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";

const ProductDiscount = () => {
  const { loading, setLoading } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  console.log(id);
  return (
    <>
      <Page
        title="Create Product Discount "
        backAction={{
          onAction: () => navigate("/discounts"),
        }}
      >
        <Card>
          <BlockStack>
            <Box>
              <TextField
                helpText="Only visible to Admin"
                label={<Text variant="headingMd">Discount Title</Text>}
              />
            </Box>
          </BlockStack>
        </Card>
        <Box paddingBlock="400">
          <InlineStack align="end">
            <Button onClick={() => {}} variant="primary">
              {id === "create" ? "Create" : "Update"}
            </Button>
          </InlineStack>
        </Box>
      </Page>
    </>
  );
};

export default ProductDiscount;
