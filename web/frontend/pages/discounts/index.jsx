import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  DataTable,
  EmptyState,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";
import { useAuthenticatedFetch } from "../../hooks";
import { useNavigate, useToast } from "@shopify/app-bridge-react";

const Discounts = () => {
  const { loading, isSubscribed, setLoading } = useAppContext();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [discounts, setDiscounts] = useState([]);

  const getDiscounts = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("api/v1/discount");
      const data = await resp.json();
      if (resp.ok) {
        setDiscounts(data.allDiscount);
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

  const deleteDiscount = async (id, index) => {
    try {
      setLoadingIndex(index);
      const resp = await shopifyFetch(`api/v1/discount/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (resp.ok) {
        show(data.message);
        setDiscounts((prev) => {
          const newArr = [...prev];
          newArr.splice(index, 1);
          return newArr;
        });
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIndex(-1);
    }
  };

  const tableRows = discounts.map((discount, index) => {
    return [
      discount.title,
      discount.enabled ? (
        <Badge tone="success-strong">Enabled</Badge>
      ) : (
        <Badge tone="warning-strong">Disabled</Badge>
      ),
      discount.discount_type,
      discount.discount_message,
      discount.discount_class,
      <ButtonGroup variant="segmented">
        <Button
          onClick={() =>
            navigate(
              `/discount-types/${discount.id}/?type=${discount.discount_class}`
            )
          }
          disabled={loadingIndex > -1}
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            deleteDiscount(discount.id, index);
          }}
          disabled={loadingIndex > -1}
          loading={loadingIndex === index}
          variant="primary"
        >
          Delete
        </Button>
      </ButtonGroup>,
    ];
  });

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
              <div className="">
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
              {discounts.length > 0 ? (
                <Card>
                  <DataTable
                    columnContentTypes={["text", "text", "text", "text"]}
                    headings={[
                      <Text variant="headingMd">Title</Text>,
                      <Text variant="headingMd">Status</Text>,
                      <Text variant="headingMd">Type</Text>,
                      <Text variant="headingMd">Message</Text>,
                      <Text variant="headingMd">Class</Text>,
                      "",
                    ]}
                    rows={tableRows}
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
