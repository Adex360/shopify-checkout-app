import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineGrid,
  InlineStack,
  Layout,
  List,
  Page,
  Spinner,
  Text,
  useBreakpoints,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { features } from "../../constants";
import { useAuthenticatedFetch } from "../../hooks";
import { useNavigate } from "@shopify/app-bridge-react";
import { useAppContext } from "../../context";

const Plans = () => {
  const { shop, loading, setLoading } = useAppContext();
  const shopifyFetch = useAuthenticatedFetch();
  const [plans, setPlans] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const getPlans = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("/api/v1/plan");
      const data = await resp.json();
      if (resp.ok) {
        setPlans(data.plans);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const subscribe = async () => {
    try {
      setBtnLoading(true);
      const resp = await shopifyFetch("/api/v1/plan/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "essential",
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        navigate(data.confirmation_url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // subscribe();
    getPlans();
  }, []);
  return (
    <>
      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
        <Page title="Plans">
          <Layout>
            <Layout.Section>
              <InlineGrid
                key="plans_container"
                columns={2}
                alignItems="center"
                gap="300"
              >
                {plans?.map((plan, i) => {
                  return (
                    <Card key={i}>
                      <div>
                        <BlockStack>
                          <Box paddingBlockEnd="200">
                            <InlineStack align="center">
                              <Text variant="headingLg">{plan.name}</Text>
                            </InlineStack>
                          </Box>
                          <Divider />
                          <Box paddingBlock="400">
                            <InlineStack
                              gap="100"
                              align="center"
                              blockAlign="center"
                            >
                              <InlineStack blockAlign="center">
                                <Text variant="headingMd">$</Text>
                                <Text variant="heading3xl">{plan.price}</Text>
                              </InlineStack>
                              <Text variant="headingMd">/ Month</Text>
                            </InlineStack>
                          </Box>
                          <Divider />

                          <Box paddingBlock="200">
                            <Text variant="headingMd">Available:</Text>
                            <List>
                              <List.Item>feature</List.Item>
                              {features?.map((feature, i) => (
                                <List.Item key={i}>{feature}</List.Item>
                              ))}
                            </List>
                          </Box>
                        </BlockStack>
                        <div
                          style={{
                            height: "100",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="primary"
                            loading={btnLoading}
                            disabled={shop.plan_status === "active"}
                            onClick={() => subscribe()}
                          >
                            {shop.plan_status === "active"
                              ? "Subscribed"
                              : "Subscribe"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </InlineGrid>
            </Layout.Section>
          </Layout>
        </Page>
      )}
    </>
  );
};

export default Plans;
