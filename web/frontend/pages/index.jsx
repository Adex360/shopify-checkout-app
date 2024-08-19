import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineGrid,
  InlineStack,
  Layout,
  List,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { useAppContext } from "../context";

export default function HomePage() {
  const { loading } = useAppContext();
  return (
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
                        <Text as="p" variant="bodyMd">
                          0 / 5 acitve payment rule(s)
                        </Text>
                      </Box>
                      <InlineStack align="end">
                        <Button variant="plain">View all</Button>
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
                            <Text variant="headingLg">0</Text>
                          </BlockStack>
                          <BlockStack inlineAlign="center">
                            <Text variant="headingMd">Hide</Text>
                            <Text variant="headingLg">0</Text>
                          </BlockStack>
                          <BlockStack inlineAlign="center">
                            <Text variant="headingMd">Hide</Text>
                            <Text variant="headingLg">0</Text>
                          </BlockStack>
                        </InlineStack>
                      </Box>
                    </Card>
                    <Card roundedAbove="sm">
                      <Text as="h2" variant="headingSm">
                        Active city list of countries
                      </Text>
                      <Box paddingBlockStart="200">
                        <List type="bullet">
                          <List.Item>No citylist added</List.Item>
                        </List>
                      </Box>
                    </Card>
                  </InlineGrid>
                </BlockStack>
              </Page>
            </Layout.Section>
          </Layout>
        </Page>
      )}
    </>
  );
}
