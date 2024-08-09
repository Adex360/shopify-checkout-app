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
  Text,
  useBreakpoints,
} from "@shopify/polaris";
import React from "react";
import { plansCardData } from "../../constants";

const Plans = () => {
  const { mdUp } = useBreakpoints();

  return (
    <>
      <Page title="Plans">
        <Layout>
          <Layout.Section>
            <InlineGrid columns={mdUp ? 4 : 2} gap="300">
              {plansCardData.map((plan, i) => {
                return (
                  <>
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
                              {plan.features.map((feature, i) => (
                                <List.Item key={i}>{feature}</List.Item>
                              ))}
                              <List.Item>
                                <Text variant="bodyMd">
                                  Payment Modification
                                </Text>
                              </List.Item>
                              <List.Item>Payment Modification</List.Item>
                              <List.Item>Payment Modification</List.Item>
                            </List>
                          </Box>
                          {plan?.comingSoon && (
                            <>
                              <Divider />

                              <Box paddingBlock="400">
                                <Text variant="headingMd">Cooming soon:</Text>
                                <List>
                                  {plan.comingSoon.map((feature, i) => {
                                    return (
                                      <List.Item key={i}>{feature}</List.Item>
                                    );
                                  })}
                                </List>
                              </Box>
                            </>
                          )}
                          {plan?.shopifyPlus && (
                            <>
                              <Box paddingBlock="400">
                                <Banner tone="critical">
                                  <Text>
                                    <Text variant="headingMd">Note:</Text>
                                    This Feature is only available for Shopify
                                    Plus plans
                                  </Text>
                                </Banner>
                              </Box>
                            </>
                          )}
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
                          <Button variant="primary">Select</Button>
                        </div>
                      </div>
                    </Card>
                  </>
                );
              })}
            </InlineGrid>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default Plans;
