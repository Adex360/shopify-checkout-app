import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  InlineGrid,
  InlineStack,
  Layout,
  Link,
  List,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { useAppContext } from "../context";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { PlanUpgradeWarning } from "../components";

export default function HomePage() {
  const { loading, setLoading, isSubscribed, shop } = useAppContext();
  const { count, activeCount } = shop;
  // const isSubscribed = shop.plan_status === "active";

  const shopifyFetch = useAuthenticatedFetch();

  const navigate = useNavigate();

  return (
    <>
      {!isSubscribed ? (
        <Page>
          <PlanUpgradeWarning />
        </Page>
      ) : (
        <>
          {loading ? (
            <div className="loading">
              <Spinner />
            </div>
          ) : (
            <Page>
              <Layout>
                <Layout.Section>
                  <Page title="DashBoard">
                    <BlockStack>
                      <InlineGrid columns={2} gap="400">
                        <Card roundedAbove="sm">
                          <Text as="h2" variant="headingSm">
                            Active Payment Customizations
                          </Text>
                          <Box paddingBlockStart="200">
                            <InlineStack gap="100">
                              <Text variant="headingMd">
                                {activeCount ? activeCount : "0"} / 5
                              </Text>
                              <Text as="p" variant="bodyMd">
                                acitve payment rule(s)
                              </Text>
                            </InlineStack>
                          </Box>
                          <InlineStack align="end">
                            <Link onClick={() => navigate("/payment")}>
                              View all
                            </Link>
                          </InlineStack>
                        </Card>
                        <Card roundedAbove="sm">
                          <Text as="h2" variant="headingSm">
                            Type of customizations you created
                          </Text>
                          <Box paddingBlockStart="200">
                            <InlineStack align="space-evenly">
                              <BlockStack inlineAlign="center">
                                <Text variant="headingMd">Hide</Text>
                                <Text variant="headingLg">
                                  {count ? count.hide : "-"}
                                </Text>
                              </BlockStack>
                              <BlockStack inlineAlign="center">
                                <Text variant="headingMd">Sort</Text>
                                <Text variant="headingLg">
                                  {count ? count["re-order"] : "-"}
                                </Text>
                              </BlockStack>
                              <BlockStack inlineAlign="center">
                                <Text variant="headingMd">Rename</Text>
                                <Text variant="headingLg">
                                  {count ? count.rename : "-"}
                                </Text>
                              </BlockStack>
                            </InlineStack>
                          </Box>
                        </Card>
                        {/* <Card roundedAbove="sm">
                          <Text as="h2" variant="headingSm">
                            Active city list of countries
                          </Text>
                          <Box paddingBlockStart="200">
                            <List type="bullet">
                              <List.Item>No citylist added</List.Item>
                            </List>
                          </Box>
                        </Card> */}
                      </InlineGrid>
                    </BlockStack>
                  </Page>
                </Layout.Section>
              </Layout>
            </Page>
          )}
        </>
      )}
    </>
  );
}
