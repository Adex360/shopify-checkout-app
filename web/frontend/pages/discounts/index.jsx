import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import { Card, DataTable, EmptyState, Page, Spinner } from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";
import { useAuthenticatedFetch } from "../../hooks";
import { useNavigate, useToast } from "@shopify/app-bridge-react";

const Discounts = () => {
  const { loading, isSubscribed, setLoading } = useAppContext();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);

  const getDiscounts = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("api/v1/discount");
      const data = await resp.json();
      if (resp.ok) {
        setDiscounts(data.allDiscount);
        console.log(data);
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    isSubscribed && getDiscounts();
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
              <div className="loading">
                <PlanUpgradeWarning />
              </div>
            </Page>
          ) : (
            <Page
              title="Discounts"
              primaryAction={{
                content: "Add Discount",
                onAction: () => {
                  navigate("/discount-types");
                },
              }}
            >
              {discounts.length === 0 ? (
                <Card>
                  <DataTable
                    columnContentTypes={["text", "text", "text", "text"]}
                    headings={[]}
                    rows={[[]]}
                  />
                </Card>
              ) : (
                <Card>
                  <EmptyState
                    heading="Add discount to get started"
                    action={{
                      content: "Add Discount",
                      onAction: () => {
                        navigate("/discount-types");
                      },
                      // onAction: () => navigate("/payment-customization"),
                    }}
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  >
                    <p>
                      It looks like you haven't created any discount yet. Click
                      the "Add Discount" button to create your own customization
                    </p>
                  </EmptyState>
                </Card>
              )}
            </Page>
          )}
        </>
      )}
    </>
  );
};

export default Discounts;
