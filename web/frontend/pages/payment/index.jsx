import React, { useEffect, useState } from "react";
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  DataTable,
  EmptyState,
  Layout,
  Link,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../../hooks";

const Payment = () => {
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  //  /////////////////////// States
  const isSubscribed = true;
  // const customizationRules = null;
  const [btnLoadingIndex, setBtnLoadingIndex] = useState("");
  const [loading, setLoading] = useState(false);
  const [customizationRules, setCustomizationRules] = useState([]);
  /////////////////////

  const getCustomization = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("api/v1/payment-customization/");
      const data = await resp.json();
      if (resp.ok) {
        console.log(data.getAll[0]);

        setCustomizationRules(data.getAll);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  console.log(customizationRules);

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
      console.log(data);
      if (resp.ok) {
        show("Payment Customization Deleted!");
        setCustomizationRules((prev) => {
          prev.splice(index, 1);
          return prev;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBtnLoadingIndex("");
    }
  };

  const tableRows = customizationRules?.map((data, index) => {
    const ruleCondition = data.conditions?.map((condition, index) => {
      return ` ${index > 0 ? ", " : ""}${condition.type} ${condition.rule} ${condition.value}`;
    });
    return [
      data.title,
      data.type,
      data.rule_status ? "Active" : "Inactive",
      ruleCondition,
      <ButtonGroup variant="segmented">
        <Button>Edit</Button>
        <Button
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
    getCustomization();
  }, []);

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
                content: "Create payment customizations",
                onAction: () => navigate("/payment-customization"),
              }}
            >
              <Layout>
                <Layout.Section>
                  {customizationRules.length !== 0 ? (
                    <>
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
