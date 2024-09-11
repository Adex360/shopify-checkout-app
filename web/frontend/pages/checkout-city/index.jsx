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
  Link,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";
import { useAppContext } from "../../context";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../../hooks";

const CheckoutCityList = () => {
  const { isSubscribed, loading, setLoading, setDisabledCountriesCityList } =
    useAppContext();
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const [cityList, setCityList] = useState([]);
  const [btnLoadingIndex, setBtnLoadingIndex] = useState(-1);

  const getCityLists = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("api/v1/city-list");
      const data = await resp.json();
      if (resp.ok) {
        setCityList(data.getAll);
        setDisabledCountriesCityList(data.usedCountriesForCityList);
        setLoading(false);
      } else {
        show(data.error.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCityList = async (id, index) => {
    try {
      setBtnLoadingIndex(index);
      const resp = await shopifyFetch(`api/v1/city-list/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (resp.ok) {
        show(data.message);
        setCityList((prev) => {
          prev.splice(index, 1);
          return prev;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBtnLoadingIndex(-1);
    }
  };

  const tableRows = cityList?.map((data, index) => {
    return [
      data.country_name,
      data.enabled ? (
        <Badge tone="success-strong">Active</Badge>
      ) : (
        <Badge tone="attention-strong">Inactive</Badge>
      ),
      <Box width="200px">
        <Text truncate={true}>{data.city_list?.join(",")}</Text>
      </Box>,
      <ButtonGroup variant="segmented">
        <Button onClick={() => navigate(`/checkout-city/${data.id}`)}>
          Edit
        </Button>
        <Button
          disabled={btnLoadingIndex > -1}
          variant="primary"
          loading={btnLoadingIndex === index}
          onClick={() => handleDeleteCityList(data.id, index)}
        >
          Delete
        </Button>
      </ButtonGroup>,
    ];
  });

  useEffect(() => {
    isSubscribed && getCityLists();
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
              title="Checkout City Lists"
              primaryAction={{
                content: "Add City Lists",
                onAction: () => navigate("/checkout-city/create"),
              }}
            >
              <Layout>
                <Layout.Section>
                  <>
                    <Card>
                      {cityList.length > 0 ? (
                        <>
                          <DataTable
                            columnContentTypes={[
                              "text",
                              "text",
                              "text",
                              "text",
                            ]}
                            headings={[
                              <Text variant="headingMd">Country</Text>,
                              <Text variant="headingMd">Status</Text>,
                              <Text variant="headingMd">Cities</Text>,
                              "",
                            ]}
                            rows={tableRows}
                          />
                        </>
                      ) : (
                        <>
                          <EmptyState
                            heading="Add a payment customizations to get started"
                            action={{
                              content: "Add City List",
                              onAction: () => navigate("/checkout-city/create"),
                            }}
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                          >
                            <p>
                              It looks like you haven't added any city list yet.
                              Click the "Add City List" button to create your
                              own city list.
                            </p>
                          </EmptyState>
                        </>
                      )}
                    </Card>
                  </>
                </Layout.Section>
              </Layout>
            </Page>
          )}
        </>
      )}
    </>
  );
};

export default CheckoutCityList;
