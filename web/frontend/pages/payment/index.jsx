import React, { useEffect, useState } from "react";
import {
  Badge,
  Banner,
  Box,
  Button,
  ButtonGroup,
  Card,
  DataTable,
  EmptyState,
  Layout,
  Page,
  Spinner,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../../hooks";
import { useAppContext } from "../../context";

const Payment = () => {
  const { isSubscribed, shop, loading, setLoading } = useAppContext();
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const [btnLoadingIndex, setBtnLoadingIndex] = useState(-1);
  // const [loading, setLoading] = useState(false);
  const [customizationRules, setCustomizationRules] = useState([]);
  const [message, setMessage] = useState("");
  const getCustomization = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("api/v1/payment-customization/");
      const data = await resp.json();
      if (resp.ok) {
        setCustomizationRules(data.customizations);
        setMessage(data.message);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCustomization = async (id, index) => {
    try {
      setBtnLoadingIndex(index);
      const resp = await shopifyFetch(`api/v1/payment-customization/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (resp.ok) {
        show(data.message);
        setCustomizationRules((prev) => {
          prev.splice(index, 1);
          return prev;
        });
        setMessage(data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBtnLoadingIndex(-1);
    }
  };

  const tableRows = customizationRules?.map((data, index) => {
    const ruleCondition =
      data.type === "hide" ? (
        data.conditions?.map((condition, index) => {
          return ` ${index > 0 ? ", " : ""}${condition.type} ${condition.rule} ${condition.value}`;
        })
      ) : !data.payment_rule ? (
        data.conditions?.map((condition, index) => {
          return ` ${index > 0 ? ", " : ""}${condition.type} ${condition.rule} ${condition.value}`;
        })
      ) : (
        <Badge tone="critical-strong">No Condition</Badge>
      );
    return [
      data.title,
      data.type,
      data.rule_status ? (
        <Badge tone="success-strong">Active</Badge>
      ) : (
        <Badge tone="attention-strong">Inactive</Badge>
      ),
      <Box width="200px">
        <Text truncate={true}>{ruleCondition}</Text>
      </Box>,
      <ButtonGroup variant="segmented">
        <Button
          onClick={() =>
            navigate(`/payment-customization/${data.type}/${data.id}`)
          }
        >
          Edit
        </Button>
        <Button
          disabled={btnLoadingIndex > -1}
          variant="primary"
          loading={btnLoadingIndex === index}
          onClick={() => handleDeleteCustomization(data.id, index)}
        >
          Delete
        </Button>
      </ButtonGroup>,
    ];
  });

  useEffect(() => {
    isSubscribed && getCustomization();
  }, [isSubscribed]);

  return (
    <>
      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
        <>
          {!isSubscribed ? (
            <Page>
              <PlanUpgradeWarning />
            </Page>
          ) : (
            <Page
              title="All Payment Customizations"
              primaryAction={{
                disabled: customizationRules.length >= 5,
                content: "Create payment customizations",
                onAction: () => navigate("/payment-customization"),
              }}
            >
              <Layout>
                <Layout.Section>
                  {customizationRules.length !== 0 ? (
                    <>
                      <Box paddingBlock="200">
                        {customizationRules.length >= 5 && (
                          <Banner tone="warning" title="Limit Reached">
                            You have 5/5 customization active. Deactivate or
                            delete customization to create new customizations
                          </Banner>
                        )}
                      </Box>
                      <Card padding="0">
                        <DataTable
                          columnContentTypes={["text", "text", "text", "text"]}
                          headings={[
                            <Text variant="headingMd">Title</Text>,
                            <Text variant="headingMd">Rule</Text>,
                            <Text variant="headingMd">Rule Status</Text>,
                            <Text variant="headingMd">Condition</Text>,
                            "",
                          ]}
                          rows={tableRows}
                        />
                      </Card>
                    </>
                  ) : (
                    <>
                      <Card>
                        <EmptyState
                          heading="Add a payment customizations to get started"
                          action={{
                            content: "Create payment customizations",
                            onAction: () => navigate("/payment-customization"),
                          }}
                          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                          <p>
                            It looks like you haven't created any customization
                            yet. Click the "Create payment customizations"
                            button to create your own customization
                          </p>
                        </EmptyState>
                      </Card>
                    </>
                  )}
                </Layout.Section>
              </Layout>
            </Page>
          )}
        </>
      )}
    </>
  );
};

export default Payment;
